var Url = require( "url" );
var connect = require( "connect" );
var fs = require( "fs" );

var app  = connect()
	.use( connect.static( __dirname ) )
	.use( function( req , res ){} )
	.listen( 8080 );

var io = require( "socket.io" )( app );

var main = new (require( "./server/main.js" ))( io );

io.on( "connection" , main.bindSocketEvents.bind( main ) );