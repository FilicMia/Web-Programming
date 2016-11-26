/**
Function checking if element ele is of class named cls.
@param ele element to be check for the class
@param cls class for which the element ele will be checked

@return true, if the element ele is of class cls,
        false otherwise.
*/
function hasClass(ele,cls) {
  return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

/**
Function adding to the element class named cls if the element is not jet
of class cls. Otherwise does nothing.
@param ele element to which the class is added
@param cls class which will be added to the element ele.
*/
function addClass(ele,cls) {
  if (!hasClass(ele,cls)) {
    ele.className += " "+cls;
  }
}

/**
Function removing class named cls from the element ele if ele is of class cls.
If ele is not of class cls, does nothing.
@param ele element from which to remove class cls
@param cls class which will be removed from the element ele

*/
function removeClass(ele,cls) {
  if (hasClass(ele,cls)) {
    var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
    ele.className=ele.className.replace(reg,' ');
  }
}

/**
Function fired on the login button click.
It hide or show the login and register form.
If the form is hidden before the click, it shows it and vice-versa
*/
appearLoginSection = function(e){
  var loginSection = document.getElementsByClassName("loginRegister")[0];
  if(loginSection.style.display == "none"){
    loginSection.style.display = "";
  } else {
    loginSection.style.display = "none";
  }
}

/**Set the start of the game in local storage.
  It is set by the click on the play button.
*/
setTheStartOftheGame = function(e){
  //e.preventDefault();
  if (typeof (Storage) !== "undefined"){
      localStorage.setItem("start",true);
  }
}
var output;

/**
Function fired by an event e.
It sends to the echo server the username of the user.
Also, it sets the onmessage event, so that the user is
greeted when the message arrives.

@param e event
*/
function fireWebSocket(e)
{
  e.preventDefault();
  console.log("sockets");
  var uri = "ws://echo.websocket.org/";
  websocket = new WebSocket(uri);
  websocket.onopen = function(e) { onOpen(e) };
  websocket.onclose = function(e) { onClose(e) };
  websocket.onmessage = function(e) { onMessage(e) };
  websocket.onerror = function(e) { onError(e) };
}

/**
Function trigered when the web socket connection is opened.
@param e event
*/
function onOpen(e)
{
  console.log("CONNECTED");
  console.log(document.getElementById("loginUsername").value);
  doSend(document.getElementById("loginUsername").value);
}

/**
Function trigered when the web socket connection is closed.
@param e event
*/
function onClose(e)
{
  console.log("DISCONNECTED");
}

/**
Function trigered when the web socket recives a message from the server.
@param e event
*/
function onMessage(e)
{
  alert("Hello "+e.data);
  console.log('<span style="color: blue;">RESPONSE: ' + e.data+'</span>');
  websocket.close();
  this.removeEventListener('click',eventLoginBtn);
  document.getElementById('loginForm').submit();
}

/**
Function trigered when the web socket connection ocurres an error.
@param e event
*/
function onError(e)
{
  console.log('Error '+e.data);
}

/**
Sends the message to the server.
@param message message to be sent.
*/
function doSend(message)
{
  console.log("SENT: " + message);
  websocket.send(message);
}
////////////////////////////////////////////////////////
//do after ready

document.onreadystatechange = function () {
   if (document.readyState == "complete") {

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
        document.getElementsByClassName("loginRegister")[0].style.display = "none";
        document.getElementsByClassName("loginLink")[0].addEventListener('click'
                  ,appearLoginSection,false);
    }
    /**Set start of the game when the Play button is clicked.*/
    if(document.getElementById("playLink") !== null){
      document.getElementById("playLink").addEventListener("click",
                setTheStartOftheGame,false);
              }

    /////////web socket alert.
    eventLoginBtn = document.getElementById("loginBtn").addEventListener("click",
            fireWebSocket,false);

  }


}
