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


var view = (function () {
  var obj = {};

  var layout = new LinearLayout(plasmoid);
  var label = new Label();
  label.text = "---%";
  label.styleSheet = helpers.styleSheetToString(styleSheet);

  layout.addItem(label);

  obj.layout = layout;
  obj.label = label;
  obj.model = null;

  obj.dataUpdated = function () {
    if (!this.model) {
      throw("[CODE ERROR] Model isn't set.");
    }
    var data = this.model.data;
    this.label.text = data.value + data.units;
  }

  return obj;

})();  


var sink = (function () {
  var obj = {};

  obj.source = "cpu/system/TotalLoad";
  obj.interval = 1000;;
  obj.observers = {};
  obj.data = {value: "---", units: "%"};

  obj.dataUpdated = function (name, data) {
    if (!data["value"]) { return; }
    if (name !== this.source) {
      throw("[CODE ERROR] this sink is meant to handle '" + this.source + 
	    "', not '" + name + "'");
    }
    
    for(var k in this.observers) {
      var observer = this.observers[k];
      if (typeof observer.dataUpdated !== 'function') {
	throw("[CODE ERROR] observer hasn't got the dataUpdated slot");
      }
      this.data.value = parseInt(data.value, 10);
      observer.dataUpdated();
    }    
  };

  return obj;
})();


var engine = dataEngine("systemmonitor");

if (! engine.connectSource(sink.source, sink, sink.interval) ) {
  throw("connection attempt to '" + sink.source +"' failed"); 
}

sink.observers["label"] = view;
view.model = sink;
