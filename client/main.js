( function(){

	var $ = function( selector ){

		return document.querySelectorAll( selector );

	};


	var Users = function(){};

	Users.prototype = {

		currentUser : "" ,

		create : function( name ){

			var name = document.getElementById( 'UserName' ).value;

			if( !name ) return alert( "Name is required" );

			comm.emit( "create user" , name );

		} ,

		userCreated : function( data ){

			try{

				data = JSON.parse( data );

				if( !data.success ) return console.log( "Could not create user" );

				this.currentUser = data.data;

				document.cookie = "mafia=" + JSON.stringify( data.data );

				this.super.rooms.getRooms();

			}

			catch( e ){

				console.log( "Something went wrong" );

			}
		} ,

		destroy : function(){} ,

		bindEvents : function(){

			comm.bind( "user created" , this.userCreated.bind( this ) );

		}

	};

	var Rooms = function(){};

	Rooms.prototype = {

		currentRoom : "" ,

		getRooms : function(){			

			comm.emit( "get rooms" , "" );

		} ,

		sendMessage : function( event ){

			if( event.keyCode == 13 ){

				comm.emit( "send message" , JSON.stringify( { from : this.super.users.currentUser.name , body : event.target.value } ) );

			}

		} ,

		getMessage : function( message ){

			try{

				message = JSON.parse( message );

				$( "#ChatOutput" )[ 0 ].innerHTML += "<p class='" + ( message.role ? "message-" + message.role : "" ) + "'><span class='message-sender'>" + message.from + ": </span><span class='message-body'>" + message.body + "</span></p>";
				$( "#ChatInput" )[ 0 ].value = "";

			}

			catch( e ){

				console.log( e );

			}

		} ,

		showRooms : function( response ){

				if( response ){

					try{

						response = JSON.parse( response );

						if( response.success ){

							this.renderRooms( response.data );

						}

					}

					catch( e ){

						console.error( e );

					}

				}

				document.getElementById( "LoginRequest" ).style.display = "none";

				document.getElementById( "TabsContainer" ).style.display = "block";

		} ,

		renderRooms : function( roomList ){

			var holder = $( "#TabsContainer" )[ 0 ];

			var children = $( "#TabsContainer .tab" );

			for( var i = 0 ; i < children.length - 1 ; ++i ){
				holder.removeChild( children[ i ] );
			}

			var newRoomButton = $( "#NewRoom" )[ 0 ];
 
			for( var i in roomList ){

				var tab = document.createElement( "div" );

				tab.id = i;
				tab.className = "tab";

				var htmlStr = "<header class='tab-header'>Room: " + roomList[ i ].name + "</header>";
				htmlStr += "<div class='tab-body'>";

				for( var j in roomList[ i ].players ){

					tab.innerHTML += "<p>" + roomList[ i ].players[ j ].name + "</p>";

				}

				htmlStr += "</div>";

				htmlStr += "<footer class='tab-footer'>";
				htmlStr += "<div class='tab-footer-info'></div>";
				htmlStr += "<div class='tab-footer-info'></div>";
				htmlStr += "</footer";

				tab.innerHTML = htmlStr;

				holder.insertBefore( tab , newRoomButton );

				tab.addEventListener( "click" , this.join.bind( this ) );

			}

		} ,

		join : function( event ){

			this.currentRoom = event.target.parentNode.id;

			comm.emit( "join room" , JSON.stringify({
				roomId : this.currentRoom ,
				player : this.super.users.currentUser
			}) );

		} ,

		openRoom : function( response ){

			try{

				response = JSON.parse( response );

				if( !response.success ) this.currentRoom = "";

				$( "#TabsContainer" )[ 0 ].style.display = "none";
				$( "#RoomPage" )[ 0 ].style.display = "block";

			}

			catch( e ){

				console.log( e );

				alert( "Could not join room." );

			}

		} ,

		leave : function(){

			comm.emit( "leave room" , JSON.stringify( { 
				roomId : this.currentRoom ,
				user : this.super.users.currentUser
			} ) );

		} ,

		leftRoom : function( response ){

			try{

				response = JSON.parse( response );

				if( !response.success ) return;

				else{

					this.currentRoom = "";

					$( "#TabsContainer" )[ 0 ].style.display = "block";
					$( "#RoomPage" )[ 0 ].style.display = "none";

					this.getRooms();

				}

			}

			catch( e ){

				console.log( e );

			}

		} ,

		create : function(){

			var name = $( "#NewRoomName" )[ 0 ].value;
			var minPlayers = $( "#MinRoomPlayers" )[ 0 ].value;
			var maxPlayers = $( "#MaxRoomPlayers" )[ 0 ].value;
			var onGameEnd = $( "#ClosePolitics" )[ 0 ].checked;

			comm.emit( "create room" , JSON.stringify( {
				name : name ,
				minPlayers : minPlayers ,
				maxPlayers : maxPlayers ,
				onGameEnd : onGameEnd
			} ) );

		} ,

		openNewRoomDialog : function(){

			$( "#CreateRoomDialog" )[ 0 ].style.display = "block";


		} ,

		clearDialog : function( message ){

			try{

				message = JSON.parse( message );

				if( !message.success ) alert( "Somthing went wrong" );

				this.getRooms();

			}

			catch( e ){

				console.log( e );

			}

			$( "#CreateRoomDialog" )[ 0 ].style.display = "none";

			$( "#NewRoomName" )[ 0 ].value = "";
			$( "#MinRoomPlayers" )[ 0 ].value = "";
			$( "#MaxRoomPlayers" )[ 0 ].value = "";
			$( "#ClosePolitics" )[ 0 ].checked = false;

		} ,

		bindEvents : function(){

			$( "#NewRoom" )[ 0 ].addEventListener( "click" , this.openNewRoomDialog.bind( this ) );
			$( "#AddNewRoom" )[ 0 ].addEventListener( "click" , this.create.bind( this ) );
			$( "#ChatInput" )[ 0 ].addEventListener( "keyup" , this.sendMessage.bind( this ) );

			comm.bind( "room created" , this.clearDialog.bind( this ) );
			comm.bind( "joined room" , this.openRoom.bind( this ) );
			comm.bind( "show rooms" , this.showRooms.bind( this ) );
			comm.bind( "get message" , this.getMessage.bind( this ) );
			comm.bind( "left room" , this.leftRoom.bind( this ) );

		}

	};

	var Mafia = function(){

		if( !window.comm ){

			return console.log( "Communicator not found" );

		}

		window.addEventListener( "hashchange" , this.navigate.bind( this ) );
		window.addEventListener( "load" , this.bindEvents.bind( this ) );

		this.users = new Users();
		this.users.super = this;

		this.rooms = new Rooms();
		this.rooms.super = this;

	};

	Mafia.prototype = {

		bindEvents : function(){

			this.parseCookie();

			this.users.bindEvents();
			this.rooms.bindEvents();

		} ,

		parseCookie : function(){

			if( ~document.cookie.indexOf( "user=" ) ){

				this.users.currentUser = JSON.parse( document.cookie.replace( "user=" , "" ) );

			}

			if( ~document.cookie.indexOf( "room=" ) ){

				this.rooms.currentRoom = JSON.parse( document.cookie.replace( "user=" , "" ) );

			}

		} ,

		navigate : function(){}

	};

	window.Mafia = new Mafia();

} )();