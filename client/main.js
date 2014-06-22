( function(){

	var Mafia = function(){};

	Mafia.prototype = {

	};

	window.Mafia = new Mafia();

	window.Mafia.users = {

		super : window.Mafia ,

		currentUser : "" ,

		create : function( name ){
			var name = document.getElementById( 'UserName' ).value;
			comm.login( name , function( response ){

				try{

					response = JSON.parse( response );

					if( response.success ){

						this.currentUser = name;
						this.super.rooms.showAll();

					}

					else{

						alert( "Error" );

					}

				}

				catch( e ){

					console.error( e );

				}

			}.bind( this ) );
		} ,

		destroy : function(){}

	};

	window.Mafia.rooms = {

		super : window.Mafia ,

		currentRoom : "" ,

		showAll : function(){

			comm.getRooms( function( response ){

				try{

					response = JSON.parse( response );

					if( response.success ){

						document.getElementById( "LoginRequest" ).style.display = "none";

						document.getElementById( "TabsContainer" ).style.display = "block";

					}

				}

				catch( e ){

					console.error( e );

				}

			}.bind( this ) )

		} ,

		join : function( roomName ){

			comm.joinRoom( roomName , function(){

				this.currentRoom = roomName;

			}.bind( this ) );

		} ,

		leave : function(){

			comm.leaveRoom( this.currentRoom , function(){

				this.currentRoom = "";

			}.bind( this ) );

		} ,

		add : function(){}

	};

} )();