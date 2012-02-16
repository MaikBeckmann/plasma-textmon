// -*- coding: utf-8 -*-

var layout = new LinearLayout(plasmoid);
var label = new Label();
label.text = "---%";
layout.addItem(label);


// Font properties
var styleSheet = { "font-family": "Liberation Mono",
                   "font-style": "normal",
                   "font-size": "10px",
                   "color": "white" };

var sink = (function () {
  var obj = {}

  obj.source = "cpu/system/TotalLoad";
  obj.interval = 1000;

  obj.dataUpdated = function (name, data) {
    if (!data["value"]) { return; }
    if (name !== this.source) {
      throw("[CODE ERROR] this sink is meant to handle '" + this.source + 
	    "', not '" + name + "'");
    }
    
    var msg = parseInt(data["value"], 10) + data["units"];
    print(msg);
  }

  return obj;
})();


var engine = dataEngine("systemmonitor");

if (! engine.connectSource(sink.source, sink, sink.interval) ) {
  throw("connection attempt to '" + sink.source +"' failed"); }
