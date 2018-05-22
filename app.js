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
// If no error, then good to proceed.  
	console.log("Connected");  
});




app.get('/about/:name', function(req,res){

	var name = req.params.name;
	DButilsAzure.execQuery("select * from users where name = '" + name + "'")
	.then((response)=>{
		console.log(response);
		res.send(response);
	})
	.catch((err)=>{
		console.log(err);
	})
});


// app.get('/try/:id', function(req,res){

// 	DButilsAzure.execQuery("select * from users where id="+req.params.id+";")
// 	.then((response)=>{
// 		console.log(response);
// 		res.send(response);
// 	})
// 	.catch((err)=>{
// 		console.log(err);
// 	})
// });

// app.post('/try', function(req,res){

// 	DButilsAzure.execQuery("DELETE from users where name='"+req.body.name+"';")
// 	.then((response)=>{
// 		console.log(response);
// 		res.send(response);
// 	})
// 	.catch((err)=>{
// 		console.log(err);
// 	})
// });


//user=register
//1 - login

//1
app.post('/login', function (req, res) {
    if (!req.body.UserName || !req.body.Password){
		res.send({ message: "login fail-bad values" })
	}
    else { 
		DButilsAzure.execQuery("select UserName,Password from users where UserName='" + req.body.UserName + "' AND Password='" + req.body.Password + "';")
		.then(function(result){
			if(result.length>0){
				sendToken(req.body.UserName, res)
				res.send({ message: "login success"})

			}
			else{
				res.send({ message: "login failed"})
			}
		})
		.catch(function(err){
			res.send({ message: "rows didn't came back"})
		})

    }

})

function sendToken(user, res) {
	var superSecret = "ShaharToken";
    var payload = {
		UserName: user
		//password: user.password
        // admin: user.isAdmin
    }

     var token = jwt.sign(payload, superSecret, {
         expiresIn: "1d" // expires in 24 hours
     });
	 DButilsAzure.execQuery("UPDATE users SET token='"+token+"' where UserName='"+user+"';")
	 .then((response)=>{
		 console.log(response);
		 res.send({message: "token added successfully"});
	 })
	 .catch((err)=>{
		 console.log(err);
	 })
    // return the information including token as JSON
    res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token
	});
}	
	// add token to DB
				
//2
app.post('/register', function(req,res){
var body = req.body;
console.log("start");
	 var FirstName=body.FirstName;
	 var LastName=body.LastName;
	 var City=body.City;
	 var Country=body.Country;
	var Email=body.Email;
	 var Category1=body.Category1;
	 var Category2=body.Category2;
	 var Answer=body.Answer;
	 var UserName=Email;
	 var Password=FirstName;
	 console.log(UserName);
	 console.log(Password);
	 console.log(FirstName);
	 console.log(LastName);
	 console.log(City);
	console.log(Country);
	console.log(Email);
	 console.log(Category1);
	 console.log(Category2);
	 console.log(Answer);
	 console.log("before write to DB");
	//res.send({message: "username:"+Email+" username:"+username+" password: "+Password+" country: "+Country});
	DButilsAzure.execQuery("INSERT INTO users (UserName,Password,FirstName,LastName,City,Country,Email,Category1,Category2,Answer) VALUES('"+UserName+"','"+Password+"','"+FirstName+"','"+LastName+"','"+City+"','"+Country+"','"+Email+"','"+Category1+"','"+Category2+"','"+Answer+"')")
	.then((response)=>{
		res.send({message: "Username: username: password:  country:"});
		//console.log(response);
		// res.send({user_name: username, pass: Password, token: token});
	})
	.catch((err)=>{
		//console.log(err);
	})
});

//3
app.post('/restore', function(req,res){
	var body = req.body;
	var Password=body.Password;
	var UserName=body.UserName;
	var Answer=body.Answer;
	console.log(UserName);
	console.log(Answer);
	console.log(Password);

	if (!req.body.UserName || !req.body.Answer ){
		res.send({ message: "restore failed-bad values" })
	}
    else { 
		DButilsAzure.execQuery("select UserName,Answer,Password from users where UserName='" + req.body.UserName + "' AND Answer='" + req.body.Answer + "';")
		.then(function(result){
			if(result.length>0){
				res.send({ message: "restore succeed your password is:"+result[0].Password})

			}
			else{
				res.send({ message: "restore failed you enterd wrong values"})
			}
		})
		.catch(function(err){
			res.send({ message: "rows didn't came back"})
		})

    }

});
//4
app.get('/GetNumberOfViewsPOI/:idPOI', function(req,res){
	DButilsAzure.execQuery("select views from Attraction where idPOI='" +req.params.idPOI+"';")
	.then((response)=>{
		console.log(response);
		res.send(response);
	})
	.catch((err)=>{
		console.log(err);
	})
});

//5
app.put('/SetNumberOfViewsPOI/:idPOI',function(req,res){
	DButilsAzure.execQuery("UPDATE Attraction SET views=views+1 where idPOI='" +req.params.idPOI+"';")
	.then((response)=>{
		console.log(response);
		res.send(response);
	})
	.catch((err)=>{
		console.log(err);
	})
});

//6
app.get('/getDescriptionPOI/:idPOI', function(req,res){
	DButilsAzure.execQuery("select Description from Attraction where idPOI='" +req.params.idPOI+"';")
	.then((response)=>{
		console.log(response);
		res.send(response);
	})
	.catch((err)=>{
		console.log(err);
	})
});

//7
app.put('/SetDescriptionPOI',function(req,res){
	var body = req.body;
	var idPOI=body.idPOI;
	var Description=body.Description;
	console.log(idPOI);
	console.log(Description);

	DButilsAzure.execQuery("UPDATE Attraction SET Description='" +req.body.Description+"' where idPOI='" +req.body.idPOI+"';")
	.then((response)=>{
		console.log(response);
		res.send(response);

	})
	.catch((err)=>{
		console.log(err);
	})

});

//8
app.put('/SetRatePOI',function(req,res){
	var body = req.body;
	var idPOI=body.idPOI;
	var Rate=body.Rate;
	console.log(idPOI);
	console.log(Rate);

	//update in attraction table the rate
	DButilsAzure.execQuery("UPDATE Attraction SET Rate=(SELECT((SELECT((SELECT SUM(Rate) FROM Rate WHERE idPOI='" +req.body.idPOI+"')+'" +req.body.Rate+"'))/(SELECT COUNT(Rate) FROM Rate WHERE idPOI='" +req.body.idPOI+"'))) where idPOI='" +req.body.idPOI+"';")
	.then((response)=>{
		console.log(response);
		res.send(response);
	})
	.catch((err)=>{
		console.log(err);
	})
	//add the rate to Rate table
	DButilsAzure.execQuery("INSERT INTO Rate (idPOI,Rate) VALUES('"+idPOI+"','"+Rate+"')")
	.then((response)=>{
		console.log(response);
		res.send(response);

	})
	.catch((err)=>{
		console.log(err);
	})

});


//9
app.get('/Get2RecentReviewsOfPOI/:idPOI', function(req,res){

	DButilsAzure.execQuery("SELECT TOP 2 * FROM Reviews where idPOI='" +req.params.idPOI+"'ORDER BY ID DESC;")
	.then((response)=>{
		console.log(response);
		res.send(response);

	})
	.catch((err)=>{
		console.log(err);
	})
});
//Get3PopularPOI
//10
app.get('/Get3PopularPOI', function(req,res){
	DButilsAzure.execQuery("SELECT TOP 3 * FROM Attraction ORDER BY Rate DESC;")
	.then((response)=>{
		console.log(response);
		res.send(response);

	})
	.catch((err)=>{
		console.log(err);
	})
});

//11

//12
app.get('/GetFavoritePOI/:idPOI', function(req,res){
	DButilsAzure.execQuery("SELECT * FROM UserAttractions where userid='"+req.params.idPOI+"';")
	.then((response)=>{
		console.log(response);
	//	res.send(response);
		var arrayOfUserAttraction = response.slice();
		var favoriteList;
		var i;
		for(i=0;i<arrayOfUserAttraction.length;i++){
			DButilsAzure.execQuery("select * from Attraction where idPOI='" +arrayOfUserAttraction[i].attractionId+"';")
			.then((response)=>{
				console.log(response);
				//favoriteList.push(response);
				//add item to list and return list 
				res.send(response);
	
			})
			.catch((err)=>{
				console.log(err);
			})
		}
		//res.send({ message: "checkcheck:"+arrayOfUserAttraction[0].attractionId})

		 


	})
	.catch((err)=>{
		console.log(err);
	})

	 

	// res.send({ message: "checkcheck:"+result[0].attractionId})

	
});

//addToUSerFavoritePOI
//13
app.post('/addToUSerFavoritePOI', function(req,res){
	var body = req.body;
	var idPOI=body.Password;
	var ID=body.ID;
	console.log(idPOI);
	console.log(ID);

	if (!req.body.idPOI || !req.body.ID ){
		res.send({ message: "restore failed-bad values" })
	}
    else { 
		DButilsAzure.execQuery("INSERT INTO UserAttractions(userid,attractionId) VALUES('"+req.body.ID+"','"+req.body.idPOI+"');")
		.then(function(result){
			res.send({ message: "POI added successfully"})

		})
		.catch(function(err){
			res.send({ message: "rows didn't came back"})
			
		})

    }

});

//14
//15

//17
app.get('/getCategoryPOI/:Category', function(req,res){
	DButilsAzure.execQuery("select * from Attraction where Category='" +req.params.Category+"';")
	.then((response)=>{
		console.log(response);
		res.send(response);
	})
	.catch((err)=>{
		console.log(err);
	})
});

//19
app.delete('/deleteFromSaved', function(req,res){
	var body = req.body;
	var idPOI=body.idPOI;
	console.log(idPOI);
	DButilsAzure.execQuery("DELETE from Attraction where idPOI='"+req.body.idPOI+"';")
	.then((response)=>{
		console.log(response);
		res.send(response);
	})
	.catch((err)=>{
		console.log(err);
	})
});

//20
app.post('/addNewReview',function(req,res){
	var body = req.body;
	var idPOI=body.idPOI;
	var review=body.review;
	console.log(idPOI);
	console.log(review);
	DButilsAzure.execQuery("INSERT INTO Reviews(idPOI,reviews) VALUES('"+req.body.idPOI+"','"+req.body.review+"');")
	.then((response)=>{
		console.log(response);
		res.send(response);

	})
	.catch((err)=>{
		console.log(err);
	})

});

//21
app.get('/getAllCategorys', function(req,res){
	DButilsAzure.execQuery("SELECT DISTINCT Category FROM Attraction;")
	.then((response)=>{
		console.log(response);
		res.send(response);
	})
	.catch((err)=>{
		console.log(err);
	})
});

//22
app.get('/getAllPOI', function(req,res){
	DButilsAzure.execQuery("SELECT * FROM Attraction;")
	.then((response)=>{
		console.log(response);
		res.send(response);
	})
	.catch((err)=>{
		console.log(err);
	})
});


var port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
//-------------------------------------------------------------------------------------------------------------------


