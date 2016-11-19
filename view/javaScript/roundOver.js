function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

document.onreadystatechange = function () {

   if (document.readyState == "complete") {
     var winner = document.getElementById("winner");
     winner.innerHTML = getQueryVariable("winner");
   }
 }
