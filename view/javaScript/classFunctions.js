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
