/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2016 Richeve Siodina Bebedor
		@email: richeve.bebedor@gmail.com

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"package": "kept",
			"path": "kept/kept.js",
			"file": "kept.js",
			"module": "kept",
			"author": "Richeve S. Bebedor",
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/kept.git",
			"test": "kept-test.js",
			"global": true
		}
	@end-module-configuration

	@module-documentation:
		Uses fs.accessSync to check for file existence.
	@end-module-documentation

	@include:
		{
			"fs": "fs",
			"harden": "harden",
			"letgo": "letgo",
			"optfor": "optfor",
			"zelf": "zelf"
		}
	@end-include
*/

var fs = require( "fs" );
var harden = require( "harden" );
var letgo = require( "letgo" );
var optfor = require( "optfor" );
var zelf = require( "zelf" );

harden( "EXIST", "exist" );
harden( "READ", "read" );
harden( "WRITE", "write" );
harden( "EXECUTE", "execute" );

var kept = function kept( path, mode, synchronous ){
	/*;
		@meta-configuration:
			{
				"path:require": "string",
				"mode": "string"
				"synchronous": "boolean"
			}
		@end-meta-configuration
	*/

	if( typeof path != "string" || !path ){
		throw new Error( "invalid path" );
	}

	mode = optfor( arguments, function check( parameter ){
		return parameter == EXIST ||
			parameter == READ ||
			parameter == WRITE ||
			parameter == EXECUTE;
	} );

	mode = kept.resolveMode( mode );

	synchronous = optfor( arguments, "boolean" );

	if( synchronous ){
		try{
			fs.accessSync( path, mode );

		}catch( error ){
			return false;
		}

		return true;

	}else{
		var self = zelf( this );

		var catcher = letgo.bind( self )( );

		fs.access( path, mode,
			function onAccess( error ){
				if( error ){
					catcher.cache.callback( null, false );

				}else{
					catcher.cache.callback( null,  true );
				}
			} );

		return catcher;
	}
};

harden( "resolveMode", function resolveMode( mode ){
	var type = fs.constants? fs.constants : fs;

	switch( mode ){
		case READ:
			return type.R_OK;

		case WRITE:
			return type.W_OK;

		case EXECUTE:
			return type.X_OK;

		default:
			return type.F_OK;
	}
}, kept );

module.exports = kept;
