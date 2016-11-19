////////////Class handling functions
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

/**
Function used to suffle array.
It is method of object Array.
*/
Array.prototype.shuffle = function () {
    var m = this.length;
    while (m) {
        let i = Math.floor(Math.random() * m--);
        [this[m], this[i]] = [this[i], this[m]];
    }
    return this;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
This is function that simulates computer player playing.
the return should be the number of the computer holding card that will be trown
in this turn.

@return cardIndex; it is in the range 1-3,
    depends on the card that computer holds.
*/
computerTurn = function() {
  var cards = document.getElementsByClassName("playCard computer");
  return getRandomInt(0,cards.length);
}

////////////////////////event functions///////////////////
/**
Function wich simulates thet one cardis played.
If playCardClass = "playCard computer" it simulates computer playing.
If playCardClass = "playCard player" it simulates player playing.
If there is no empty space to play the card (the turn is over),
it does nothing.

index - the index of the card to be played.
      If < 0, the rsandom card is played
*/
playTurn = function(playCardClass = "playCard computer", index = -1){
  var spaceToThrowCard = document.getElementsByClassName("firstEmptySpace");
  var cards = document.getElementsByClassName(playCardClass);
  if(index < 0){
    index = computerTurn();
  } else {//get the one you need
    cards = document.getElementsByClassName(playCardClass+" "+index);
    index = 0;
  }

  if(spaceToThrowCard == undefined || spaceToThrowCard.length < 1){
    return;
  }
  spaceToThrowCard[0].src = cards[index].src;
  spaceToThrowCard[0].name = cards[index].name;
  addClass(spaceToThrowCard[0],"thrown");

  removeClass(spaceToThrowCard[0], "firstEmptySpace");

  cards[index].src = "/";
  cards[index].removeAttribute("name");

  addClass(cards[index], "addCard");
  removeClass(cards[index], "playCard");
}

/**
It gets the card from the deck to the playCard of the computer or player.
classWhereToPutCard == "player addCard", than the card is added to the player
classWhereToPutCard == "computer addCard", than the card is put to the
    computer.
*/
getCardFromTheDeckFor = function(classWhereToPutCard){
  var spaceToThrowCard = document.getElementsByClassName(classWhereToPutCard+" addCard");
  if(spaceToThrowCard.length < 1){
    return;
  }
  var firstSpace = spaceToThrowCard[0];
  spaceToThrowCard[0].src = cardsPaht+ mixedCards[deckSize - cardsLeft]+".jpg";
  spaceToThrowCard[0].name = mixedCards[deckSize - cardsLeft];
  cardsLeft--;
  addClass(spaceToThrowCard[0], "playCard");//it is updating so first addClass
  //than remove
  removeClass(spaceToThrowCard[0], "addCard");
}


//On click trow the card.
//player is alwasy first
playCardEvent = function(e){
  e.preventDefault();
  var target = e.target;

  if(hasClass(target,"player") && hasClass(target,"playCard")){
    //playCard are just images that can be played
    if(onTurn){
      playTurn("player playCard", parseInt(target.alt));
      setTimeout(playTurn(),1000);
    } else{
      console.log("It is not your turn!! Wait a bit.");
      alert("Wait a bit :D")
    }
  }
}

playCardEventWrapper = function(e){
  playCardEvent(e);
  setTimeout(sumCards(),6250);
  console.log(result);
}

/**
Function doing the action to be done when the deck card is clicked.
Simulates the pulling card from the deck.
*/
deckCardEvent = function(){
  if(cardsLeft < 1){
    return;
  }
  if(onTurn){
    getCardFromTheDeckFor("player addCard");
  } else {
    getCardFromTheDeckFor("computer addCard");
  }

  //if that was the last non-briscola card.
  //remove it from the deck
  if(cardsLeft == 1){
    var deckCard = document.getElementsByClassName("deckCard");
    for(var i = 0; i < deckCard.length; i++){
      deckCard[i].removeEventListener('click',deckCardEvent,false);
      deckCard[i].src = "/";
    }
  }
  if(onTurn){
    getCardFromTheDeckFor("computer addCard");
  } else {
    getCardFromTheDeckFor("player addCard");
  }
  //if that was tghe last card.
  //remove it from the deck
  if(cardsLeft == 0){
    var briscola = document.getElementById("briscola");
    briscola.src = "/";
  }
}

////////
sumeToMineResult = function(pointsSum){
  result[myId] += pointsSum;
  onTurn = true;
  myTurn = 0;
}
sumToHisResult = function(pointsSum){
  result[hisId] += pointsSum;
  onTurn = false;
  myTurn = 1;
  //let him play
  setTimeout(function(){
    playTurn();
    onTurn = true;
  },5000);
}

removePlayCardsListeners = function(){
  var card = document.getElementsByClassName("playCard");
  for(var i = 0; i < card.length; i++) {

      card[i].removeEventListener('click', playCardEventWrapper, false);
   }
}

addPlayCardsListeners = function(){
  var card = document.getElementsByClassName("playCard");
  if(card.length < 1){
    roundOverFunction();
  }
  for(var i = 0; i < card.length; i++) {

      card[i].addEventListener('click', playCardEventWrapper, false);
   }
}
///////////
/**
Function summing the throwing card, and deciding from which is which.
*/
sumCards = function(){
  var thrownCards = document.getElementsByClassName("thrown");
  if(thrownCards.length == 2){
    for(var i = 0; i < thrownCards.length/2; ++i){
      var mineIndex = 2*i+myTurn;
      var hisIndex = 2*i+Math.abs(1-myTurn);

      var mine = cardPoints[parseInt(thrownCards[mineIndex].name)%10];
      var typeMine = Math.floor(parseInt(thrownCards[mineIndex].name)/10);

      var his = cardPoints[parseInt(thrownCards[hisIndex].name)%10];
      var typeHis = Math.floor(parseInt(thrownCards[hisIndex].name)/10);
      console.log(typeHis);
      console.log(typeMine);
      if(typeHis === NaN || typeMine === NaN){
        console.log("nije jos bacio");
        setTimeout(
          sumCards(),3000);
        return;
      }
      //turn is over
      removePlayCardsListeners();

      var pointsSum = mine+his;
      ///////////////////////POINTs CALCULUS////////////////////
      if(typeMine != typeHis && typeHis != briscolaCard){
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
          //his is briscola but mine is not
          console.log("ostalo");
          sumToHisResult(pointsSum);
        }
      }
      ////////////////POINTs CALCULUS DONE////////////////////////

      addClass(thrownCards[mineIndex], "firstEmptySpace");
      addClass(thrownCards[hisIndex], "firstEmptySpace");
    }
    document.getElementsByClassName("minePoints")[0].innerHTML = result[myId];
    //get from the deck
    setTimeout(function(){
      deckCardEvent();
      addPlayCardsListeners();
      var thrownCards = document.getElementsByClassName("thrown");
      while(thrownCards.length > 0){
        thrownCards[0].src = "";
        thrownCards[0].removeAttribute("name");
        removeClass(thrownCards[0], "thrown");
      }
    },1000);
  }
}

/**
FUnction which handeles job that should be handeled when the round is over.
*/
roundOverFunction = function(){
  var name = "Marinko";
  if(result[myId] < result[hisId]){
    name = "Computer";
  }
  if(result[myId] == result[hisId]){
    name = undefined;
  }
  window.location = './roundOverPage.html?winner=' + name;
}

////////////////
var deckSize = 40;
var cardsPaht = "media/pictures/slika";
var cardsLeft = deckSize;
var mixedCards = [...Array(deckSize).keys()];
var cardPoints = [
  0, 0, 0, 0, 0, 2, 3, 4, 10, 11
] //remaining of dealing with 10 will tell the points

mixedCards.shuffle();
var result = [0,0];
var myId = 0;
var hisId = 1;
//spade = 0
//kuppe = 1
//dinari = 2
var briscolaCard = -1;
//send to the base....or base do this...
//pazi tko je na redu
var onTurn = true; //I am on turn
var myTurn = 0; //who firstplayed 0 if the player, 1 if computer

////////////////////////////////////////////////////////////
//do after ready
document.onreadystatechange = function () {

   if (document.readyState == "complete") {
     /**Each click must set value of the player on turn. - session component.*/
     var card = document.getElementsByClassName("playCard");
     console.log(mixedCards)
     //Now we have mixed cards, let give it to the players.

     //there is 40cards saved in madia/pictures/slikeNUM.jpg form
     //each number represents one and only one picture.

     //and add listeners
     for(var i = 0; i < card.length; i++) {
         card[i].src = cardsPaht+ mixedCards[i]+".jpg";
         //name of the card
         //used to calculate point
         card[i].name = mixedCards[i];
         cardsLeft--;

         var briscola = document.getElementById("briscola");
         briscola.src = cardsPaht+ mixedCards[deckSize-1]+".jpg";
         briscolaCard = Math.floor(mixedCards[deckSize-1]/10);
         card[i].addEventListener('click', playCardEventWrapper, false);
      }
   }
 }
