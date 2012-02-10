// -*- coding: utf-8 -*-


/** Module `helpers' */
var helpers  = (function () {
  var concatToString = function (list, term) {
    var ret = "";
    for(var i = 0; i < list.length;  i++) {
      ret = ret + list[i] + term;
    }
    return ret;
  };

  var styleSheetToString = function (styles) {
    var lines = []
    for(var k in styles) {
      lines.push("" + k + ": " + styles[k] + ";");
    }
    return concatToString(lines, "\n");
  };


  var checkedValueStr = function (obj, deflt) {
    var ret = deflt;
    if (obj) {
      ret = obj.toString();
    }
    return ret;
  }

  /* left padding of str with padChar */
  var padStrLeft = function (str, padChr, minWidth) {
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

  return  {
    checkedValueStr: checkedValueStr,
    padStrLeft: padStrLeft,
    concatToString: concatToString,
    styleSheetToString: styleSheetToString
  };
})(); // Module `helpers'

