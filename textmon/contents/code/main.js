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

var layout = new LinearLayout(plasmoid);
var newLabel = function () {
  var ret = new Label();
  ret.styleSheet = helpers.styleSheetToString(styleSheet);
  ret.wordWrap = false;
  return ret;
}

var cpu = (function () {
  var obj = {}

  obj.source = "cpu/system/TotalLoad";
  obj.sources = [obj.source];

  var label = newLabel();
  label.text = "---%"
  //
  obj.layout = layout;
  obj.label = label;

  obj.dataUpdated = function (name, data) {
    if (!data["value"]) { return; }
    if (name !== this.source) {
      throw("[CODE ERROR] this routine is meant to handle '"
	    + this.source + "', not '" + name +"'");
    }

    var paddedValue = helpers.padStrLeft(parseInt(data["value"], 10).toString(), ' ', 3);
    this.label.text = paddedValue + data["units"];
  }

  return obj;
})();


var mem = (function () {
  var obj = {}

  obj.source = "mem/physical/application";
  obj.sources = [obj.source];

  var label = newLabel();
  label.text = "----MB"
  //
  obj.layout = layout;
  obj.label = label;

  obj.dataUpdated = function (name, data) {
    if (!data["value"]) { return; }
    if (name !== this.source) {
      throw("[CODE ERROR] this routine is meant to handle '"
	    + this.source + "', not '" + name +"'");
    }

    var paddedValue = helpers.padStrLeft(parseInt(data["value"]/1024, 10).toString(), ' ', 4);
    this.label.text = paddedValue + "MB";
  }

  return obj;
})();


var wlan = (function () {
  var obj = {}

  obj.sourceDown = "network/interfaces/wlan0/receiver/data";
  obj.sourceUp = "network/interfaces/wlan0/transmitter/data";
  obj.sources = [obj.sourceDown, obj.sourceUp];
  obj.cache = {
    down: {value: "----", units: "KB/s"},
    up: {value: "----", units: "KB/s"}
  };

  var label = newLabel();
  label.text = "down:----KB/s up:----KB/s";
  //
  obj.layout = layout;
  obj.label = label;

  obj.dataUpdated = function (name, data) {
    if (!data["value"]) { return; }

    if (name == this.sourceDown) {
      this.cache.down = data;
      this.cache.down["value"] = parseInt(data["value"], 10).toString();
    } else if (name == this.sourceUp) {
      this.cache.up = data;
      this.cache.up["value"] = parseInt(data["value"], 10).toString();
    }

    var paddedValue = helpers.padStrLeft(this.cache.down["value"], ' ', 4);
    var text = "down:" + paddedValue + this.cache.down["units"];
    text += " ";

    var paddedValue = helpers.padStrLeft(this.cache.up["value"], ' ', 4);
    text += "up:" + paddedValue + this.cache.up["units"];
    this.label.text = text;
  }

  return obj;
})();


var sda = (function () {
  var obj = {}

  obj.sourceRead = "disk/sda_(8:0)/Rate/wblk";
  obj.sourceWrite = "disk/sda_(8:0)/Rate/rblk";
  obj.sources = [obj.sourceRead, obj.sourceWrite];
  obj.cache = {
    read: {value: "----", units: "KB/s"},
    write: {value: "----", units: "KB/s"}
  };

  var label = newLabel();
  label.text = "read:-----KB/s write:-----KB/s";
  //
  obj.layout = layout;
  obj.label = label;

  obj.dataUpdated = function (name, data) {
    if (!data["value"]) { return; }

    if (name == this.sourceRead) {
      this.cache.read = data;
      this.cache.read["value"] = parseInt(data["value"], 10).toString();
    } else if (name == this.sourceWrite) {
      this.cache.write = data;
      this.cache.write["value"] = parseInt(data["value"], 10).toString();
    }

    var paddedValue = helpers.padStrLeft(this.cache.read["value"], ' ', 5);
    var text = "write: " + paddedValue + this.cache.read["units"];
    text += " ";
    var paddedValue = helpers.padStrLeft(this.cache.write["value"], ' ', 5);
    text += "read: " + paddedValue + this.cache.write["units"];
    this.label.text = text;
  }

  return obj;
})();

var engine = dataEngine("systemmonitor");

for(var k in wlan.sources) {
  var source = wlan.sources[k];
  if ( engine.connectSource(source, wlan, 1000) ) {
    print("connection to '" + source + "' established");
  } else {
    print("connection attempt to '" + source + "' failed");
  }
}

for(var k in sda.sources) {
  var source = sda.sources[k];
  if ( engine.connectSource(source, sda, 1000) ) {
    print("connection to '" + source + "' established");
  } else {
    print("connection attempt to '" + source + "' failed");
  }
}

if ( engine.connectSource(cpu.source, cpu, 1000) ) {
  print("connection to '" + cpu.source + "' established");
} else {
  print("connection attempt to '" + cpu.source + "' failed");
}

if ( engine.connectSource(mem.source, mem, 1000) ) {
  print("connection to '" + mem.source + "' established");
} else {
  print("connection attempt to '" + mem.source + "' failed");
}


layout.addItem(cpu.label);
layout.addItem(mem.label);
layout.addItem(wlan.label);
layout.addItem(sda.label);
