// -*- coding: utf-8 -*-
/*jslint vars: true, maxerr: 50, indent: 2 */
"use strict";

/** Module `helpers' */
var helpers  = (function () {
  function concatToString(list, term) {
    var i, len;
    var ret = "";
    for (i = 0, len = list.length; i < len;  i += 1) {
      ret = ret + list[i] + term;
    }
    return ret;
  }

  function styleSheetToString(styles) {
    var lines = [];
    var k;
    for (k in styles) {
      if (styles.hasOwnProperty(k)) {
        lines.push(k + ": " + styles[k] + ";");
      }
    }
    return concatToString(lines, "\n");
  }

  function checkedValueStr(obj, deflt) {
    var ret = deflt;
    if (obj) {
      ret = obj.toString();
    }
    return ret;
  }

  /* left padding of str with padChar */
  function padStrLeft(str, padChr, minWidth) {
    var i;
    if (typeof str !== 'string') {
      throw ("[CODE ERROR] not a string");
    }
    if (str.length >= minWidth) {
      return str;
    }

    padChr = padChr[0]; // just to be sure it's exactly one char
    var n = minWidth - str.length;
    for (i = 0; i < n; i += 1) {
      str = padChr + str;
    }

    return str;
  }

  return {
    checkedValueStr: checkedValueStr,
    padStrLeft: padStrLeft,
    concatToString: concatToString,
    styleSheetToString: styleSheetToString
  };
}()); // Module `helpers'

