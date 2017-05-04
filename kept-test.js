const assert = require( "assert" );
const kept = require( "./kept.js" );

assert.equal( kept( "./package.json", READ, true ), true, "should be true" );

kept( "./package.json", READ )
	( function exist( error, result ){
		console.log( arguments );
	} );

console.log( "ok" );
