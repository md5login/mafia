var Users = function(){};

Users.prototype = {

	stack : {} ,

	bindSocketEvents : function( socket ){

		socket.on( "create user" , function( name ){

			var id = this.create( name );

			socket.emit( "user created" , JSON.stringify({
				success : true ,
				data : {
					id : id ,
					name : name
				}
			}) );

		}.bind( this ) );

	} ,

	genUserId : function(){	
		
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

	create : function( name ){

		var id = this.genUserId();

		this.stack[ id ] = name;

		return id;

	}

};

module.exports = new Users();