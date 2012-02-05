// -*- coding: utf-8 -*-

var layout = new LinearLayout(plasmoid);

print("loading foobar.js:" + plasmoid.include("foobar.js"));
var labels = foobar.labels;
var names = foobar.names;
var functions = foobar.functions

layout.addItem(labels.cpu);
layout.addItem(labels.mem);
layout.addItem(labels.wlan);
layout.addItem(labels.hdd);



plasmoid.dataUpdated = function(name, d) {

  functions.updateData(name, d);
  functions.updateView();    
};


var smDataEngine = dataEngine("systemmonitor") 

smDataEngine.sourceRemoved.connect(function(name) {
  smDataEngine.disconnectSource(name, plasmoid)
});




//dumpAllElements(labels.wlan)
plasmoid.setMinimumSize(300, 10);
plasmoid.resize(300, 10);
//
layout.spacing = 5;
layout.setContentsMargins(0,0,0,0);

smDataEngine.sourceAdded.connect(function(name) {
  var nameStr = name.toString()
  
  if ( nameStr === names.cpu || 
       nameStr === names.mem || 
       nameStr === names.wlanDown || nameStr === names.wlanUp ||
       nameStr === names.sdaRead || nameStr === names.sdaWrite ) {

    smDataEngine.connectSource(name, plasmoid, 1000);
  }

});

//dumpAllElements(this.GridLayout)
