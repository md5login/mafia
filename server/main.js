var users = require( "./user.js" );
var rooms = require( "./room.js" );

var Main = function( io ){

	this.io = io;

};

Main.prototype = {

	users : users ,
	rooms : rooms ,

	bindSocketEvents : function( socket ){

		this.users.bindSocketEvents( socket );
		this.rooms.bindSocketEvents( socket );

	}

};

module.exports = Main;