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


var observer = (function () {
  var obj = {};

  obj.source = "cpu/system/TotalLoad";
  obj.interval = 1000;;
  obj.observers = {};
  obj.data = {value: "---", units: "%"};


  var layout = new LinearLayout(plasmoid);
  var label = new Label();
  label.text = "---%";
  label.styleSheet = helpers.styleSheetToString(styleSheet);
  layout.addItem(label);
  //
  obj.layout = layout;
  obj.label = label;


  obj.dataUpdated = function (name, data) {
    if (!data.value) { return; }
    if (name !== this.source) {
      throw("[CODE ERROR] this sink is meant to handle '" + this.source +
	    "', not '" + name + "'");
    }

    this.label.text = parseInt(data.value, 10) + data.units;
  };

  return obj;
})();


var engine = dataEngine("systemmonitor");

if (!engine.connectSource(observer.source, observer, observer.interval)) {
  throw("connection attempt to '" + observer.source +"' failed");
}
