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

/* label factory that sets some properties we want */
var newLabel = function () {
  var ret = new Label();
  ret.styleSheet = helpers.styleSheetToString(styleSheet);
  ret.wordWrap = false;
  return ret;
}


/** cpu */
var cpu = (function () {
  var obj = {}

  obj.source = "cpu/system/TotalLoad";
  obj.sources = [obj.source];

  obj.label = newLabel();
  obj.label.text = "---%"

  obj.dataUpdated = function (name, data) {
    if (!data["value"]) { return; }
    if (name !== this.source) {
      throw("[CODE ERROR] this routine is meant to handle '"
	    + this.source + "', not '" + name +"'");
    }

    var paddedValue = helpers.padStrLeft(parseInt(data.value, 10).toString(), ' ', 3);
    this.label.text = paddedValue + data.units;
  }

  return obj;
})();


/** mem */
var mem = (function () {
  var obj = {}

  obj.source = "mem/physical/application";
  obj.sources = [obj.source];

  obj.label = newLabel();
  obj.label.text = "----MB"

  obj.dataUpdated = function (name, data) {
    if (!data.value) { return; }
    if (name !== this.source) {
      throw("[CODE ERROR] this routine is meant to handle '"
	    + this.source + "', not '" + name +"'");
    }

    var paddedValue = helpers.padStrLeft(parseInt(data.value/1024, 10).toString(), ' ', 4);
    this.label.text = paddedValue + "MB";
  }

  return obj;
})();


/** wlan */
var wlan = (function () {
  var obj = {}

  obj.sourceDown = "network/interfaces/wlan0/receiver/data";
  obj.sourceUp = "network/interfaces/wlan0/transmitter/data";
  obj.sources = [obj.sourceDown, obj.sourceUp];
  obj.cache = {
    down: {value: "----", units: "KB/s"},
    up: {value: "----", units: "KB/s"}
  };

  obj.label = newLabel();
  obj.label.text = "down:----KB/s up:----KB/s";

  obj.dataUpdated = function (name, data) {
    if (!data.value) { return; }

    if (name == this.sourceDown) {
      this.cache.down = data;
      this.cache.down.value = parseInt(data.value, 10).toString();
    } else if (name == this.sourceUp) {
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
  }

  return obj;
})();


/** sda */
var sda = (function () {
  var obj = {}

  obj.sourceRead = "disk/sda_(8:0)/Rate/wblk";
  obj.sourceWrite = "disk/sda_(8:0)/Rate/rblk";
  obj.sources = [obj.sourceRead, obj.sourceWrite];
  obj.cache = {
    read: {value: "----", units: "KB/s"},
    write: {value: "----", units: "KB/s"}
  };

  obj.label = newLabel();
  obj.label.text = "read:-----KB/s write:-----KB/s";

  obj.dataUpdated = function (name, data) {
    if (!data.value) { return; }

    if (name == this.sourceRead) {
      this.cache.read = data;
      this.cache.read.value = parseInt(data.value, 10).toString();
    } else if (name == this.sourceWrite) {
      this.cache.write = data;
      this.cache.write.value = parseInt(data.value, 10).toString();
    }

    var read = this.cache.read;
    var paddedValue = helpers.padStrLeft(read.value, ' ', 5);
    var text = "write: " + paddedValue + read.units;
    //
    text += " ";
    //
    var write = this.cache.write;
    var paddedValue = helpers.padStrLeft(write.value, ' ', 5);
    text += "read: " + paddedValue + write.units;

    this.label.text = text;
  }

  return obj;
})();


/**
  Connect sinks to their sources.
*/

/* Throws if connection fails */
var checkedConnectSource = function (engine, source, sink) {
  if (!engine.connectSource(source, sink, 1000)) {
    throw("connection attempt to '" + source + "' failed");
  }
};

var engine = dataEngine("systemmonitor");

for(var k in wlan.sources) {
  checkedConnectSource(engine,  wlan.sources[k], wlan);
}

for(var k in sda.sources) {
  checkedConnectSource(engine, sda.sources[k], sda);
}

checkedConnectSource(engine, cpu.source, cpu);
checkedConnectSource(engine, mem.source, mem);


/** layout */
var layout = new LinearLayout(plasmoid);
layout.addItem(cpu.label);
layout.addItem(mem.label);
layout.addItem(wlan.label);
layout.addItem(sda.label);
