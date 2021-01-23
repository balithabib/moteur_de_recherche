var navBar = document.getElementsByTagName( "nav" )[0];
var firstLink = navBar.getElementsByTagName( "a" )[0];

const NAVIGATION_PANE_WIDTH = "450px";
const MIN_SIZE_FOR_BOTH = 1200;

function openPane() {
    var navigationPane = document.getElementsByClassName( "navigationPane" )[0];
    navigationPane.style.width = NAVIGATION_PANE_WIDTH;
    if ( document.body.clientWidth > MIN_SIZE_FOR_BOTH ) {
        var contentPane = document.getElementsByClassName( "pageContent" )[0];
    	contentPane.style.marginLeft = NAVIGATION_PANE_WIDTH;
    	var footer = document.getElementsByTagName( "footer" )[0];
    	if ( footer != null ) {
    	    footer.style.marginLeft = NAVIGATION_PANE_WIDTH;
    	} else {
    	    window.setTimeout( function() {
    	        var footer = document.getElementsByTagName( "footer" )[0];
                footer.style.marginLeft = NAVIGATION_PANE_WIDTH;    	        
    	    }, 1000 );
    	} 
    }
}

function closePane() {
    var navigationPane = document.getElementsByClassName( "navigationPane" )[0];
    var contentPane = document.getElementsByClassName( "pageContent" )[0];
    navigationPane.style.width = "0px";
    contentPane.style.marginLeft = "0px";    
	var footer = document.getElementsByTagName( "footer" )[0];
	footer.style.marginLeft = "0px";
}

if ( firstLink.id.indexOf( "mnuHome" ) != -1 ) {
    let hamburgerMenu = document.createElement( "a" );
    hamburgerMenu.style.display = "inline-block";
    hamburgerMenu.style.verticalAlign = "bottom";
    hamburgerMenu.style.background = "url('/Images/hamburger.png')";
    hamburgerMenu.style.backgroundSize = "cover";
    hamburgerMenu.style.width = "40px";
    hamburgerMenu.style.height = "40px";
    hamburgerMenu.className = "leftMenu";
    navBar.insertBefore( hamburgerMenu, firstLink );

    hamburgerMenu.addEventListener( "click", function( event ) {
       let navigationPane = document.getElementsByClassName( "navigationPane" )[0];
       if ( navigationPane.clientWidth == 0 ) {
           openPane();
       } else {
           closePane();
       }
    });
    
    window.setTimeout( "if ( document.body.clientWidth > MIN_SIZE_FOR_BOTH ) openPane();", 100 );
}


//addEventHandler( window, 'onload', function() {
//	 
//    var startX,
//        startY,
//        dist,
//        threshold = 150,
//        allowedTime = 200,
//        elapsedTime,
//        startTime;
// 
//    document.body.addEventListener('touchstart', function(e){
//        var touchobj = e.changedTouches[0];
//        dist = 0;
//        startX = touchobj.pageX;
//        startY = touchobj.pageY;
//        startTime = new Date().getTime();
//        e.preventDefault();
//    }, false)
// 
//    document.body.addEventListener('touchmove', function(e){
//        e.preventDefault();
//    }, false)
// 
//    document.body.addEventListener('touchend', function(e){
//        var touchobj = e.changedTouches[0];
//        dist = touchobj.pageX - startX;
//        elapsedTime = new Date().getTime() - startTime;
//        var swiperight = (elapsedTime <= allowedTime && dist >= threshold && Math.abs(touchobj.pageY - startY) <= 100);
//        if ( swiperight ) openPane();
//        e.preventDefault();
//    }, false)
// 
//}); 
