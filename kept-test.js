
const assert = require( "assert" );
const kept = require( "./kept.js" );

assert.equal( kept( "./package.json", READ, true ), true, "should be true" );

kept( "./package.json", READ )
	( function exist( error, result ){
		assert.equal( result, true, "should be true" );

		console.log( "ok" );
	} );
