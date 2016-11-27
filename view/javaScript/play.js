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

/**
Getting the uniformly random integer from the range [min,max>.
@param min lower inclusive bound of the interval from which to choose integer.
@param max upper exclusive bound of the interval from which to choose integer.

@return random integer from the [min,max>
*/
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
Shiffle primitive array object function.
It shuffles the elements of the array on which it is called.
The initial array is changed.

@return the shuffeled array.
*/
Array.prototype.shuffle = function () {
    var m = this.length;
    while (m) {
        let i = Math.floor(Math.random() * m--);
        [this[m], this[i]] = [this[i], this[m]];
    }
    return this;
}

/**
Choses the index of the cards which are avaliable for the computer to play.
The cards avaliable are detected due to the

@return cardIndex; it is in the range [0,3],
    depends on the number of cards that computer holds.
*/
computerChose = function() {
  var cards = briscolaPlay.hisCards.reduce(function(a, v, i) { if (v!==-1) a.push(i); return a; }, []);
  console.log(cards);
  return cards[getRandomInt(0,cards.length)];
}

/**
Function which "play" one turn.
Due to the arguments passed, the player is player or computer.
It the index is negative, we suppose the player is computer.
Also, if no arguments are passe, default arguments are used.
Default arguments corresponds the play of the computer.

If playCardClass = "computer" it simulates computer playing.
If playCardClass = "playCard player" it simulates player playing.
If there is no empty space to play the card (the turn is over),
it does nothing.
Also, if some other value of the argument playCardClass or index (not integer 0-2)
is passed, round is
overed.

@param the class of the elements from which to pull cards. (or all avaliable
      elements to put the cards in computer turn case.)
@param index - the index of the card to be played.
      Valid indexes are 0-2
      If < 0, the random card is played by computer side.
*/
playTurn = function(playCardClass = "computer", index = -1){
  if(playCardClass !== "computer" && playCardClass !== "player playCard"){
    roundOverFunction();
    return;
  }
  var spaceToThrowCard = document.getElementsByClassName("firstEmptySpace");
  if(spaceToThrowCard == undefined || spaceToThrowCard.length < 1){
    return;
  }

  var cards = document.getElementsByClassName(playCardClass);
  var comp = false;

  if(index < 0){
    index = computerChose();
    comp = true;
  } else {//get the one you need
    cards = document.getElementsByClassName(playCardClass+" "+index);
    index = 0;
  }

  spaceToThrowCard[0].src = cards[index].src;
  var cardPlaceIndex = parseInt(cards[index].alt)-1;

  if(comp){
    spaceToThrowCard[0].name = briscolaPlay.hisCards[cardPlaceIndex];
    briscolaPlay.hisCards[cardPlaceIndex] = -1;
  } else {
    spaceToThrowCard[0].name = briscolaPlay.mineCards[cardPlaceIndex];
    briscolaPlay.mineCards[cardPlaceIndex] = -1;
  }
  briscolaPlay.cardsOnTable[parseInt(spaceToThrowCard[0].alt)-1] = spaceToThrowCard[0].name;

  addClass(spaceToThrowCard[0],"thrown");
  removeClass(spaceToThrowCard[0], "firstEmptySpace");

  cards[index].src = "../media/pictures/pic.jpg";

  addClass(cards[index], "addCard");
  removeClass(cards[index], "playCard");
}

/**
Gets the card from the deck and puts it to the classWhereToPutCard image element.
(IF classWhereToPutCard == "player addCard", than the card is added to the player
if classWhereToPutCard == "computer addCard", than the card is put to the
    computer.)

@param classWhereToPutCard the class of the image to where to put card.
*/
getCardFromTheDeckFor = function(classWhereToPutCard){
  var spaceToThrowCard = document.getElementsByClassName(classWhereToPutCard+" addCard");
  if(spaceToThrowCard.length < 1){
    return;
  }
  var firstSpace = spaceToThrowCard[0];
  spaceToThrowCard[0].src =
      briscolaPlay.cardsPath+ briscolaPlay.mixedCards[briscolaPlay.deckSize - briscolaPlay.cardsLeft]+".jpg";
  if(hasClass(spaceToThrowCard[0],"player")){
    briscolaPlay.mineCards[parseInt(spaceToThrowCard[0].alt)-1] =
      briscolaPlay.mixedCards[briscolaPlay.deckSize - briscolaPlay.cardsLeft];
  } else {
    briscolaPlay.hisCards[parseInt(spaceToThrowCard[0].alt)-1] =
      briscolaPlay.mixedCards[briscolaPlay.deckSize - briscolaPlay.cardsLeft];
  }

  briscolaPlay.setCardsLeft(briscolaPlay.cardsLeft - 1);
  addClass(spaceToThrowCard[0], "playCard");//it is updating so first addClass
  //than remove
  removeClass(spaceToThrowCard[0], "addCard");
}

/**
The function called from the function attached to all players cards.
It the player is somehow not on turn, he is alerted to wait a bit.

@param e event that should be connected to the function
*/
playCardEvent = function(e){
  e.preventDefault();
  var target = e.target;

  if(hasClass(target,"player") && hasClass(target,"playCard")){
    //playCard are just images that can be played
    if(briscolaPlay.onTurn){
      playTurn("player playCard", parseInt(target.alt));
      setTimeout(playTurn(),1000);
    } else{

      waitAbitPopup();
    }
  }
}

/**
The event attached to all player's cards which he can play.
When the player plays the turn, the function to summ the turn card is called.

@param e event which trigered the function.
*/
playCardEventWrapper = function(e){
  playCardEvent(e);
  setTimeout(sumCards(),6250);
  console.log(briscolaPlay.result);
}

/**
Function simulates the pulling card from the deck.
At the same time, the cards are dealed to the player and the computer.

@return undefined
*/
deckCardPull = function(){
  if(briscolaPlay.cardsLeft < 1){
    return;
  }
  if(briscolaPlay.onTurn){
    getCardFromTheDeckFor("player addCard");
  } else {
    getCardFromTheDeckFor("computer addCard");
  }

  //if that was the last non-briscola card.
  //remove it from the deck
  if(briscolaPlay.cardsLeft == 1){
    var deckCard = document.getElementsByClassName("deckCard");
    for(var i = 0; i < deckCard.length; i++){
      deckCard[i].src = "../media/pictures/pic.jpg";
    }
  }
  if(briscolaPlay.onTurn){
    getCardFromTheDeckFor("computer addCard");
  } else {
    getCardFromTheDeckFor("player addCard");
  }
  //if that was tghe last card.
  //remove it from the deck
  if(briscolaPlay.cardsLeft == 0){
    var briscola = document.getElementById("briscola");
    briscola.src = "../media/pictures/pic.jpg";
  }
}

/**
Function summing the //pointsSum// to the player's current result.

@param pointsSum points to be summed
*/
sumeToMineResult = function(pointsSum){
  briscolaPlay.result[briscolaPlay.myId] += pointsSum;
  briscolaPlay.onTurn = true;
  briscolaPlay.myTurn = 0;
}

/**
Function summing the //pointsSum// to the computer's current result.

@param pointsSum points to be summed
*/
sumToHisResult = function(pointsSum){
  briscolaPlay.result[briscolaPlay.hisId] += pointsSum;
  briscolaPlay.setOnTurn(false);
  briscolaPlay.setMyTurn(1);
  //let him play
  setTimeout(function(){
    playTurn();
    briscolaPlay.setOnTurn(true);
  },5000);
}

/**
Function which removes playCards listeners form all elements that contains
cards which can be played.

*/
removePlayCardsListeners = function(){
  var card = document.getElementsByClassName("playCard");
  for(var i = 0; i < card.length; i++) {

      card[i].removeEventListener('click', playCardEventWrapper, false);
   }
}

/**
Function which adds playCards listeners form all elements that contains
cards which can be played.

*/
addPlayCardsListeners = function(){
  var card = document.getElementsByClassName("playCard");
  if(card.length < 1){
    roundOverFunction();
  }

  for(var i = 0; i < card.length; i++) {

      card[i].addEventListener('click', playCardEventWrapper, false);
   }
}

/**
Function summing the cards thrown in the turn. It is called when the turn is over.
It determinates who won this turn, and adds to it's result corresponding amount.
*/
sumCards = function(){
  var thrownCards = document.getElementsByClassName("thrown");
  if(thrownCards.length == 2){
    for(var i = 0; i < thrownCards.length/2; ++i){
      var mineIndex = 2*i+briscolaPlay.myTurn;
      var hisIndex = 2*i+Math.abs(1-briscolaPlay.myTurn);

      var mine = briscolaPlay.cardPoints[briscolaPlay.cardsOnTable[mineIndex]%10];
      var typeMine = Math.floor(briscolaPlay.cardsOnTable[mineIndex]/10);

      var his = briscolaPlay.cardPoints[briscolaPlay.cardsOnTable[hisIndex]%10];
      var typeHis = Math.floor(briscolaPlay.cardsOnTable[hisIndex]/10);
      console.log(typeHis);
      console.log(typeMine);
      if(typeHis === NaN || typeMine === NaN || typeHis < 0 || typeMine < 0){
        console.log("nije jos bacio");
        //setTimeout(
          //sumCards(),3000);
        return;
      }
      //turn is over
      removePlayCardsListeners();

      var pointsSum = mine+his;
      console.log("general "+pointsSum);
      ///////////////////////POINTs CALCULUS////////////////////
      if(briscolaPlay.myTurn == 0 && typeMine != typeHis && typeHis != briscolaPlay.briscolaCard){
        //it is mine
        sumeToMineResult(pointsSum);
        console.log("typeMine != typeHis && typeHis != briscolaCard");
      } else {

        if(typeMine == typeHis){

          if(mine >= his){
            sumeToMineResult(pointsSum);
            console.log("typeMine == typeHis && mine >= his");
          } else {
            console.log("typeMine == typeHis && mine < his");
            sumToHisResult(pointsSum);
          }

        } else {
          if(briscolaPlay.myTurn == 1 && typeMine == briscolaPlay.briscolaCard){
            sumeToMineResult(pointsSum);
          } else {
            console.log("ostalo");
            sumToHisResult(pointsSum);
          }
        }
      }
      ////////////////POINTs CALCULUS DONE////////////////////////

      addClass(thrownCards[mineIndex], "firstEmptySpace");
      briscolaPlay.cardsOnTable[parseInt(thrownCards[mineIndex].alt)-1] = -1;
      addClass(thrownCards[hisIndex], "firstEmptySpace");
      briscolaPlay.cardsOnTable[parseInt(thrownCards[hisIndex].alt)-1] = -1;
    }
    document.getElementsByClassName("minePoints")[0].innerHTML = briscolaPlay.result[briscolaPlay.myId];
    //get from the deck
    setTimeout(function(){
      deckCardPull();
      addPlayCardsListeners();
      var thrownCards = document.getElementsByClassName("thrown");
      while(thrownCards.length > 0){
        thrownCards[0].src = "../media/pictures/pic.jpg";
        thrownCards[0].removeAttribute("name");
        briscolaPlay.cardsOnTable[parseInt(thrownCards[0].alt)-1] = -1;
        removeClass(thrownCards[0], "thrown");
      }
    },1000);
  }
}

/**
Function which handles job that should be handled when the round is over.
*/
roundOverFunction = function(){
  var name = "Marinko";
  if(briscolaPlay.result[briscolaPlay.myId] < briscolaPlay.result[briscolaPlay.hisId]){
    name = "Computer";
  }
  if(briscolaPlay.result[briscolaPlay.myId] == briscolaPlay.result[briscolaPlay.hisId]){
    name = undefined;
  }
  name = localStorage.getItem("user");
  localStorage.clear();
  localStorage.setItem("user",name);
  window.location = './roundOverPage.html?winner=' + name;
}

/**
Function expanding the storage of the browser.
It sets the storage session attribute named key to
the value obj.

@param key the key of the attribute to be set
@param obj the objet to be added as attribute
*/
Storage.prototype.setObj = function(key, obj) {

        return this.setItem(key, JSON.stringify(obj))
    };
  /**
  Function expanding the storage of the browser.
  It gets the storage session attribute named key

  @param key the key of the attribute to be retrived
  */
Storage.prototype.getObj = function(key) {
        return JSON.parse(this.getItem(key))
    };

/**Object Briscola play which contains the
  elements that are play dependant.
  All info about the current play.
*/
function BriscolaPlay(){
  this.deckSize = 40;
  this.cardsPath = "media/pictures/slika";
  this.cardsLeft = this.deckSize;
  this.mixedCards = [...Array(this.deckSize).keys()];
  this.cardPoints = [
    0, 0, 0, 0, 0, 2, 3, 4, 10, 11
  ]; //remaining of dealing with 10 will tell the points

  this.mixedCards.shuffle();
  this.result = [0,0];
  this.myId = 0;
  this.hisId = 1;
  //spade = 0
  //kuppe = 1
  //dinari = 2
  this.briscolaCard = -1;
  //send to the base....or base do this...
  this.onTurn = true; //player on turn
  this.myTurn = 0; //who firstplayed 0 if the player, 1 if computer

  /**Cards on player's part of the table.*/
  this.mineCards = [-1,-1,-1];
  /**Cards on computer's part of the table.*/
  this.hisCards = [-1, -1, -1];
  /**Cards on the table.*/
  this.cardsOnTable = [-1,-1];

}

BriscolaPlay.prototype = {
  constructor: BriscolaPlay,
};

BriscolaPlay.prototype.getDeckSize = function(){
  return this.deckSize;
}

BriscolaPlay.prototype.setDeckSize = function(deckSize){
  this.deckSize = deckSize;
}

BriscolaPlay.prototype.getCardPath = function(){
  return this.cardsPath;
}

BriscolaPlay.prototype.setCardPath = function(cardPath){
  this.cardsPath = cardPath;
}

BriscolaPlay.prototype.getCardsLeft = function(){
  return this.cardsLeft;
}

BriscolaPlay.prototype.setCardsLeft = function(cardsLeft){
  this.cardsLeft = cardsLeft;
}

BriscolaPlay.prototype.getMixedCards = function(){
   return this.mixedCards;
}

BriscolaPlay.prototype.setMixedCards = function(mixedCards){
  this.mixedCards = mixedCards;
}

BriscolaPlay.prototype.getCardPoints = function(){
  return this.cardPoints;
}

BriscolaPlay.prototype.setCardPoints = function(cardPoints){
  this.cardPoints = cardPoints;
}
//////////////////////////////////////////////////////
BriscolaPlay.prototype.getResult = function(){
  return this.result;
}

BriscolaPlay.prototype.setResult = function(result){
  this.result = result;
}
///////////////////////////////////////////////////////////
BriscolaPlay.prototype.getMyId = function(){
  return this.myId;
}

BriscolaPlay.prototype.setMyId = function(myId){
  this.myId = myId;
}
/////////////////////////////////////////////////////////////////////
BriscolaPlay.prototype.getHisId = function(){
  return this.hisId;
}

BriscolaPlay.prototype.setHisId = function(hisId){
  this.hisId = hisId;
}

///////////////////////////////////////////////////////////////////////
BriscolaPlay.prototype.getBriscolaCard = function(){
  return this.briscolaCard;
}

BriscolaPlay.prototype.setBriscolaCard = function(briscolaCard){
  this.briscolaCard = briscolaCard;
}

////////////////////////////////////////////////////////////
BriscolaPlay.prototype.getOnTurn = function(){
  return this.onTurn;
}

BriscolaPlay.prototype.setOnTurn = function(onTurn){
  this.onTurn = onTurn;
}
//////////////////////////////////////////////////////////
BriscolaPlay.prototype.getMyTurn = function(){
  return this.myTurn;
}

BriscolaPlay.prototype.setMyTurn = function(myTurn){
  this.myTurn = myTurn;
}

/**
  The JSON Object containing all attributes of BriscolaPlay object.
  It sets the attributes values to the corresponding values found in passed JSON
  object.

  @param json the json object which contains all info about the current
  briscola play in json form.
*/
BriscolaPlay.prototype.setJSON = function(json){
  json = JSON.parse(json);
  this.deckSize = json.deckSize;
  this.cardsPath = json.cardsPath;
  this.cardsLeft = json.cardsLeft;
  this.mixedCards = json.mixedCards;
  this.cardPoints = json.cardPoints;

  this.result = json.result;
  this.myId = json.myId;
  this.hisId = json.hisId;
  this.briscolaCard = json.briscolaCard;

  this.onTurn = json.onTurn;
  this.myTurn = json.myTurn;

  this.mineCards = json.mineCards;
  this.hisCards = json.hisCards;
  this.cardsOnTable = json.cardsOnTable;
}

/**
 Function called when the window is opened.
Function called supposing the window has been suddenlly closed, supposing the game is
intended to be returned and played till end.
*/
continueGame = function(){
  console.log(localStorage.getItem("start"));
  briscolaPlay.setJSON(localStorage.getItem("briscolaPlay"));
  console.log("hi cards "+briscolaPlay.hisCards);
  document.getElementsByClassName("minePoints")[0].innerHTML=
                  briscolaPlay.getResult()[briscolaPlay.myId];


  var briscola = document.getElementById("briscola");
  briscola.src = briscolaPlay.cardsPath + briscolaPlay.mixedCards[briscolaPlay.deckSize-1]+".jpg";
  briscolaPlay.briscolaCard = Math.floor(briscolaPlay.mixedCards[briscolaPlay.deckSize-1]/10);
  var computerTurnIsNow = false;
  var compCardsInHand = 0;

  var card = document.getElementsByClassName("computer");
  for(var i = 0; i < card.length; i++) {
    if(briscolaPlay.hisCards[i] >= 0){
        card[i].src = briscolaPlay.cardsPath+ briscolaPlay.hisCards[i]+".jpg";
        card[i].addEventListener('click', playCardEventWrapper, false);
        compCardsInHand ++;
    } else {
      card[i].src = "../media/pictures/pic.jpg";
      addClass(card[i],"addCard");
      removeClass(card[i],"playCard");
    }
  }

  var card = document.getElementsByClassName("player");
  var mineCardsInHand = 0;

  for(var i = 0; i < card.length; i++) {
    if(briscolaPlay.mineCards[i] >= 0){
        card[i].src = briscolaPlay.cardsPath+ briscolaPlay.mineCards[i]+".jpg";
        card[i].addEventListener('click', playCardEventWrapper, false);
        mineCardsInHand ++;
        addClass(card[i],"playCard");

    } else {
      card[i].src = "../media/pictures/pic.jpg";
      addClass(card[i],"addCard");
      removeClass(card[i],"playCard");
    }

   }
   if(compCardsInHand > mineCardsInHand){
     computerTurnIsNow = true;
   }

   var card = document.getElementsByClassName("throwingTable");
   for(var i = 0; i < card.length; i++) {
     if(briscolaPlay.cardsOnTable[i] >= 0){
         card[i].src = briscolaPlay.cardsPath+ briscolaPlay.cardsOnTable[i]+".jpg";
         addClass(card[i],"thrown");
         removeClass(card[i],"firstEmptySpace");
     }

    }

    if(computerTurnIsNow){
      briscolaPlay.myTurn = 0;
      briscolaPlay.onTurn = false;
      playTurn();
    }

    if(briscolaPlay.onTurn !== true){
      playTurn();
      briscolaPlay.onTurn = true;
    }

}

/**
 Function called when the window is opened.
 Function called if the new game should begin.
*/
startNewGame = function(){
  var briscola = document.getElementById("briscola");
  briscola.src = briscolaPlay.cardsPath + briscolaPlay.mixedCards[briscolaPlay.deckSize-1]+".jpg";
  briscolaPlay.briscolaCard = Math.floor(briscolaPlay.mixedCards[briscolaPlay.deckSize-1]/10);

  var card = document.getElementsByClassName("computer playCard");
  //Now we have mixed cards, let give it to the players.

  //there is 40cards saved in madia/pictures/slikeNUM.jpg form
  //each number represents one and only one picture.

  //and add listeners
  for(var i = 0; i < card.length; i++) {
      card[i].src = briscolaPlay.cardsPath+ briscolaPlay.mixedCards[i]+".jpg";
      //name of the card
      //used to calculate point
      briscolaPlay.hisCards[i] = briscolaPlay.mixedCards[i];
      briscolaPlay.setCardsLeft(briscolaPlay.cardsLeft - 1);
   }

  var card = document.getElementsByClassName("player playCard");
  for(var i = 0; i < card.length; i++) {
      card[i].src = briscolaPlay.cardsPath+ briscolaPlay.mixedCards[briscolaPlay.deckSize - briscolaPlay.cardsLeft]+".jpg";
      //name of the card
      //used to calculate point
      briscolaPlay.mineCards[i] = briscolaPlay.mixedCards[briscolaPlay.deckSize - briscolaPlay.cardsLeft];
      briscolaPlay.setCardsLeft(briscolaPlay.cardsLeft - 1);
      card[i].addEventListener('click', playCardEventWrapper, false);
   }
}

/**
Function saves all parameters in the localStorage if the page is supposed
'accedentaly' closed.
*/
onCloseTabWindowEvent = function(){
  localStorage.setObj("briscolaPlay",briscolaPlay);
  localStorage.setObj("start", false);
  if(briscolaPlay.cardsLeft == 0){
    var user = localStorage.getItem("user");
    localStorage.clear();
    localStorage.setItem("user",user);
  }
}

/**
Function called when the user whant to play, but it
should be warn to wait a bit.
It is not it turn.
*/
waitAbitPopup = function(){
  window.location = "#popup1";
}

///////////////////////////////////////////////
///////////Main /////////////////////////////
loadjscssfile("javaScript/classFunctions.js","js");
/**The game. */
var briscolaPlay = new BriscolaPlay();
////////////////////////////////////////////////////////////
//do after ready
document.onreadystatechange = function () {
  window.onbeforeunload = function () {

    onCloseTabWindowEvent();
  };
  var user = localStorage.getItem("user");
  document.getElementsByClassName("playerName")[0].innerHTML =
       user === undefined ? "Marinko" : user;


   if (document.readyState == "complete") {
     //maybe we want to restare the game.
     /**Each click must set value of the player on turn. - session component.*/
    if(localStorage.getObj("start") === true || localStorage.getObj("start") == null
          || localStorage.getItem("briscolaPlay") === null ){
      startNewGame();
      localStorage.setObj("start",false);
    } else{
      continueGame();
      console.log("start old game");
    }
 }
 }
