/**
Function dynamically loading css file or js file.
@param filename name of the file to be inported
@param type of the file to be imported ("css", "js", undefined)
*/
function loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

////////////////////////////////////////////////////////
//do after ready
//path to the static files
staticFilesPath = "briscola/"

loadjscssfile(staticFilesPath+"javaScript/classFunctions.js","js");
loadjscssfile(staticFilesPath+"javaScript/functionsAndObjectsIndex.js","js");

document.onreadystatechange = function () {
   if (document.readyState == "complete") {
     //set name of the user
     var user = localStorage.getItem("user");

     var userElement = document.getElementById("user");
     if(userElement){

       document.getElementById("user").innerHTML =
            user === undefined ? "Marinko" : user;

      }else{
        if(user){
          window.location = "mainPageLoged.html";
        }
      }

   // document is ready. Do your stuff here
   /**scrolling header movement*/
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

      if (Math.abs(lastScrollTop - st) <= delta)//do not scroll too soon
      return;

      //get header
      var headerElem = document.getElementById("headerID");
      // If current position > last position AND scrolled past navbar...
      if (st > lastScrollTop){//&&st??
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

    //***Login apear and disapear due to the click.*/
    if(document.getElementsByClassName("loginRegister")[0] !== undefined){

        document.getElementsByClassName("loginLink")[0].addEventListener('click'
                  ,appearLoginSection,false);
    }
    if(document.getElementsByClassName("logoutLink")[0] !== undefined){

        document.getElementsByClassName("logoutLink")[0].addEventListener('click'
                  ,function(){
                    localStorage.clear();
                  },false);
    }

    /**Set start of the game when the Play button is clicked.*/
    if(document.getElementById("playLink") !== null){
      document.getElementById("playLink").addEventListener("click",
                setTheStartOftheGame,false);
              }

    /////////web socket alert.
    var loginBtn = document.getElementById("loginBtn");
    if(loginBtn){
      eventLoginBtn = loginBtn.addEventListener("click",
              loginSubmitAction,false);////provjeraaaa.
    }

    var registerBtn = document.getElementById("registerBtn");
    if(registerBtn){

      eventRegisterBtn = registerBtn.addEventListener("click",
              registerSubmitAction,false);////provjeraaaa.
    }
  }


}
