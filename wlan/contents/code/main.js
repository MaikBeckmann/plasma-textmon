// -*- coding: utf-8 -*-

/** Javscript modules */
if (!plasmoid.include("helpers.js")) {
  throw ("[CODE ERROR] couldn't load helpers.js module");
}

// Font properties
var styleSheet = { "font-family": "Liberation Mono",
                   "font-style": "normal",
                   "font-size": "10px",
                   "color": "white" };


/** wlan */
var wlan = (function () {
  var that = {};

  that.sourceDown = "network/interfaces/wlan0/receiver/data";
  that.sourceUp = "network/interfaces/wlan0/transmitter/data";
  that.sources = [that.sourceDown, that.sourceUp];
  that.cache = {
    down: {value: "----", units: "KB/s"},
    up: {value: "----", units: "KB/s"}
  };

  var label = new Label();
  label.styleSheet = helpers.styleSheetToString(styleSheet);
  label.wordWrap = false;
  label.text = "down:----KB/s up:----KB/s";
  that.label = label;

  that.dataUpdated = function (name, data) {
    if (!data.value) { return; }

    if (name === this.sourceDown) {
      this.cache.down = data;
      this.cache.down.value = parseInt(data.value, 10).toString();
    } else if (name === this.sourceUp) {
      this.cache.up = data;
      this.cache.up.value = parseInt(data.value, 10).toString();
    }

    var down = this.cache.down;
    var paddedValue = helpers.padStrLeft(down.value, ' ', 4);
    var text = "down:" + paddedValue + down.units;
    //
    text += " ";
    //
    var up = this.cache.up;
    var paddedValue = helpers.padStrLeft(up.value, ' ', 4);
    text += "up:" + paddedValue + up.units;

    this.label.text = text;
  };

  return that;
}());


/**
  Connect sinks to their sources.
*/

/* Throws if connection fails */
function checkedConnectSource(engine, source, sink) {
  if (!engine.connectSource(source, sink, 1000)) {
    throw ("connection attempt to '" + source + "' failed");
  }
}

var engine = dataEngine("systemmonitor");

for (var k in wlan.sources) {
  checkedConnectSource(engine,  wlan.sources[k], wlan);
}


/** layout */
var layout = new LinearLayout(plasmoid);
layout.addItem(wlan.label);
