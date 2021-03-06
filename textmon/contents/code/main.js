// -*- coding: utf-8 -*-

/** Javscript modules */
if (!plasmoid.include("helpers.js")) {
  throw ("[CODE ERROR] couldn't load helpers.js module");
}

/** Font properties */
var styleSheet = { "font-family": "Monospace",
                   "font-style": "normal",
                   "font-size": "10px",
                   "color": "white" };

/* label factory that sets some properties we want */
function newLabel() {
  var ret = new Label();
  ret.styleSheet = helpers.styleSheetToString(styleSheet);
  ret.wordWrap = false;
  return ret;
}


/** cpu */
var cpu = (function () {
  var that = {};

  that.source = "cpu/system/TotalLoad";
  that.sources = [that.source];

  that.label = newLabel();
  that.label.text = "---%";

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


/** mem */
var mem = (function () {
  var that = {};

  that.source = "mem/physical/application";
  that.sources = [that.source];

  that.label = newLabel();
  that.label.text = "----MB";

  that.dataUpdated = function (name, data) {
    if (!data.value) { return; }
    if (name !== this.source) {
      throw ("[CODE ERROR] this routine is meant to handle '"
	     + this.source + "', not '" + name + "'");
    }

    var paddedValue = helpers.padStrLeft(parseInt(data.value / 1024, 10).toString(), ' ', 4);
    this.label.text = paddedValue + "MB";
  };

  return that;
}());


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

  that.label = newLabel();
  that.label.text = "----KB/s d|----KB/s u";

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
    var text = paddedValue + down.units + " d";
    //
    text += "|";
    //
    var up = this.cache.up;
    var paddedValue = helpers.padStrLeft(up.value, ' ', 4);
    text += paddedValue + up.units + " u";

    this.label.text = text;
  };

  return that;
}());


/** sda */
var sda = (function () {
  var that = {};

  that.sourceRead = "disk/sda_(8:0)/Rate/wblk";
  that.sourceWrite = "disk/sda_(8:0)/Rate/rblk";
  that.sources = [that.sourceRead, that.sourceWrite];
  that.cache = {
    read: {value: "----", units: "KB/s"},
    write: {value: "----", units: "KB/s"}
  };

  that.label = newLabel();
  that.label.text = "-----KB/s r|-----KB/s w";

  that.dataUpdated = function (name, data) {
    if (!data.value) { return; }

    if (name === this.sourceRead) {
      this.cache.read = data;
      this.cache.read.value = parseInt(data.value, 10).toString();
    } else if (name === this.sourceWrite) {
      this.cache.write = data;
      this.cache.write.value = parseInt(data.value, 10).toString();
    }

    var read = this.cache.read;
    var paddedValue = helpers.padStrLeft(read.value, ' ', 5);
    var text = paddedValue + read.units + " r";
    //
    text += "|";
    //
    var write = this.cache.write;
    var paddedValue = helpers.padStrLeft(write.value, ' ', 5);
    text += paddedValue + write.units + " w";

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

for(var k in wlan.sources) {
  checkedConnectSource(engine,  wlan.sources[k], wlan);
}

for(var k in sda.sources) {
  checkedConnectSource(engine, sda.sources[k], sda);
}

checkedConnectSource(engine, cpu.source, cpu);
checkedConnectSource(engine, mem.source, mem);


/** Layout */

var layout = new LinearLayout(plasmoid);
layout.spacing = 0;
layout.setContentsMargins(0, 0, 0, 0);

/* separator factory */
function sep(sepStr) {
  var l = newLabel()
  l.text = sepStr;
  return l;
}

layout.addItem(sep("{cpu:"));  layout.addItem(cpu.label);  layout.addItem(sep("}"));
layout.addItem(sep("{mem:"));  layout.addItem(mem.label);  layout.addItem(sep("}"));
layout.addItem(sep("{wlan:")); layout.addItem(wlan.label); layout.addItem(sep("}"));
layout.addItem(sep("{sda:"));  layout.addItem(sda.label);  layout.addItem(sep("}"));
