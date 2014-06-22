var Url = require( "url" );
var connect = require( "connect" );
var fs = require( "fs" );

var app  = connect()
	.use( connect.static( __dirname ) )
	.use( function( req , res ){ res.end( "cool" ); } )
	.listen( 8080 );

var io = require( "socket.io" )( app );

io.on( "connection" , function( socket ){
	
	socket.on( "new user" , function( userName ){

		console.log( userName );

		socket.emit( "user registered" , JSON.stringify( { "success" : true } ) );

	} );

	socket.on( "get room" , function(){
		socket.emit( "room list" , JSON.stringify( { success : true } ) );
	} )

} );