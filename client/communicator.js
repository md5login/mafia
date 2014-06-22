( function(){

	var ajax = function( conf ){

		var xhr = new XMLHTTPRequest;

		var url = conf.url || "/";
		var data = conf.data || {};
		var method = conf.method || "POST";
		var type = conf.type || "json";
		var callback = conf.callback || function(){};

		xhr.open( url , method , true );

		xhr.onreadystatechange = function(){

			if( xhr.readyState == 4 ){

				if( xhr.status == 200 ){

					if( xhr.response ){

						switch( type ){

							case "json" :

								try{

									callback( JSON.parse( xhr.response ) );

								}

								catch( e ){

									console.error( e );

								}

								break;

							deafult :

								callback( xhr.response );

								break;

						}

					}

				}

			}

		};

		xhr.send( JSON.stringify( data ) );

	};

	var Communicator = function(){

		if( !window.socket ){

			if( !window.io ) return console.error( "No socket support" );

			this.socket = io();

		}

		else this.socket = window.socket;

	};

	Communicator.prototype = {

		login : function( userName , callback ){

			this.socket.on( "user registered" , callback );
			this.socket.emit( "new user" , userName );

		} ,

		logout : function( callback ){} ,

		sendMsg : function( msg , callback ){} ,

		onChatMsg : function( msg , callback ){} ,

		onGameMsg : function(){} ,

		addRoom : function( roomName , callback ){} ,

		getRooms : function( callback ){

			this.socket.on( "room list" , callback )
			this.socket.emit( "get room" );

		} ,

		joinRoom : function( roomName , callback ){

		} ,

		leaveRoom : function( callback ){

		} ,

		emitCatcher : function(){}

	};

	window.comm = new Communicator();

} )();