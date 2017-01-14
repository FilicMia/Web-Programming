/**
Function fired on the login button click.
It hide or show the login and register form.
If the form is hidden before the click, it shows it and vice-versa
*/
appearLoginSection = function(e){
  var loginSection = document.getElementsByClassName("loginRegister")[0];
  console.log(loginSection.style.display);
  if(loginSection.style.display==="" || loginSection.style.display === "none"){
    loginSection.style.display = "flex";
    loginSection.style.flexFlow = "column";
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

/* When the user clicks on login, open the popup
   which hello's user before coininuing.
*/
function helloUser(name) {
    window.location = '#popup1';
}

/**
Function that popups the popup2 with the
title title and content p tag with content equal content.

@param title title of popup2
@param content content of the popup2
*/
function popUp2(title, content){
  document.getElementById("registerLoginPopUpTitle").innerHTML=title;
  document.getElementById("registerLoginPopUp").innerHTML=content;
  window.location = "#popup2";
}

/**
Function checks if the username is ok due to regular
*/

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
  var uri = "wss://echo.websocket.org/";
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
  document.getElementById('userHello').innerHTML = e.data;
  helloUser();
  console.log('<span style="color: blue;">RESPONSE: ' + e.data+'</span>');
  websocket.close();
  this.removeEventListener('click',eventLoginBtn);
  setTimeout(function(){
    document.getElementById('loginForm').submit();
  },2000);

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

/**
Function checking if the certain user with
certain password exists in the database.
If it exists, the user is helloed and signed in.
Now the user can play the game.

@param user username of the user.
@param password password corresponding the given user.
@param e event
*/
function checkUser(user, password,e){
  //check in base
  basePath = "./dataBase/users.json";

  var req = new XMLHttpRequest();
  req.addEventListener("load",function(){
    users = JSON.parse(this.responseText);
    passwordUser = users[user];

    if(passwordUser !== undefined && passwordUser.trim() === password){
      localStorage.setItem("user",user);
      try{
        fireWebSocket(e);
      }catch(err){
        this.removeEventListener('click',eventLoginBtn);
        setTimeout(function(){
          document.getElementById('loginForm').submit();
        },2000);
      }
    } else{

      popUp2("Warning","Wrong username or password");
    }
  },false);

  req.open("GET", basePath);
  req.responseType = "text";
  req.send();
}

/**
Function check if there is user named user in the database.
It there is, notifies the user, greets the user
(sends the confirmation mail) otherwise.
@param user username to be check for existance
@param e event
*/
function userRegisterChecking(user, e){
  basePath = "./dataBase/users.json";

  var req = new XMLHttpRequest();
  req.addEventListener("load",function(){
    users = JSON.parse(this.responseText);
    passwordUser = users[user];

    if(passwordUser === undefined){
      popUp2("Wellcome!","Verify your mail and start <span>playing<span>!");
    } else {
      popUp2("Warning","Need to choose different username.");
    }

  },false);

  req.open("GET", basePath);
  req.responseType = "text";
  req.send();
}



/**
Function trigered when the login submit button is clicked.

@param e event
*/
function loginSubmitAction(e){
  var userName = document.getElementById("loginUsername").value;
  var password = document.getElementById("loginPwd").value;
  e.preventDefault();
  checkUser(userName, password,e);

}

/**
Function trigered when the register button is clicked. It handles the
register action.

@param e submit event
*/
function registerSubmitAction(e){
  e.preventDefault();
  var userName = document.getElementById("registerUsername").value;
  var password = document.getElementById("registerPwd").value;
  var email = document.getElementById("registerEmail").value;

  userRegisterChecking(userName, e);

}
