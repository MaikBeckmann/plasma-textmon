// -*- coding: utf-8 -*-

/** Modules */

/* foobar */
print("loading foobar.js:" + plasmoid.include("foobar.js"));
var labels = foobar.labels;
var functions = foobar.functions


/** View design */

/* The applet frame */

// There is a hacky part to this particular place: I've tweaked the width value
// (here 310) so that the plasmoid doesn't resize all that often.  Without this
// our applet would cause constant movement of neighboring applets in a panel.
// TODO: There is still a lot movement within the applet.  I want the labels
// themself to align their content right handed.
plasmoid.setMinimumSize(310, 10);
plasmoid.resize(310, 10);

/* Inside the frame */
var layout = new LinearLayout(plasmoid);
layout.spacing = 5;
layout.setContentsMargins(0,0,0,0);

// The widgets which display the actual content
layout.addItem(labels.cpu);
layout.addItem(labels.mem);
layout.addItem(labels.wlan);
layout.addItem(labels.hdd);


/** Event registration */

plasmoid.dataUpdated = function(name, d) {
  functions.updateData(name, d);
  functions.updateView();
};

/* Dataengine */

var smDataEngine = dataEngine("systemmonitor")

// Register to sources of interest
smDataEngine.sourceAdded.connect(function(name) {
  var nameStr = name.toString();
  if (functions.isCoveredSource(nameStr)) {
    smDataEngine.connectSource(name, plasmoid, 1000);
  }
});
