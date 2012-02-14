// -*- coding: utf-8 -*-

/** Javscript modules */
if (! plasmoid.include("helpers.js")) {
  throw("[CODE ERROR] couldn't load helpers.js module");
}


// Font properties
var styleSheet = { "font-family": "Liberation Mono",
                   "font-style": "normal",
                   "font-size": "10px",
                   "color": "white" };


// systemmonitor sources we're subscribing to.  Found via
//   : % plasmaengineexplorer
var sourceNames = (function () {
  var ret = {}

  ret["cpu"] = "cpu/system/TotalLoad";
  ret["mem"] = "mem/physical/application";
  ret["wlanDown"] = "network/interfaces/wlan0/receiver/data";
  ret["wlanUp"] = "network/interfaces/wlan0/transmitter/data";
  //
  var sdaBase = "disk/sda_(8:0)/Rate";
  ret["sdaRead"] = sdaBase + "/rblk";
  ret["sdaWrite"] = sdaBase + "/wblk";

  return ret;
})();


// Names for the labels that show the received values
var labelNames = ["cpu", "mem", "wlan", "sda"];


// Maps the sources to the matching label.
var sourceLabelMap = (function () {
  var ret = {};
  ret[sourceNames.cpu] = "cpu";
  ret[sourceNames.mem] = "mem";
  ret[sourceNames.wlanDown] = "wlan";
  ret[sourceNames.wlanUp] = "wlan";
  ret[sourceNames.sdaRead] = "sda";
  ret[sourceNames.sdaWrite] = "sda";
  return ret;
})();


// Some labels display the values of more than one source.  For these we have
// to cache the values.
var dataCache = {
  "wlan" : {
    up:   {value: "----", units: "KB/s"},
    down: {value: "----", units: "KB/s"}
  },

  "sda" : {
    read:  {value: "-----", units: "KB/s"},
    write: {value: "-----", units: "KB/s"}
  }
};


// Maps a given label name to a function that renders the data to the text the
// label displays.
var formatters = {

  "cpu": function (data) {
    var value = helpers.checkedValueStr(data["value"], '0');
    var paddedValue = helpers.padStrLeft(value, ' ', 3);
    return  paddedValue + data["units"];
  },

  "mem": function(data) {
    var value = helpers.checkedValueStr(data["value"], '0');
    var paddedValue = helpers.padStrLeft(value, ' ', 4);
    return  paddedValue + data["units"];
  },

  "wlan": function (downData, upData) {
    var ret;

    var value = helpers.checkedValueStr(downData["value"], '0');
    var paddedValue = helpers.padStrLeft(value, ' ', 4);
    ret = paddedValue + downData["units"] + " d";

    ret += "|";

    var value = helpers.checkedValueStr(upData["value"], '0');
    var paddedValue = helpers.padStrLeft(value, ' ', 4);
    ret += paddedValue + upData["units"] + " u";
    return ret;
  },

  "sda": function (readData, writeData) {
    var ret;

    var value = helpers.checkedValueStr(readData["value"], '0');
    var paddedValue = helpers.padStrLeft(value, ' ', 5);
    ret = paddedValue + readData["units"] + " r" ;

    ret += "|";

    var value = helpers.checkedValueStr(writeData["value"], '0');
    var paddedValue = helpers.padStrLeft(value, ' ', 5);
    ret += paddedValue + writeData["units"] + " w";

    return ret;
  }
};


// Creates the labels arranges them in a layout.
var labels = (function (styleSheet, labelNames) {
  /* every variable declared in here isn't global :D */

  var labels = {}
  for(var i = 0; i < labelNames.length; i++) {
    l = new Label();
    l.text= "---";
    l.wordWrap = false;
    l.styleSheet = helpers.styleSheetToString(styleSheet);
    labels[labelNames[i]] = l;
  }

  var layout = new LinearLayout(plasmoid);
  layout.spacing = 0;
  layout.setContentsMargins(0, 0, 0, 0);

  // The labels which display the actual content
  var separator = function(sepStr) {
    var l = new Label();
    l.text = sepStr;
    l.wordWrap = false;
    l.styleSheet = helpers.styleSheetToString(styleSheet);
    return l;
  }
  //
  for(var i in labelNames) {
    var name = labelNames[i]
    layout.addItem(separator("{" + name + ":"));
    layout.addItem(labels[name]);
    layout.addItem(separator("}"));
  }

  return labels;
})(styleSheet, labelNames);


// Takes the data sent from systemmonitor and dispatches the to code which
// changes the matching label.
var updateLabels = function (labels, name, sourceData) {
  if ( !sourceData["value"] ) {
    return;
  }

  var label = sourceLabelMap[name];
  if(typeof label === 'undefined') {
    throw("[CODE ERROR] unknown label");
  }

  // cpu
  if (label === "cpu") {
    var formatter = formatters[label];
    labels[label].text = formatter({ value: parseInt(sourceData["value"]),
                                      units: sourceData["units"] });
  }
  // mem
  else if (label === "mem") {
    var formatter = formatters[label];
    labels[label].text = formatter({ value: parseInt(sourceData["value"] / 1024),
                                      units: "MB" });
  }
  // sda
  else if (label === "sda") {
    var data = dataCache[label];
    if (name === sourceNames.sdaRead) {
      data["read"] = { value: parseInt(sourceData["value"]),
                       units: sourceData["units"] };
    }
    else if (name === sourceNames.sdaWrite) {
      data["write"] = { value: parseInt(sourceData["value"]),
                        units: sourceData["units"] };
    }
    dataCache[label] = data;

    var formatter = formatters[label];
    labels[label].text = formatter(data["read"], data["write"]);
  }
  // wlan
  else if (label === "wlan") {
    var data = dataCache[label];
    if (name === sourceNames.wlanDown) {
      data["down"] = { value: sourceData["value"],
                       units: sourceData["units"] };
    }
    else if (name === sourceNames.wlanUp) {
      data["up"] = { value: sourceData["value"],
                     units: sourceData["units"] };
    }
    dataCache[label] = data;

    var formatter = formatters[label];
    labels[label].text = formatter(data["down"], data["up"]);
  }
};


// Callback we give to the data engine.
plasmoid.dataUpdated = function (name, sourceData) {
  updateLabels(labels, name, sourceData);
};


// subscribe to sources
(function (engine, sources, receiver, interval) {
  if (typeof receiver.dataUpdated !== "function") {
    throw("[CODE ERROR] dataUpdated slot isn't set");
  }

  for(var k in sources) {
    var source = sources[k];
    if( ! engine.connectSource(source, receiver, interval) ) {
      throw("Wasn't able to connect to " + source);
    }
  }
})(dataEngine("systemmonitor"), sourceNames, plasmoid, 1000);
