function hasClass(ele,cls) {
  return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function addClass(ele,cls) {
  if (!hasClass(ele,cls)) {
    ele.className += " "+cls;
  }
}

function removeClass(ele,cls) {
  if (hasClass(ele,cls)) {
    var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
    ele.className=ele.className.replace(reg,' ');
  }
}
////////////////////////////////////////////////////////
//do after ready
document.onreadystatechange = function () {
   if (document.readyState == "complete") {
   // document is ready. Do your stuff here

    var didScroll;

    //definition of needed variables
    var lastScrollTop = 0;
    var delta = 5;
    var navbarHeight = document.getElementById("headerID").offsetHeight;

    window.onscroll = function() {
        didScroll = true;
    };
    // on scroll, let the interval function know the user has scrolled

    // run hasScrolled() and reset didScroll status
    setInterval(function() {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 250);

    function hasScrolled() {

      var body = document.body;
      var docElem = document.documentElement;
      var st = window.pageYOffset || docElem.scrollTop || body.scrollTop;

      if (Math.abs(lastScrollTop - st) <= delta)
      return;

      //get header
      var headerElem = document.getElementById("headerID");
      // If current position > last position AND scrolled past navbar...
      if (st > lastScrollTop && st){
        // Scroll Down
        removeClass(headerElem, 'nav-down');
        addClass(headerElem, 'nav-up');

      } else {
        // Scroll Up
        // If did not scroll past the document (possible on mac)...
        var body = document.body,
            html = document.documentElement;

        var docHeight = Math.max( body.scrollHeight, body.offsetHeight,
                       html.clientHeight, html.scrollHeight, html.offsetHeight );
        var winHeight = Math.max(document.documentElement.clientHeight,
           window.innerHeight || 0);
        if(st + winHeight < docHeight) {
          removeClass(headerElem, 'nav-up');
          addClass(headerElem, 'nav-down');
        }
      }
        lastScrollTop = st;
    }

//////////////////////////////////////load part
  }
}
