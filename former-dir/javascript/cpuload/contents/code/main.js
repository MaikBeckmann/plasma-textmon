l =  new Label();
var layout = new LinearLayout(plasmoid);
l.text = "---";
layout.addItem(l);
plasmoid.resize(200, 200);


plasmoid.dataUpdated = function(name, d) {
  print("dataUpdated has been called for update on " +  name);
  if(d["value"]) {
    l.text = d["value"];
  }
};



/* NOTE: This has to done after the plasmoid.dataUpdated slot has been filled
 1) otherwise it fails silently */
print("subscribing to cpu source.");
var smDataEngine = dataEngine("systemmonitor")
print("conecting.. " + smDataEngine.connectSource("cpu/system/TotalLoad", plasmoid, 1000));




