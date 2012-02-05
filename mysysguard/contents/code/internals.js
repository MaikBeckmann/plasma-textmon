// -*- coding: utf-8 -*-

/** Module `internals' */
var internals = (function() {

  var labels = new function()
  {
    this.wlan = new Label();
    this.cpu = new Label();
    this.mem = new Label();
    this.hdd = new Label();

    var ls = [this.cpu, this.mem, this.wlan, this.hdd];
    var font = QFont("Liberation Mono", 6, "Normal");
    for(var e in ls) {
      ls[e].font = font;
      ls[e].wordWrap = false;
    }
  };


  var p_sourceNames = new function() {
    this.cpu = "cpu/system/TotalLoad";
    this.mem = "mem/physical/application";
    this.wlanDown = "network/interfaces/wlan0/receiver/data";
    this.wlanUp = "network/interfaces/wlan0/transmitter/data";
    //
    var sdaBase = "disk/sda_(8:0)/Rate";
    this.sdaRead = sdaBase + "/rblk";
    this.sdaWrite = sdaBase + "/wblk";
  };

  var p_data = new function()  {

    this.wlan = new Array();
    this.cpu = new Array();
    this.mem = new Array();
    this.hdd = new Array();
  };


  /** */
  var p_updateData =  function (data, name, sourceData) {

    var nameStr = name.toString();

    /* cpu */
    if (nameStr === p_sourceNames.cpu ) {

      data.cpu["value"] = parseInt(sourceData["value"]);
      data.cpu["units"] = sourceData["units"];
    }

    /* wlan */
    else if (nameStr === p_sourceNames.wlanDown ) {

      if ( sourceData["units"] === "KB/s" ) {

	data.wlan["down_value"] = sourceData["value"];
	data.wlan["down_units"] = sourceData["units"];
      }
    }
    else if (nameStr === p_sourceNames.wlanUp ) {

      if ( sourceData["units"] === "KB/s" )  {

	data.wlan["up_value"] = sourceData["value"];
	data.wlan["up_units"] = sourceData["units"];
      }
    }

    /* mem */
    else if (nameStr === p_sourceNames.mem ) {

      data.mem["value"] = parseInt(sourceData["value"]/1024);
      data.mem["units"] = "MB";
    }

    /* hdd */
    else if (nameStr === p_sourceNames.sdaRead ) {

      data.hdd["read_value"] = parseInt(sourceData["value"]);
      data.hdd["read_units"] = sourceData["units"];
    }
    else if (nameStr === p_sourceNames.sdaWrite ) {

      data.hdd["write_value"] = parseInt(sourceData["value"]);
      data.hdd["write_units"] = sourceData["units"];
    }

    /* fail */
    else {
      stop_because_undefined;
    }

  }; // updateData


  /** */
  var functions = new function()
  {
    /* */
    this.updateData = function (name, d) {
      p_updateData(p_data, name, d);
    };

    /* */
    this.updateView = function () {

      var d = p_data
      labels.cpu.text = d.cpu["value"] + d.cpu["units"];

      labels.mem.text = d.mem["value"] + d.mem["units"];

      labels.wlan.text = "down " + d.wlan["down_value"] + d.wlan["down_units"];
      labels.wlan.text += " up " + d.wlan["up_value"] + d.wlan["up_units"];

      labels.hdd.text = "r " + d.hdd["read_value"] + d.hdd["read_units"];
      labels.hdd.text += " w " + d.hdd["write_value"] + d.hdd["write_units"];
    };


    /* */
    this.isCoveredSource = function(name) {
      var ret = false;

      var isCpu = name === p_sourceNames.cpu;
      var isMem = name === p_sourceNames.mem;
      var isWlan = name === p_sourceNames.wlanDown || name === p_sourceNames.wlanUp;
      var isHdd = name === p_sourceNames.sdaRead || name === p_sourceNames.sdaWrite;

      if ( isCpu || isMem || isWlan || isHdd ) {
        ret = true;
      }

      return ret;
    }

  }; // functions


  /* Exported module elements */
  var exports = {
    functions: functions,
    labels: labels
  }
  //
  return exports

}()); // Module `internals'
