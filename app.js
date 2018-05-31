//this is only an example, handling everything is yours responsibilty !
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
app.use(cors());
var DButilsAzure = require('./DButils');
var sql = require('mysql2');
var jwt = require('jsonwebtoken');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const superSecret = new Buffer("ShaharToken","Base64"); 

//for model
var users=require('./users');
var data=require('./data');
var auto=require('./auto');



var Connection = require('tedious').Connection;  
var config = {  
	userName: 'shacharo',  
	password: 'hrEsws6v',  
	server: 'tripadviserserver.database.windows.net',  
	// If you are on Microsoft Azure, you need this:  
	options: {encrypt: true, database: 'PointOfInterest'}  
};  
var connection = new Connection(config);  
connection.on('connect', function(err) {  
// If no error, then good to proceed.ץ
	console.log("Connected");  
});







app.use('/users',users)
app.use('/data',data)
app.use('/auto',auto)


var port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
//-------------------------------------------------------------------------------------------------------------------


