try {
	var lastChar = __APPLICATION_PATH__.charAt( __APPLICATION_PATH__.length - 1 );
	if ( lastChar != "/" ) __APPLICATION_PATH__ += "/";
} catch( exception ) {
	var __APPLICATION_PATH__ = "./";
}

/**
 * @since 0.3.2
 */
navigator.isChrome 				= navigator.appVersion.indexOf( "Chrome" ) > -1;

/**
 * @since 0.3.2
 */
navigator.isFirefox 			= navigator.appName.indexOf( "Netscape" ) > -1 && navigator.appVersion.indexOf( "Chrome" ) == -1 && navigator.appVersion.indexOf( "Safari" ) == -1; 

/**
 * @since 0.3.2
 */
navigator.isInternetExplorer	= navigator.appVersion.indexOf( "MSIE" ) > -1 || navigator.appVersion.indexOf( "Trident" ) > -1;

/**
 * @since 0.4.0
 */
navigator.isSafari     			= navigator.appVersion.indexOf( "Safari" ) > -1;

/**
 * @since 0.4.8
 */
navigator.isOpera				= navigator.appName.indexOf( "Opera") > -1;

/**
 * @since 0.4.0
 */
navigator.version = "Not actually supported for this browser";

if ( navigator.isInternetExplorer ) {
	navigator.version = parseFloat( navigator.appVersion.split( "MSIE" )[1] );
	if ( isNaN( navigator.version ) ) navigator.version = parseFloat( navigator.appVersion.split( "rv:" )[1] );
} else if ( navigator.isFirefox ) {
	navigator.version = parseFloat( navigator.userAgent.toLowerCase().split( "firefox/" )[1] );
} else if ( navigator.isChrome ) {
	navigator.version = parseFloat( navigator.userAgent.toLowerCase().split( "chrome/" )[1] );
} else if ( navigator.isSafari ) {
	navigator.version = parseFloat( navigator.userAgent.toLowerCase().split( "safari/" )[1] );
} else if ( navigator.isOpera ) {
	navigator.version = parseFloat( navigator.userAgent.toLowerCase().split( "version/" )[1] );
}

navigator.isMobile = navigator.userAgent.indexOf( "Mobile" ) != -1;

/**
 * Add new members to an existing prototype. The targeted prototype is associated to the constructor function name where this method is invoked
 * (example: String.extendPrototype add new member on the String prototype).
 * 
 * @param newMembers 		An array that contains all members to add on the associated prototype.
 * @param replace			A boolean that specify if existing members must be replaced or not. By default this parameter is set to false.
 * 
 * @since 0.2.14
 * @author Dominique Liard
 */
Function.prototype.extendPrototype = function ( newMembers, replace ) {

	for( member in newMembers ) {
		if ( this.prototype.member && ! replace ) continue;
		this.prototype[ member ] = newMembers[ member ];
	}

};

// On IE 7 & 8, extendPrototype method is not append on the Element type.
if ( navigator.isInternetExplorer && navigator.version < 9 ) {
    if ( ! window.Element ) window.Element = function() {}
}

// On some web browsers, Element type is handled strangely
if ( ! Element.extendPrototype ) Element.extendPrototype = Function.prototype.extendPrototype;


Function.extendPrototype( {

	/**
	 * Create a new pseudo class. A pseudo class is associated to one constructor function add its associated prototype.
	 * 
	 * <pre>
	 * Usage:
	 *     var ExtendedDate = Date.extendClass( {
	 *         newMethod : function() { ... }
	 *     } );
	 *     var instance = new ExtendedDate();
	 * </pre>
	 * 
	 * @param newMembers	An array that contains all members to add on the associated prototype.
	 * @return The new constructor function.
	 * 
	 * @since 0.2.14
	 * @author Dominique Liard
	 */
	// Usage : ParentType.extendClass( { ... } );
	extendClass : function extendClass( newMembers ) {		 /* WARNING : do not remove function name: it's used for check prototype construction */ 
		
		var newType = function() {
			try {
				var callerFunctionName = /\W*function\s+([\w\$]*)\(/.exec( arguments.callee.caller.toString() )[1];
				if ( callerFunctionName != null && callerFunctionName == "extendClass" ) {
					return;
				}
			} catch( error ) {
				/* Nothing to do */
			}

			if ( this.initialize ) {
				this.initialize.apply( this, arguments );
			}
		};
	
		newType.prototype = new this();
		for( member in newMembers ) newType.prototype[ member ] = newMembers[ member ];	
		
		return newType;
	}
});

Object.extendPrototype( {

	/**
	 * Returns a new object that correspond to the merging of this and <code>childOject</code> parameters.
	 * In case of conflit, it's the attributes of <code>childObject</code> that are maintened.
	 * <pre>
	 * Usage:
	 *     var newObject = object.extendObject({...});
	 * </pre>
	 * 
	 * @since 0.2.14
	 * @author Dominique Liard
	 */
	extendObject : function( childObject ) {
		var newObject = this.clone();
		for( var member in childObject )	newObject[member] = childObject[member];		
		return newObject;
	},


	/**
	 * Clones the current object. Each sub object is also recursivly cloned.
	 * 
	 * @return The new cloned instance.  
	 */
	clone : function (){

	    if ( typeof(this) != 'object' ) return this;
		
	    var temporaryObject = new this.constructor();
	    for( var key in this ) temporaryObject[key] = (typeof(this[key]) == 'object' ? this[key].clone() : this[key]);

	    return temporaryObject;
	}
});

Array.extendPrototype( {
	
	/**
	 * Checks if the specified value is present into this array.
	 * @param value The value to search
	 * @returns <code>true</code> is the value exists, <code>false<code> otherwise.
	 */
	contains : function( value ) {
	    for( var i=0; i<this.length; i++ ) {
	    	if ( value === this[i] ) return true; 
	    }
	    return false;
	},
	
	/**
	 * Removes the specified element into this array.
	 * @param element The element to remove.
	 * @since 0.4.5
	 */
	remove : function( element ){
		for( var index=0;index<this.length; index++ ) {
			if ( element == this[index]) this.splice( index, 1 );
		}
	}
	
} );

/**
 * Create window.XMLHttpRequest on older IEs (5.5 and 6.0).
 * @since 0.4.0
 */		// Successfull Tested on IE 6.0
if ( ! window.XMLHttpRequest ) {
	window.XMLHttpRequest = function () {
		if ( window.ActiveXObject ) {
			try {
				return new ActiveXObject("Msxml2.XMLHTTP");								// Internet Explorer 6.0
			} catch (e) {
				return new ActiveXObject("Microsoft.XMLHTTP");							// older Internet Explorer
			}
		} else {
			throw new Error( "This web browser can't support Ajax components" );		// Unknown browser
		}
	};
}

/**
 * This abstract class permit to do a AJAX call. You cannot use directly this class.
 * Prefer usage of <code>AjaxGetCall</code> or <code>AjaxPostCall</code> classes. 
 * @since 0.4.9
 */
var AjaxCall = Object.extendClass( {
	initialize: function( submitionMode, url, handleAs, async, timeout ) {
		var xhr = this.xhr = new XMLHttpRequest();
		var _this = this;
		handleAs = handleAs || "xml";
		timeout = timeout || 0;
		var clockId = null;
		
		try {
			if ( handleAs == "xml" ) this.xhr.overrideMimeType('text/xml');			
		} catch( exception ) {}
		
		xhr.onreadystatechange = function() {
			if ( xhr.readyState == 4 ) {
				if ( clockId != null ) window.clearTimeout( clockId );
				
				if ( xhr.status == 200 ) {
					if ( handleAs == "text" ) {
						_this.onLoaded( xhr.responseText );
					} else if ( handleAs == "xml" ) {
						_this.onLoaded( xhr.responseXML );						
					} else if ( handleAs == "json" ) {
						eval( "var jsonObject = " + xhr.responseText + ";" );
						_this.onLoaded( jsonObject );
					} else {
						throw new Exception( "handleAs: " + handleAs + " not supported" );
					} 
				} else {
					if ( _this.onError ) {
						_this.onError( xhr.responseText );
					}
				}
			}
		};
		xhr.open( submitionMode, url, async );
		if ( timeout > 0 ) {
			clockId = setTimeout( function() { xhr.abort(); }, timeout );
		}
	},
		
	send: function() {
		throw new AbstractException();	
	},
	
	abort: function () {
		this.xhr.abort();
	},
	
	setRequestHeader: function( key, value ) {
		this.xhr.setRequestHeader( key, value );
	},

	onLoaded: function( data ) {},
	
	onError: function() { throw new Exception( "Cannot execute AJAX call" ); }
});



/**
 * This class permit to do a GET AJAX call.
 * @since 0.4.0
 */
var AjaxGetCall = AjaxCall.extendClass( {
	initialize: function( url, handleAs, async, timeout ) {
		AjaxCall.prototype.initialize.call( this, "GET", url, handleAs, async, timeout );
		
	},
	
	send: function() {
		this.xhr.send();		
	}
});

/**
 * This class permit to do a POST AJAX call.
 * @since 0.4.9
 */
var AjaxPostCall = AjaxCall.extendClass( {
	initialize: function( url, handleAs, async, timeout ) {
		AjaxCall.prototype.initialize.call( this, "POST", url, handleAs, async, timeout );	
	},
	
	send: function( params ) {
		this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		//this.xhr.setRequestHeader("Content-length", params.length);
		//this.xhr.setRequestHeader("Connection", "close");
		this.xhr.send( params );		
	}
});

/**
 * Replace recursivly all HTML entities by there nomal values into all strings of the passed instance.
 * @param object	The instance to to be treated.
 * @since 0.5
 */			// Use in DataGrid
function entityRemover( object ) {
	for( var key in object ) {
		if ( typeof( object[key] ) == "string" ) {
			object[key] = object[key].replace( "&amp;", "&" ).replace( "&lt;", "<" ).replace( "&gt;", ">" ).replace( "&apos;", "'" ).replace( "&quot;", "\"" );
		} else if ( typeof( object[key] ) == "object" ) {
			entityRemover( object[key] );
		}
	}
}

/* **********************************************************************************
*** Permet de charger les fichiers de la librairie. Chacun des fichiers ne sera   ***
*** charger qu'une seule et unique fois.                                          ***
************************************************************************************/

var __importedPackages__ = new Array();
__importedPackages__.push( "corelib/services/web/javascript/Core.js" );

//var toRemove = "";

if ( typeof( importPackage ) == "undefined"  ) {				// Do not remove this test => is used by JavascriptMockedWebBrowser
	
	function importPackage( packagedTypeName ) {
	
	    if ( __importedPackages__.contains( packagedTypeName ) == false ) {
	        __importedPackages__.push( packagedTypeName );
	
//	        toRemove += packagedTypeName + "\n";
//	        alert( toRemove );
	        
	        try { 													// WEB Access

				var xhrGet = new XMLHttpRequest();
				xhrGet.open( "GET", __APPLICATION_PATH__ + packagedTypeName + "?ts=" + new Date().getTime(), false );
				xhrGet.send( null );
				var scriptNode = document.createElement( "script" );
				document.getElementsByTagName("head")[0].appendChild( scriptNode );
				scriptNode.type = "text/javascript";
				if ( navigator.isInternetExplorer && navigator.version < 9 ) {
					scriptNode.text = "<!--\n" + xhrGet.responseText + "\n//-->\n";
				} else {
				    scriptContentNode = document.createTextNode( "<!--\n" + xhrGet.responseText + "\n//-->\n" );
				    scriptNode.appendChild( scriptContentNode );
				}
				xhrGet.abort();
	        	
	        } catch( exception ) {									// Hard Drive Access
	        	alert( "importPackage: " + exception );
				window.document.write( "<script type='text/javascript' src='" + __APPLICATION_PATH__ + packagedTypeName + "'></script>\n" );
	        }
	    }
	
	}
}

importPackage( "corelib/services/web/javascript/Exception.js" );
importPackage( "corelib/services/web/javascript/Form.js" );
importPackage( "corelib/services/web/javascript/Debug.js" );
importPackage( "corelib/services/web/javascript/L10N.js" );
importPackage( "corelib/services/web/javascript/jwt/JwtUtility.js" );

/**
 * Adds a new event handler for the considered event in the specified DOM element.
 * @param node			The element that contains the event handler to add.
 * @param eventName		The considered event name.
 * @param handler		The event handler to add.
 * @since 0.2.0
 */
function addEventHandler( node, eventName, handler ) {

	if ( node == null ) throw new Exception( "addEventHandler: Bad node" );
	if ( typeof( eventName ) != "string" ) throw new Exception( "addEventHandler: Bad eventName" ); 
	if ( typeof( handler ) != "function" ) throw new Exception( "addEventHandler: Bad event handler" ); 

	var handlerArray = node[ eventName + "_handlers" ];
	if ( handlerArray == null ) {
		handlerArray = node[ eventName + "_handlers" ] = new Array(); 
		var __temp = null;
		eval( 
			"__temp = function( event ) {" +
			"    var result = true;" +
			"    var handlerArray = this['" + eventName + "_handlers'];" +
			"    event = ( event ? event : (window.event ? window.event : null ) );" +
			"    try { if ( event.target ) event.srcElement = event.target; } catch( exception ) {} " +		// DO NOT REMOVE TRY-CATCH for not native events
			"    for( var i=0; i<handlerArray.length; i++ ) {" +
			"        this.__temp__handler__ = handlerArray[i];" +   								// DO NOT REMOVE : CLOSURE MUST BE A METHOD !
			"        var returnCode = this.__temp__handler__( event );" +
			"        result = result && returnCode;" +												// For form validations 
			"    }" +
			"    return result;" +
			"}"
		);
		node[ eventName ] = __temp;																	// ATTENTION : ne pas changer (IE � besoin __temp = pour l'eval) 
	}
	
	handlerArray[ handlerArray.length ] = handler;
}

/**
 * Removes the specified event handler for the considered element.
 * @param node			The element that contains the event handler to remove.
 * @param eventName		The considered event name.
 * @param handler		The event handler to remove.
 * @since 0.4.6
 */
function removeEventHandler( node, eventName, handler ) {
	var handlerArray = node[ eventName + "_handlers" ];
	handlerArray.remove( handler );
}

/*
 * parseJwtComponents
 */

document.jwtLookupTable = { calendar: "Calendar",    datepicker: "DatePicker",    expandablepanel: "ExpandablePanel",    
		                    pictureeditor: "PictureEditor",    quickcalendar: "QuickCalendar" };

document.jwt = {};

/**
 * @since 0.4.8
 */
document.parseJwtComponents = function () { 
	
	var elementsOri = this.getElementsByTagName( "*" );
	var elements = new Array();								// Duplication is required
	for( var i=0; i<elementsOri.length; i++ ) { elements.push( elementsOri[i] ); }
		
	var length = elements.length;
	for( var i=0; i<length; i++ ) {
		var element = elements[i];
		
		componentName = null;
		if ( ! element.localName || (navigator.isInternetExplorer && navigator.version == 9) ) {
			if ( element.scopeName == "jwt" ) {			// TODO : handle the read alias name according the document namespace definitions.
				if ( navigator.version < 9 ) {
					componentName = element.nodeName;
				} else {
					componentName = document.jwtLookupTable[ element.localName ];
				}
			}
		} else {
			if ( element.localName.length > 5 && element.localName.toString().substring(0,4) == "jwt:" ) {
				componentName = document.jwtLookupTable[element.localName.substring( 4 )];
				console.log( componentName );	
			}
		}
		
		if ( componentName ) {
			//console.log( componentName );
			var filename = "corelib/services/web/javascript/jwt/" + componentName + ".js";
			importPackage( filename );
			
			// Component construction
			var component = null;
			try {
				eval( "component = new " + componentName + "();" );
			} catch( exception ) {
				if ( console && console.error ) {
					console.error( "JWT parsing : Cannot instanciate <jwt:" + componentName + " /> component", exception );
				}
			}
			
			// HTML attributes affectations
			var lowerCaseSetterNames = {}
			for( var key in component ) { 
				if ( typeof component[key] == "function" && key.startsWith("set") ) {
					lowerCaseSetterNames[key.toLowerCase()] = key;
				}
			}
			
			for( var attributeIndex=0; attributeIndex<element.attributes.length; attributeIndex++ ) {
				var attributeObject = element.attributes[attributeIndex];
				try {
					var methodName = lowerCaseSetterNames[ "set" + attributeObject.name.toLowerCase() ];
					if ( methodName != null ) {
						eval( "component." + methodName + "('" + attributeObject.value + "');" );
					}
				} catch( exception ) {
					if ( console && console.error ) console.error( "JWT parsing : Cannot set attribute " + attributeObject.name, exception );
				}
			}
			
			// Component DOM injection
			while( element.childNodes.length > 0 ) {
				var subElement = element.childNodes[0];
				component.add( subElement );
			}
			element.parentNode.replaceChild( component.htmlTag, element );
			
			document.jwt[component.getId()] = component;
			
			if ( component.onDOMInjection )	component.onDOMInjection();
		}
	}
	
}

/**
 * Update CSS classes used for the body element, by adding a class dependant of the web browser used.
 * @since 0.3.6
 * @author Dominique Liard
 */
addEventHandler( window, "onload", function( event ) {
	if ( document.body.className != null && document.body.className != "" ) document.body.className += " ";
	
	var browserClass = "CSS_UN";
	if ( navigator.isInternetExplorer ) browserClass = "CSS_IE";
	else if ( navigator.isFirefox )     browserClass = "CSS_FF";
	else if ( navigator.isChrome )      browserClass = "CSS_CH";
	else if ( navigator.isSafari )      browserClass = "CSS_SA";
	else if ( navigator.isOpera )       browserClass = "CSS_OP";
	
	document.body.className += browserClass + " " + browserClass + "_V" + Math.floor( navigator.version ) + ( navigator.isMobile ? " MOBILE" : "" );
	
	document.parseJwtComponents();
});

/* **********************************************************************************
*** Permet de créer une méthode de simulation de click sur un tag, pour le        ***
*** navigateur firefox (compatibilité avec InternetExplorer)                      ***
************************************************************************************/

function attachClickMethod( node ) {
	if ( node.click ) return;
	node.click = function() {
		var clickEvent = document.createEvent( "MouseEvents" );
		clickEvent.initMouseEvent( 'click', true, true, document.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null );
		this.dispatchEvent( clickEvent );
	};
}

/* **********************************************************************************
*** D�clenche un event oncontextmenu sur Internet Explorer lors d'un click avec   ***
*** le bouton droit de la souris sur un quelconque tag <area ...>.                ***
************************************************************************************/

function updateAllAreasForOnContextMenuEvent() {
	if ( window.document.all ) {
		var areaNodes = window.document.getElementsByTagName( "area" );
		for( var i=0; i<areaNodes.length; i++ ) {
			areaNodes[i].onmousedown = function() {
				if ( window.event.button != 2 ) return;
				this.fireEvent( 'oncontextmenu' );
				window.event.cancelBubble = true;
			};

			areaNodes[i].imageNode = null;
			var mapName = "#" + areaNodes[i].parentNode.name;
			var imageNodes = document.getElementsByTagName( "img" );
			for (var imgIndex=0; imgIndex<imageNodes.length; imgIndex++ )
				if (imageNodes[imgIndex].usemap == mapName) areaNodes[i].imageNode = imageNodes[imgIndex];					
		}
	}
	return true;
}

addEventHandler( window, "onload", updateAllAreasForOnContextMenuEvent );

/* **********************************************************************************
*** Permet une gestion simplifi�e des cookies.                                    ***
************************************************************************************/

function CookieManager() {
    this.cookies = new Array();

    var tempCookies = document.cookie.split(";");
	for(var i=0; i<tempCookies.length; i++) {
        var currentCookie = tempCookies[i].split("=");
        this.cookies[i] = currentCookie;
    }
    
    this.getValue = function CookiesManager_getValue(name) {
        for(var i=0;i<this.cookies.length; i++) {
            if (this.cookies[i][0].indexOf(name) > -1) {
				return this.cookies[i][1];
			}
        }
        return null; 
    };
    
    this.setValue = function CookieManager_setValue(key, value, expirationDate) {
        if (arguments.length != 3) {
        	expirationDate = new Date();
         	expirationDate.setTime( expirationDate.getTime()*1 + (365*24*60*60*1000) );
        }
	    document.cookie = key + "=" + value + ";expires=" + expirationDate.toGMTString();
    };
}


/* **********************************************************************************
*** Extension du type String                                                      ***
************************************************************************************/

String.extendPrototype( {

	endsWith : function( endString ) {
		if ( endString == null ) throw new NullPointerException();
		if ( typeof endString != "string" ) throw new BadTypeException( "parameter must be a string" );
		if ( endString.length > this.length ) return false;
		return this.right( endString.length ) == endString;
	},
	
	
	left : function ( length ) {
		var strLength = this.length;
		if ( length > strLength ) throw new Exception( "Bad length for left function" );
		return this.substring( 0, length );    
	},

	
	right : function ( length ) {
		var strLength = this.length;
		if ( length > strLength ) throw new Exception( "Bad length for right function" );
		return this.substring( strLength - length );    
	},

	
	startsWith : function( startString ) {
		if ( startString == null ) throw new NullPointerException();
		if ( typeof startString != "string" ) throw new BadTypeException( "parameter must be a string" );
		if ( startString.length > this.length ) return false;
		return this.substring( 0, startString.length ) == startString;
	},
	
	
	trim : function() {
		if ( this == "" ) return this;
		
		var begin = 0;
		var theChar = this.charAt( begin );
		while( theChar == ' ' || theChar == '\t' || theChar == '\r' || theChar == '\n' ) {
			begin ++;
			if ( begin == this.length ) return "";
			theChar = this.charAt( begin );
		}
		
		var end = this.length-1;
		theChar = this.charAt( end );
		while( theChar == ' ' || theChar == '\t' || theChar == '\r' || theChar == '\n' ) {
			end --;
			theChar = this.charAt( end );
		}
		
		return this.substring( begin, end+1 );
	},
	
	format: function() {
		var isprototype = (this == String.prototype);
		var index = (!isprototype ? 0 : 1);
		var value = (!isprototype ? this : arguments[0]);
		
		for(var i = index; i < arguments.length; i++)
			value = value.replace("\{" + (i - index) + "}", arguments[i].toString());
		
		return value;
	}
} );


/* **********************************************************************************
*** Extension du type Date                                                        ***
************************************************************************************/

Date.extendPrototype( {

	/**
	 * @since 0.2.15
	 * @author S�bastien Briquet
	 */
	addDays: function(/* int */ n)
	{
		this.setTime( this.getTime() + (n * 86400000));
		
		return this.getTime();
	},

	getWeek : function() {
		var firstDay = new Date( this.getFullYear(), 0, 1 );
		return Math.ceil( ( ( (this - firstDay ) / 86400000) + firstDay.getDay() ) / 7 );
	},
	
	/**
	 * Converts a date to a string using the specified formatting.
	 * Already native in Firefox but not in Internet Explorer browser
	 * @since 0.3.0
	 * @author Sébastien Briquet
	 */
	toLocaleFormat : function(format) {
		switch(format) {
			case "%a":
				return this.toString().left(3); // not the best way
			default:
				throw new Exception("the specified formatting is not currently supported");
		}
	},
	
	toURIString: function() {
		// ie: 19970714T170000Z
		var index = 0;

		if((new Date(1970, 12, 1)).getMonth() == 0) // dec.
			index++;

		return "" + this.getUTCFullYear() + (this.getUTCMonth() + index).toFixedString(2) + this.getUTCDate().toFixedString(2) + "T" + this.getUTCHours().toFixedString(2) + this.getUTCMinutes().toFixedString(2) + this.getUTCSeconds().toFixedString(2) + "Z";
	 }
} );

/* **********************************************************************************
*** Extension du type Number + tools                                              ***
************************************************************************************/

Number.extendPrototype( {
	toFixedString: function(digits)
	{
		var value = this.toString();
		
		if(!isNaN(digits) && digits > value.length)
			for(var i = value.length; i < digits; i++)
				value = "0" + value;

		return value;
		
	}
});


/**
 * This function indicate if the specified parameter is of type integer.
 *  
 * @param value	The value to check.
 * @return	<code>true</code> if <code>value</code> is of type integer, <code>false</code> otherwise.
 * 
 * @since 0.4.0
 */
function isInteger( value ) {
	if ( isNaN( value ) ) return false;
	if ( Math.floor( value ) != value ) return false;
	return true;
}

/**
 * TODO
 */
var Locale = Object.extendClass( {

	initialize : function( language, country ) {
		this._language = language;
		this._country = country;
	},
	
	getLanguage : function () { return this._language; },
	getCountry : function () { return this._country; },
	
	/**
	 * @since 0.4.8
	 */
	toString : function() {
		if ( this._country == null ) {
			return this._language;
		}
		return this._language + "_" + this._country;
	}
	
});

Locale.getDefault = function() {
	if ( ! Locale.prototype._defaultLocale ) {
		var localeParts = document.documentElement.getAttribute( "lang" ).split( "-" );
		Locale.prototype._defaultLocale = new Locale( localeParts[0], localeParts[1] );
	}		
	return Locale.prototype._defaultLocale;
};


/**
 * @since 0.5.0
 */
var DateFormat = Object.extendClass( {
});

DateFormat.getDateInstance = function( locale ) {
	locale = locale ? locale : Locale.getDefault();
	return {
		format: function( date ) {
			var day = date.getDate();
			var month = date.getMonth() + 1;
			var year = date.getFullYear();
			
			if ( day<10 ) day = "0" + day;
			if ( month<10 ) month = "0" + month;			
			
			switch( locale.getLanguage() ) {
				case "fr": return day + "/" + month + "/" + year;
				default: return month + "-" + day + "-" + year; 
			}
		}
	};
};

DateFormat.getTimeInstance = function( locale ) {
	locale = locale ? locale : Locale.getDefault();
	return {
		format: function( date ) {
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var seconds = date.getSeconds();
			
			if ( hours<10 ) hours = "0" + hours;
			if ( minutes<10 ) minutes = "0" + minutes;			
			if ( seconds<10 ) seconds = "0" + seconds;			
			
			return hours + ":" + minutes + ":" + seconds;
		}
	};
};

/**
 * <p>
 *     This class permit to load a ResourceBundle file. A ResourceBundle file can store localized string to permit internalization (I18N).
 * </p>
 * 
 * For more informations about the ResourceBundle file format, you can read the assiociated Ellipse Tutorial :
 * <a href="http://www.infini-software.com/Encyclopedie/Developpement/Infini/Ellipse/French/08_Internationalisation.wp" target="_bank">
 *     http://www.infini-software.com/Encyclopedie/Developpement/Infini/Ellipse/French/08_Internationalisation.wp
 * </a>

 * @since 0.4.8
 */
var ResourceBundle = Object.extendClass( {
	
	/**
	 * Class constructor
	 * @param url The URL (Uniform Resource Locator) of the ResourceBundle file. This file is downloaded with an AJAX call.
	 */
	initialize : function( url ) {
		var caller = new AjaxGetCall( url, "xml", false, 0 );
		var strings = this._strings = {};
		var _this = this;
		
		caller.onLoaded = function( dom ) {
			_this._defaultLocale = dom.documentElement.getAttribute( "defaultLocale" );
			if ( _this._defaultLocale == null || _this._defaultLocale.trim() == "" ) {
				console.warn( "ResourceBundle (url=" + url + ") doesn't specify a default locale. Please correct this point!" );
			}
			
			var nodes = dom.getElementsByTagName( "Resource" );
			for( var i=0; i<nodes.length; i++ ) {
				var resourceNode = nodes[i];
				var entry = strings[ resourceNode.getAttribute("key") ] = {};
				var values = resourceNode.getElementsByTagName( "Value" );
				for( var l=0; l<values.length; l++ ) {
					entry[ values[l].getAttribute("locale") ] = values[l].firstChild.nodeValue;
				}
			}
		}
		caller.send();
	},
	
	/**
	 * Returns the localized string the the specified key.
	 * 
	 * @param key The key that identify the string.
	 * @param locale The expected locale instance (for specify the language and the country, if needed).
	 * 
	 * @returns The localized string.
	 * @throw ResourceBundleException Thrown is the string not exists for the specified key and locale.
	 * 
     * @see ResourceBundleException
	 */
	getResource : function ( key, locale ) {
		if ( locale == null ) locale = Locale.getDefault();
		var entry = this._strings[ key ];
		if ( entry ) {
			if ( entry[ locale.toString() ] )    return entry[ locale.toString() ];
			if ( entry[ locale.getLanguage() ] ) return entry[ locale.getLanguage() ];
		}
		if ( entry[ this._defaultLocale ] ) return entry[ this._defaultLocale ];
		throw new ResourceBundleException( "Key '" + key + "' not exist for the specified locale (" + locale.toString() + ")" );
	}
	
}) ;


Element.extendPrototype( {

	/**
	 * Creates and appends a new element as the last child of this element.
	 * 
	 * @param elementName		The tag name of the new element to produce.
	 * @param attributes		An associative array that defines all attributes to affect on the new element.
	 * @param styleDefinitions	An associative array that defines all definitions to affect on the style object of the new element.
	 *  
	 * @since 0.4.0
	 */
	createAndAppendChild : function( elementName, attributes, styleDefinitions ) {
		var newElement = document.createElement( elementName );
		if ( attributes ) {
			for( var key in attributes ) {
				 newElement[ key ] = attributes[ key ];
			}
		}
		if ( styleDefinitions ) {
			for( var key in styleDefinitions ) {
				 newElement.style[ key ] = styleDefinitions[ key ];
			}
		}
		this.appendChild( newElement );
		return newElement;
	},

	/**
	 * Returns all sub tags of the current element that are associated to the specified CSS class name.
	 * @param className 	The searched CSS class name.
	 * @return An array of sub elements that are associated to the specified class name.
	 * @noproperty
	 * @since 0.4.4
	 */
	getElementsByClassName : function( className ) {
		
		var classNameRegExp = new RegExp( "(^|\\s)" + className + "(\\s|$)" );
		var subElements = this.getElementsByTagName("*");
		var selectedElements = [];

		for ( var i=0; i<subElements.length; i++ ){
			var currentNode = subElements[i];
			if ( classNameRegExp.test( currentNode.className ) ){
				selectedElements.push( currentNode );
			}
		}
		return selectedElements;
		
	},
	
	/**
	 * Adds a new CSS class on the considered element. For information, note that a HTML can have more than one CSS class affected to it.
	 * @param cssClassName  The new CSS class to add to the current element.
	 * @since 0.4.0
	 */
	addCssClass : function( cssClassName ) {
		var classArray = this.className.split( " " );
		if ( classArray.contains( cssClassName ) == false ) {
			this.className += " " + cssClassName;
		}
	},

	/**
	 * Adds a new CSS class on the considered element. For information, note that a HTML can have more than one CSS class affected to it.
	 * @param cssClassName  The new CSS class to add to the current element.
	 * @since 0.4.0
	 */
	removeCssClass : function( cssClassName ) {
		var rules = this.className.split(" ");
		var names = new Array();
	
		for( var i = 0; i < rules.length; i++ ) {
			if( rules[i] != cssClassName ) {
				names.push(rules[i]);
			}
		}
	
		this.className = names.join(" ");
	}

});

if ( ! document.getElementsByClassName ) {
	document.getElementsByClassName = Element.prototype.getElementsByClassName;
}

if ( ! document.getCurrentScriptElement ) {
	document.getCurrentScriptElement = function() {
		var scriptNodes = document.getElementsByTagName("script");
        return scriptNodes[scriptNodes.length-1];
	}
}


if ( navigator.isInternetExplorer && navigator.version <= 7 ) {

	var addCssClass = function( node, cssClassName ) {
		var classArray = node.className.split( " " );
		if ( classArray.contains( cssClassName ) == false ) {
			node.className += " " + cssClassName;
		}
	};

	var removeCssClass = function( node, cssClassName ) {
		var rules = node.className.split(" ");
		var names = new Array();
	
		for( var i = 0; i < rules.length; i++ ) {
			if( rules[i] != cssClassName ) {
				names.push(rules[i]);
			}
		}
	
		this.className = names.join(" ");
	};
}
