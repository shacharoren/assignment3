var express =  require('express');
var router = express.Router();
var DButilsAzure = require('./DButils');
var jwt = require('jsonwebtoken');
const superSecret = new Buffer("ShaharToken","Base64"); 
var bodyParser = require('body-parser');
var router = express.Router();
var sql = require('mysql2');



//1
router.post('/login', function (req, res) {


    
    if (!req.body.UserName || !req.body.Password){
        res.send({ message: "login fail-bad values" })
        console.log(UserName);

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
//	var superSecret = "ShaharToken";
    var payload = {
		UserName: user
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
        //message: 'Enjoy your token!',
        token: token
	});
}	

//3
router.post('/restore', function(req,res){
	var body = req.body;
	var Password=body.Password;
	var UserName=body.UserName;
	var Answer1=body.Answer1;
	var Answer2=body.Answer2;
	console.log(Password);
	console.log(UserName);
	console.log(Answer1);
	console.log(Answer2);

	if (!req.body.UserName || !req.body.Answer1 || !req.body.Answer2){
		res.send({ message: "restore failed-bad values" })
	}
    else { 
		DButilsAzure.execQuery("select UserName,Answer1,Answer2,Password from users where UserName='" + req.body.UserName + "' AND Answer1='" + req.body.Answer1 + "'AND Answer2='" + req.body.Answer2 + "';")
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

			
//2
router.post('/register', function(req,res){
    var body = req.body;
    
         var FirstName=body.FirstName;
         var LastName=body.LastName;
         var City=body.City;
         var Country=body.Country;
         var Email=body.Email;
         var Category1=body.Category1;
         var Category2=body.Category2;
         var Answer1=body.Answer1;
         var Answer2=body.Answer2;
         var UserName=body.UserName;
         var Password=body.Password;
         console.log(UserName);
         console.log(Password);
         console.log(FirstName);
         console.log(LastName);
         console.log(City);
        console.log(Country);
        console.log(Email);
         console.log(Category1);
         console.log(Category2);
         console.log(Answer1);
         console.log(Answer2);
        DButilsAzure.execQuery("SELECT * FROM users where UserName='"+req.body.UserName+"';")
        .then((response)=>{
            if(response.length==0){
                DButilsAzure.execQuery("INSERT INTO users (UserName,Password,FirstName,LastName,City,Country,Email,Category1,Category2,Answer1,Answer2) VALUES('"+UserName+"','"+Password+"','"+FirstName+"','"+LastName+"','"+City+"','"+Country+"','"+Email+"','"+Category1+"','"+Category2+"','"+Answer1+"','"+Answer2+"')")
                .then((response)=>{
                    res.send({message: "Username: '" + req.body.UserName + "' Password:  '" + req.body.Password + "'"});
                })
                .catch((err)=>{
                    console.log(err);
                })
                }
            else{
                res.send({ message: "username is occupied, please choose another"})
            }
            console.log(response);
    
        })
        .catch((err)=>{
    
            console.log(err);
        })
    });

module.exports=router;