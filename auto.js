var express =  require('express');
var router = express.Router();
var DButilsAzure = require('./DButils');
var jwt = require('jsonwebtoken');
const superSecret = new Buffer("ShaharToken","Base64"); 
var bodyParser = require('body-parser');
var router = express.Router();

var sql = require('mysql2');

router.use('/', function(req,res,next){            
    var token=req.body.token || req.query.token || req.headers['token'] ; 
    if (token) {
       jwt.verify(token, superSecret, function (err, decoded) {
       if (err) {
       return res.json({ success: false, message: 'Invalid token!' });
       } else {
       var decoded = jwt.decode(token, {complete: true});
       req.decoded= decoded; // decoded.payload , decoded.header
       next();
       }
   });
    }  
    else{
       res.send("Invalid token");
       res.end();
    }
   });



//11
router.get('/GetFavoritePOI', function(req,res){
	var token=req.headers['token'];
    var decoded=jwt.decode(token, {complete:true});   
	let UserName=decoded.payload.UserName;
	console.log(UserName);
	DButilsAzure.execQuery("SELECT * FROM UserAttractions where UserName='"+UserName+"';")
				.then(function(result){
					res.send(result)

			})
			.catch(function(err){
				res.send({ message: "rows didn't came back"})
				
			})
	
});
//12
router.post('/addToUserFavoritePOI', function(req,res){
	var token = req.body.token;
    var idPOI=req.body.idPOI;
    var decoded=jwt.decode(token, {complete:true});   
	let UserName=decoded.payload.UserName;
    console.log(UserName);
	DButilsAzure.execQuery("INSERT INTO UserAttractions(UserName,idPOI) VALUES('"+UserName+"','"+req.body.idPOI+"');")
				.then(function(result){
				res.send({ message: "POI added successfully"})

			})
			.catch(function(err){
				res.send({ message: "rows didn't came back"})
				
			})

});


//15
router.delete('/deleteFromSaved', function(req,res){

	var token = req.body.token;
	var idPOI=req.body.idPOI;
    var decoded=jwt.decode(token, {complete:true});   
	let UserName=decoded.payload.UserName;
	console.log(UserName);
	console.log(idPOI);
    console.log(token);

	DButilsAzure.execQuery("DELETE from UserAttractions where idPOI='"+req.body.idPOI+"' AND UserName='"+UserName+"';")
				.then(function(result){
				res.send({ message: "POI delete successfully"})

			})
			.catch(function(err){
				res.send({ message: "rows didn't came back"})
				
			})
});
//16
router.post('/addNewReview',function(req,res){
	var token = req.body.token;
	var idPOI=req.body.idPOI;
	var reviews= req.body.reviews;
    var decoded=jwt.decode(token, {complete:true});  
    console.log("******dfgdfg****");
	let UserName=decoded.payload.UserName;
	DButilsAzure.execQuery("INSERT INTO Reviews(idPOI,reviews) VALUES('"+req.body.idPOI+"','"+req.body.reviews+"');")
				.then(function(result){
				res.send({ message: "review added successfully"})

			})
			.catch(function(err){
				res.send({ message: "add review fail"})
				
			})
});









module.exports=router;