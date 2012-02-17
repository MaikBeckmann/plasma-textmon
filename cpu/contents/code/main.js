// -*- coding: utf-8 -*-

/** Javscript modules */
if (!plasmoid.include("helpers.js")) {
  throw("[CODE ERROR] couldn't load helpers.js module");
}


/** Font properties */
var styleSheet = { "font-family": "Liberation Mono",
                   "font-style": "normal",
                   "font-size": "10px",
                   "color": "white" };


/** cpu */
var cpu = (function () {
  var that = {};

  that.source = "cpu/system/TotalLoad";
  that.sources = [that.source];

  var label = new Label();
  label.styleSheet = helpers.styleSheetToString(styleSheet);
  label.wordWrap = false;
  label.text = "---%";
  that.label = label;

  that.dataUpdated = function (name, data) {
    if (!data.value) { return; }
    if (name !== this.source) {
      throw ("[CODE ERROR] this routine is meant to handle '"
	     + this.source + "', not '" + name + "'");
    }

    var paddedValue = helpers.padStrLeft(parseInt(data.value, 10).toString(), ' ', 3);
    this.label.text = paddedValue + data.units;
  };

  return that;
}());


var engine = dataEngine("systemmonitor");

if (!engine.connectSource(cpu.source, cpu, 1000)) {
  throw("connection attempt to '" + cpu.source +"' failed");
}


/** layout */
var layout = new LinearLayout(plasmoid);
layout.addItem(cpu.label);
