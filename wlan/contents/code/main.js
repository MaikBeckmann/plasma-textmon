// -*- coding: utf-8 -*-

/** Javscript modules */
if (!plasmoid.include("helpers.js")) {
  throw("[CODE ERROR] couldn't load helpers.js module");
}

// Font properties
var styleSheet = { "font-family": "Liberation Mono",
                   "font-style": "normal",
                   "font-size": "10px",
                   "color": "white" };


var sink = (function () {
  var obj = {}

  obj.sourceUp = "network/interfaces/wlan0/transmitter/data";
  obj.sourceDown = "network/interfaces/wlan0/receiver/data";
  obj.cache = {
    down: {value: "----", units: "KB/s"},
    up: {value: "----", units: "KB/s"}
  };

  var layout = new LinearLayout(plasmoid);
  var label = new Label();
  label.text =   obj.cache.down.value + obj.cache.up.units + " "
               + obj.cache.up.value + obj.cache.down.units;
  label.styleSheet = helpers.styleSheetToString(styleSheet);
  layout.addItem(label);
  //
  obj.layout = layout;
  obj.label = label;

  obj.dataUpdated = function (name, data) {
    if (!data["value"]) { return; }

    if (name == this.sourceDown) {
      this.cache.down = data;
      this.cache.down["value"] = parseInt(data["value"], 10);
    } else if (name == this.sourceUp) {
      this.cache.up = data;
      this.cache.up["value"] = parseInt(data["value"], 10);
    }

    var text = "up: " + this.cache.down["value"] + this.cache.down["units"];
    text += " ";
    text += "down: " + this.cache.up["value"] + this.cache.up["units"];
    this.label.text = text;
  }

  return obj;
})();


var engine = dataEngine("systemmonitor");

if ( engine.connectSource(sink.sourceDown, sink, 1000) ) {
  print("connection to '" +  sink.sourceDown + "' established");
} else {
  print("connection attempt to '" + sink.sourceDown + "' failed");
}

if ( engine.connectSource(sink.sourceUp, sink, 1000) ) {
  print("connection to '" +  sink.sourceUp  + "' established");
} else {
  print("connection attempt to '" + sink.sourceUp + "' failed");
}
