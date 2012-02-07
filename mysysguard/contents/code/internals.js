/* -*- coding: utf-8 -*- */

/** Module `internals' */
var internals = (function() {

  var p_labels = new function()
  {
    this.wlan = new Label();
    this.cpu = new Label();
    this.mem = new Label();
    this.hdd = new Label();

    var ls = [this.cpu, this.mem, this.wlan, this.hdd];
    for(var i = 0; i < ls.length;  i++) {
      ls[i].wordWrap = false;
      ls[i].styleSheet = '\
font-family: "Liberation Mono" ; \
font-style: normal; \
font-size: 10px; \
color: white; \
'
    }
  };


  var p_sourceNames = new function() {
    this.cpu = "cpu/system/TotalLoad";
    this.mem = "mem/physical/application";
    this.wlanDown = "network/interfaces/wlan0/receiver/data";
    this.wlanUp = "network/interfaces/wlan0/transmitter/data";
    //
    var sdaBase = "disk/sda_(8:0)/Rate";
    this.sdaRead = sdaBase + "/rblk";
    this.sdaWrite = sdaBase + "/wblk";
  };


  var p_data = new function()  {

    this.wlan = new Array();
    this.cpu = new Array();
    this.mem = new Array();
    this.hdd = new Array();
  };


  var p_updateData =  function (data, name, sourceData) {

    var nameStr = name.toString();

    /* cpu */
    if (nameStr === p_sourceNames.cpu ) {

      data.cpu["value"] = parseInt(sourceData["value"]);
      data.cpu["units"] = sourceData["units"];
    }

    /* wlan */
    else if (nameStr === p_sourceNames.wlanDown ) {

      if ( sourceData["units"] === "KB/s" ) {

	data.wlan["down_value"] = sourceData["value"];
	data.wlan["down_units"] = sourceData["units"];
      }
    }
    else if (nameStr === p_sourceNames.wlanUp ) {

      if ( sourceData["units"] === "KB/s" )  {

	data.wlan["up_value"] = sourceData["value"];
	data.wlan["up_units"] = sourceData["units"];
      }
    }

    /* mem */
    else if (nameStr === p_sourceNames.mem ) {

      data.mem["value"] = parseInt(sourceData["value"]/1024);
      data.mem["units"] = "MB";
    }

    /* hdd */
    else if (nameStr === p_sourceNames.sdaRead ) {

      data.hdd["read_value"] = parseInt(sourceData["value"]);
      data.hdd["read_units"] = sourceData["units"];
    }
    else if (nameStr === p_sourceNames.sdaWrite ) {

      data.hdd["write_value"] = parseInt(sourceData["value"]);
      data.hdd["write_units"] = sourceData["units"];
    }

    /* fail */
    else {
      throw("source '" + sourceData + "' wasn't expected");
    }

  }; // updateData


  var checkedValueStr = function(obj, deflt) {
    var ret = deflt;
    if (obj) {
      ret = obj.toString();
    }
    return ret;
  }

  // left padding s with c to a total of n chars
  var padStrLeft= function(str, padChr, minWidth) {
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

  var p_updateView = function(data, labels) {
    var d = data;
    var value = padStrLeft(checkedValueStr(d.cpu["value"], '0'), ' ', 3);
    labels.cpu.text = value + d.cpu["units"];

    var value = padStrLeft(checkedValueStr(d.mem["value"], '0'), ' ', 4);
    labels.mem.text = value + d.mem["units"];

    var value = padStrLeft(checkedValueStr(d.wlan["down_value"], '0'), ' ', 4);
    labels.wlan.text = value + d.wlan["down_units"] + " down ";
    //
    var value = padStrLeft(checkedValueStr(d.wlan["up_value"], '0'), ' ', 4);
    labels.wlan.text += value + d.wlan["up_units"] + " up";

    var value = padStrLeft(checkedValueStr(d.hdd["read_value"], '0'), ' ', 5);
    labels.hdd.text = value + d.hdd["read_units"] + " r " ;
    //
    var value = padStrLeft(checkedValueStr(d.hdd["write_value"], '0'), ' ', 5);
    labels.hdd.text += value + d.hdd["write_units"] + " w";
  };



  /** */
  var p_functions = new function()
  {
    /* */
    this.updateData = function (name, d) {
      p_updateData(p_data, name, d);
    };

    /* */
    this.updateView = function () {
      p_updateView(p_data, p_labels);
    }

    /* */
    this.isCoveredSource = function(name) {
      var ret = false;

      var isCpu = name === p_sourceNames.cpu;
      var isMem = name === p_sourceNames.mem;
      var isWlan = name === p_sourceNames.wlanDown || name === p_sourceNames.wlanUp;
      var isHdd = name === p_sourceNames.sdaRead || name === p_sourceNames.sdaWrite;

      if ( isCpu || isMem || isWlan || isHdd ) {
        ret = true;
      }

      return ret;
    }

  }; // p_functions


  /* Exported module elements */
  var exports = {
    functions: p_functions,
    labels: p_labels
  }
  //
  return exports

}()); // Module `internals'
