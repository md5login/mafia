( function(){

	var Communicator = function(){

		if( !window.socket ){

			if( !window.io ) return console.error( "No socket support" );

			else this.socket = io();

		}

		else this.socket = window.socket;

	};

	Communicator.prototype = {

		emit : function( event , msg ){

			this.socket.emit( event , msg );

		} ,

		bind : function( event , callback ){

			this.socket.on( event , callback );

		}

	};

	window.comm = new Communicator();

} )();