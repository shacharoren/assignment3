//this is only an example, handling everything is yours responsibilty !
//this is an example - open and close the connection in each request
// טוב אחכ אסביר לך, זה בתאכלס סוגר את כל הפינה של ההתחברות  ועבודה עם אזור
//   לא מאמין לך.. איך לא ראינו את זה ?מ הזה  זהמה? שמנסים שעה מה זה? הקובץ איפה הקוד ההוא  אה הנה הזה להתחבר לאזור בטח
var ConnectionPool = require('tedious-connection-pool');
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

var poolConfig = {
    min: 2,
    max: 5,
    log: true
};

var connectionConfig = {
    userName: 'shacharo',
    password: 'hrEsws6v',
    server: 'tripadviserserver.database.windows.net',
    options: { encrypt: true, database: 'PointOfInterest' }
};

//create the pool
var pool = new ConnectionPool(poolConfig, connectionConfig)

pool.on('error', function (err) {
    if (err) {
        console.log(err);
       
    }
});
console.log('pool connection on');


//----------------------------------------------------------------------------------------------------------------------
exports.execQuery = function (query) {
    return new Promise(function (resolve, reject) {

        try {

            var ans = [];
            var properties = [];

            //acquire a connection
            pool.acquire(function (err, connection) {
                if (err) {
                    console.log('acquire ' + err);
                    reject(err);
                }
                console.log('connection on');

                var dbReq = new Request(query, function (err, rowCount) {
                    if (err) {
                        console.log('Request ' + err);
                        reject(err);
                    }
                });

                dbReq.on('columnMetadata', function (columns) {
                    columns.forEach(function (column) {
                        if (column.colName != null)
                            properties.push(column.colName);
                    });
                });
                dbReq.on('row', function (row) {
                    var item = {};
                    for (i = 0; i < row.length; i++) {
                        item[properties[i]] = row[i].value;
                    }
                    ans.push(item);
                });

                dbReq.on('requestCompleted', function () {
                    console.log('request Completed: ' + dbReq.rowCount + ' row(s) returned');
                    console.log(ans);
                    connection.release();
                    resolve(ans);

                });
                connection.execSql(dbReq);

            });
        }
        catch (err) {
            reject(err)
        }
    });

};
