var Rooms = function(){};

Rooms.prototype = {

	stack : {} ,
	
	bindSocketEvents : function( socket ){

		socket.room = "lobby";
		socket.join( socket.room );

		socket.on( "create room" , function( config ){

			try{

				config = JSON.parse( config );

				this.create( config );

				socket.broadcast.to( "lobby" ).emit( "room created" , JSON.stringify( { success : true } ) );
				socket.emit( "room created" , JSON.stringify( { success : true } ) );

			}

			catch( e ){

				console.log( e );

				socket.emit( "room created" , JSON.stringify( { success : false } ) );

			}

		}.bind( this ) );

		socket.on( "get rooms" , function(){

			socket.emit( "show rooms" , JSON.stringify( { success : true , data : this.stack } ) );

		}.bind( this ) );

		socket.on( "join room" , function( request ){

			if( request ){

				console.log( request );

				try{

					request = JSON.parse( request );

					if( request.roomId && request.player && this.stack[ request.roomId ] ){

						this.stack[ request.roomId ].players.push( request.player );

						console.log( "Seems fine" );

						socket.emit( "joined room" , JSON.stringify( { success : true } ) );
						socket.room = request.roomId;
						socket.join( socket.room );
						console.log( socket.room );
						socket.broadcast.to( socket.room ).emit( "get message" , JSON.stringify( { role : "bot" , from : "ראש העיר" , body : request.player.name + " נכנס לחדר" } ) );

					}

				}

				catch( e ){

					socket.emit( "joined room" , JSON.stringify( { success : false } ) );

				}

			}

		}.bind( this ) );

		socket.on( "send message" , function( message ){
			socket.broadcast.to( socket.room ).emit( "get message" , message );
			try{
				message = JSON.parse( message );
				message.role = "user";
				message = JSON.stringify( message );
			}
			catch( e ){

				console.log( e );

			}
			socket.emit( "get message" , message );
		} );

		socket.on( "leave room" , function( message ){

			try{

				message = JSON.parse( message );

				for( var i = 0 ; i < this.stack[ message.roomId ].players.length ; ++i ){

					if( this.stack[ message.roomId ].players[ i ].id == message.user.id ){

						this.stack.splice( i , 1 );

					}

				}

				socket.emit( "left room" , JSON.stringify( { success : true } ) );

				socket.broadcast.to( socket.room ).emit( "left room" , JSON.stringify );

				socket.leave( socket.room );

			}

			catch( e ){

				console.log( e );

			}

		} );

	} ,

	genRoomId : function(){	
		
		var uuid = "", i, random;

		for (i = 0; i < 32; i++) {
			random = Math.random() * 16 | 0;

			if (i == 8 || i == 12 || i == 16 || i == 20) {
				uuid += "-"
			}
			uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
		}
		return uuid;

	} ,

	create : function( config ){

		this.stack[ this.genRoomId() ] = {
			name : config.name || "Room" ,
			minPlayers : Math.max( config.minPlayers || 6 , 6 ) ,
			maxPlayers : Math.min( config.maxPlayers || 16 , 16 ) ,
			roomRestartPolitics : config.onGameEnd || "close" ,
			players : [] ,
			admin : ""
		};

	} ,

	leave : function(){} ,

	remove : function(){}

};

module.exports = new Rooms();