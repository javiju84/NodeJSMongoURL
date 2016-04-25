var express = require ("express");
var http = require ("http");
var app = express();
var mongo = require ("mongoskin");
var db = mongo.db("mongodb://localhost/ibex", {native_parser : true});

var request = require("request");


//var site = "http://www.quandl.com/api/v3/datasets/YAHOO/INDEX_IBEX.json"
//var site = "http://spancrow.hol.es/database/file2.json";
var site = "http://spancrow.hol.es/database/file.json";
function getData(cb){
	http.get(site,function(res){
		res.setEncoding("utf-8");

		var body = " ";
		res.on("data",function(d){
			body += d;
		});

		res.on("end", function(){
			try {
				var parsed = JSON.parse(body);
			} catch (err) {
				console.error("No se puede analizar la respuesta a JSON", err);
				return cb(err);
			}

			cb(
				parsed.objects
				);
		});
	}).on("error", function(err){
		console.error("Error con la solicitud:", err.message);
		cb(err);
	});
}

function writeData (data, allGood){
	console.log("escribiendo");
	console.log(typeof data);
	console.log(data);

	db.collection("database").insert(data, function(error,record){
		if (error) throw error;
		console.log("datos guardados")
	});
}

function allGood(){console.log("todo hecho");}

getData(writeData);


app.listen(8080);
console.log("Servidor conectado  puerto 8080")