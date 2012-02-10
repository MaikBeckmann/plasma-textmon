var layout = new LinearLayout(plasmoid);
l =  new Label();
l.text = "---";
layout.addItem(l);


var smDataEngine = dataEngine("systemmonitor")
//
smDataEngine.sourceAdded.connect(function(name) {
  var nameStr = name.toString();
  if (nameStr == "cpu/system/TotalLoad") {
    print("registering: " + nameStr);
    smDataEngine.connectSource(name, plasmoid, 1000);
  } else {
      print("not registering: " + nameStr);
  }
});


plasmoid.dataUpdated = function(name, d) {
  print("update for source " + name);
  if(d["value"]) {
    print("new value is " + d["value"]);
    l.text = d["value"];
  }
  else {
    print("new value is 'undefined'");
  }     
};
