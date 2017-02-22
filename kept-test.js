const kept = require( "./kept.js" );

console.log( kept( "./package.json", READ, true ) )

kept( "./package.json", READ )
	( function exist( error, result ){
		console.log( arguments );
	} );
