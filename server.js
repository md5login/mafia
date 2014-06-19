var http = require('http');
var Url = require( "url" );
var restify = require("restify");
var fs = require( "fs" );
var server = restify.createServer();
 

server.get("/", function (req, res, next) {
  	var parts = Url.parse(req.url,true);
  	var query = parts.query;
	res.header("Access-Control-Allow-Origin", "*");
	switch( query.action ){
	}
});

server.listen(1337);