var express =  require('express');
var router = express.Router();
var DButilsAzure = require('./DButils');

//4
router.get('/GetNumberOfViewsPOI/:idPOI', function(req,res){
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
router.put('/SetNumberOfViewsPOI',function(req,res){
	var body = req.body;
	var idPOI=body.idPOI;
	console.log(idPOI);
	DButilsAzure.execQuery("UPDATE Attraction SET views=views+1 where idPOI='" +req.body.idPOI+"';")
	.then((response)=>{
		console.log(response);
		res.send(response);
	})
	.catch((err)=>{
		console.log(err);
	})
});

//6
router.get('/getDescriptionPOI/:idPOI', function(req,res){
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
router.put('/SetDescriptionPOI',function(req,res){
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
router.put('/SetRatePOI',function(req,res){
	var body = req.body;
	var idPOI=body.idPOI;
	var Rate=body.Rate;
	console.log(idPOI);
	console.log(Rate);


	//add the rate to Rate table
	DButilsAzure.execQuery("INSERT INTO Rate (idPOI,Rate) VALUES('"+idPOI+"','"+Rate+"')")
	.then((response)=>{
		console.log(response);
		res.send(response);


			//update in attraction table the rate

			DButilsAzure.execQuery("UPDATE Attraction SET Rate=(SELECT((SELECT SUM(Rate) FROM Rate WHERE idPOI='"+idPOI+"')/(SELECT COUNT(Rate) FROM Rate WHERE idPOI='"+idPOI+"')))/5*100 where idPOI='"+idPOI+"';")
			.then((response)=>{
				console.log(response);
				res.send(response);
			})
			.catch((err)=>{
				console.log(err);
			})


	})
	.catch((err)=>{
		console.log(err);
	})


});

//9
router.get('/Get2RecentReviewsOfPOI/:idPOI', function(req,res){

	DButilsAzure.execQuery("SELECT TOP 2 * FROM Reviews where idPOI='" +req.params.idPOI+"'ORDER BY ID DESC;")
	.then((response)=>{
		console.log(response);
		res.send(response);

	})
	.catch((err)=>{
		console.log(err);
	})
});
//10
router.get('/Get3PopularPOI', function(req,res){
	DButilsAzure.execQuery("SELECT TOP 3 * FROM Attraction ORDER BY Rate DESC;")
	.then((response)=>{
		console.log(response);
		res.send(response);

	})
	.catch((err)=>{
		console.log(err);
	})
});

//13
router.get('/getCategoryPOI/:Category', function(req,res){
	DButilsAzure.execQuery("select * from Attraction where Category='" +req.params.Category+"';")
	.then((response)=>{
		console.log(response);
		res.send(response);
	})
	.catch((err)=>{
		console.log(err);
	})
});


//14
router.delete('/deletePOI', function(req,res){
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



//19
router.post('/addPOI',function(req,res){

	var name;
    var Description;
    var Category;
	console.log(name);
	console.log(Description);
	console.log(Category);
	DButilsAzure.execQuery("INSERT INTO Attraction (name,Description,Rate,Category,views) VALUES('"+req.body.name+"','"+req.body.Description+"',null,'"+req.body.Category+"','"+0+"');")
	.then((response)=>{
		console.log(response);
		res.send(response);

	})
	.catch((err)=>{
		console.log(err);
	})

});
//17
router.get('/getAllCategories', function(req,res){
	DButilsAzure.execQuery("SELECT Category FROM Categories;")
	.then((response)=>{
		console.log(response);
		res.send(response);
	})
	.catch((err)=>{
		console.log(err);
	})
});
//18
router.get('/getAllPOI', function(req,res){
	DButilsAzure.execQuery("SELECT * FROM Attraction;")
	.then((response)=>{
		console.log(response);
		res.send(response);
	})
	.catch((err)=>{
		console.log(err);
	})
});


module.exports=router;