"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2017 Richeve Siodina Bebedor
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
			"contributors": [
				"John Lenon Maghanoy <johnlenonmaghanoy@gmail.com>"
			],
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
			"depher": "depher",
			"fs": "fs",
			"falzy": "falzy",
			"harden": "harden",
			"letgo": "letgo",
			"protype": "protype",
			"raze": "raze",
			"zelf": "zelf"
		}
	@end-include
*/

const depher = require( "depher" );
const fs = require( "fs" );
const falzy = require( "falzy" );
const harden = require( "harden" );
const letgo = require( "letgo" );
const protype = require( "protype" );
const raze = require( "raze" );
const zelf = require( "zelf" );

harden( "EXIST", "exist" );
harden( "READ", "read" );
harden( "WRITE", "write" );
harden( "EXECUTE", "execute" );

const kept = function kept( path, mode, synchronous ){
	/*;
		@meta-configuration:
			{
				"path:require": "string",
				"mode": "string"
				"synchronous": "boolean"
			}
		@end-meta-configuration
	*/

	if( !protype( path, STRING ) || falzy( path ) ){
		throw new Error( "invalid path" );
	}

	let parameter = raze( arguments );

	mode = depher( parameter, [ EXIST, READ, WRITE, EXECUTE ], EXIST );

	let type = fs.constants? fs.constants : fs;
	if( mode == READ ){
		mode = type.R_OK;

	}else if( mode == WRITE ){
		mode = type.W_OK;

	}else if( mode == EXECUTE ){
		mode = type.X_OK;

	}else if( mode == EXIST ){
		mode = type.F_OK;
	}

	synchronous = depher( parameter, BOOLEAN, false );

	if( synchronous ){
		try{
			fs.accessSync( path, mode );

		}catch( error ){
			return false;
		}

		return true;

	}else{
		let self = zelf( this );

		let catcher = letgo.bind( self )( function later( cache ){
			fs.access( path, mode,
				function done( error ){
					if( error ){
						cache.callback( error, false );

					}else{
						cache.callback( null, true );
					}

					catcher.release( );
				} );
		} );

		return catcher;
	}
};

module.exports = kept;
