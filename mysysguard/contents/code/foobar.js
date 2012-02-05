foobar = (function() {

    var labels = new function() 
    {
        this.wlan = new Label();
        this.cpu = new Label();
        this.mem = new Label();
        this.hdd = new Label();

        var font = QFont("Sans Serif", 6, "Normal");
        this.cpu.font = font;
        this.mem.font = font;
        this.wlan.font = font;
        this.hdd.font = font;

        this.wlan.wordWrap=false;
        this.cpu.wordWrap=false;
        this.wlan.wordWrap=false;
        this.hdd.wordWrap=false;
    };


    var names = new function() {

        var sdaBase = "disk/sda_(8:0)/Rate";

        this.cpu = "cpu/system/TotalLoad";
        this.mem = "mem/physical/application";
        this.wlanDown = "network/interfaces/wlan0/receiver/data";
        this.wlanUp = "network/interfaces/wlan0/transmitter/data";
        this.sdaRead = sdaBase + "/rblk";
        this.sdaWrite = sdaBase + "/wblk";
    };

    var data = new function()  {

        this.wlan = new Array();
        this.cpu = new Array();
        this.mem = new Array();
        this.hdd = new Array();
    };

    var functions = new function() 
    {
        this.updateData = function (name, d) {

            var nameStr = name.toString();

            if (nameStr === names.cpu ) {

                data.cpu["value"] = parseInt(d["value"]);
                data.cpu["units"] = d["units"];
            }
            else if (nameStr === names.wlanDown ) {

                if ( d["units"] === "KB/s" ) {

	            data.wlan["down_value"] = d["value"];
	            data.wlan["down_units"] = d["units"];
                }	
            }
            else if (nameStr === names.wlanUp ) {

                if ( d["units"] === "KB/s" )  {

	            data.wlan["up_value"] = d["value"];
	            data.wlan["up_units"] = d["units"];
                }	
            }
            else if (nameStr === names.mem ) {

                data.mem["value"] = parseInt(d["value"]/1024);
                data.mem["units"] = "MB";
            }
            else if (nameStr === names.sdaRead ) {	   

                data.hdd["read_value"] = parseInt(d["value"]);
                data.hdd["read_units"] = d["units"];
            }
            else if (nameStr === names.sdaWrite ) {

                data.hdd["write_value"] = parseInt(d["value"]);
                data.hdd["write_units"] = d["units"];
            }

        };
        
        this.updateView = function () {

            labels.cpu.text = data.cpu["value"] + data.cpu["units"];
            
            labels.mem.text = data.mem["value"] + data.mem["units"];
            
            labels.wlan.text = "down " + data.wlan["down_value"] + data.wlan["down_units"];
            labels.wlan.text += " up " + data.wlan["up_value"] + data.wlan["up_units"];

            labels.hdd.text = "r " + data.hdd["read_value"] + data.hdd["read_units"];
            labels.hdd.text += " w " + data.hdd["write_value"] + data.hdd["write_units"];
        };

    }; // functions
    return {
        functions: functions,
        labels: labels,
        names: names
    }
}());
