/* -*- coding: utf-8 -*- */

/** Module `helpers' */
var helpers = (function() {
  /*TODO: docstring */
  var checkedValueStr = function(obj, deflt) {
    var ret = deflt;
    if (obj) {
      ret = obj.toString();
    }
    return ret;
  }

  /* left padding of str with padChar */
  var padStrLeft = function(str, padChr, minWidth) {
    if (str.length >= minWidth) {
      return str;
    }

    var padChr = padChr[0]; // just to be sure it's exactly one char
    var n = minWidth - str.length
    for (var i = 0; i < n; i++) {
      str = padChr + str;
    }

    return str;
  }

  /* Exported module elements */
  var exports = {
    checkedValueStr: checkedValueStr,
    padStrLeft: padStrLeft
  }
  //
  return exports

}()); // Module `helpers'
