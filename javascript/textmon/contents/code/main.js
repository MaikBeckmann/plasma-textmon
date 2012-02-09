/* -*- coding: utf-8 -*- */

/** Javscript modules */

/* internals */
print("loading internals.js:" + plasmoid.include("internals.js"));
var sourceNames = internals.sourceNames;
var labels = internals.labels;
var functions = internals.functions



/** View */

/** Outer applet dimensions */

/* Useful while developing with
  $ plasmoidviewer mysysguard */
//plasmoid.setMinimumSize(400, 10);
//plasmoid.resize(400, 10);


/* Inner applet Layout */
var layout = new LinearLayout(plasmoid);
layout.spacing = 0;
layout.setContentsMargins(0,0,0,0);

// The widgets which display the actual content
var separator = function(sepStr, styleSheet) {
  var l = new Label();
  l.text = sepStr;
  l.wordWrap = false;
  if(styleSheet) {
    l.styleSheet = styleSheet;
  }

  return l;
}
var styleSheet = labels.cpu.styleSheet;
//
layout.addItem(separator("{cpu:", styleSheet));
layout.addItem(labels.cpu);
layout.addItem(separator("}{mem:", styleSheet));
layout.addItem(labels.mem);
layout.addItem(separator("}{wlan:", styleSheet));
layout.addItem(labels.wlan);
layout.addItem(separator("}{sda:", styleSheet));
layout.addItem(labels.hdd);
layout.addItem(separator("}", styleSheet));


/** Model */

/** Controller */

/* */
plasmoid.dataUpdated = function(name, d) {
  functions.updateData(name, d);
  functions.updateView();
};

functions.connectSources(plasmoid);
