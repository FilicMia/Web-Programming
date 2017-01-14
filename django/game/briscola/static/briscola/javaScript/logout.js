document.onreadystatechange = function () {

   if (document.readyState == "complete") {
     if ($(".logoutLink") != null){
       $(".logoutLink").click(function(e){
         localStorage.clear();
       });
     }
 }
 }
