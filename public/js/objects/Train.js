var trainSvg = 'M 6.54 28.02 C 6.66 26.92 7.66 25.88 8.83 26.03 C 21.57 25.93 34.32 26.05 47.06 25.98 C 50.31 25.97 54.01 26.09 56.48 28.52 C 58.43 30.33 58.40 33.71 56.45 35.51 C 54.25 37.68 50.96 37.99 48.02 38.01 C 34.56 38.02 21.09 37.95 7.63 38.04 C 5.75 35.08 5.73 31.34 6.54 28.02 Z';

var Train = function(data) {
    this.trainIcon = {
        path: trainSvg,
        fillColor: "black",
        fillOpacity: 1,
        scale: .5,
        strokeColor: "black",
        strokeWeight: .5,
        anchor: new google.maps.Point(32, 32),
        rotation: 0
    };
    this.spin = 0;
    this.options = {};
    this.trainID = data.trainID;
    this.mapPoints = {
        path: new google.maps.Polyline({
            path: [{
                lng: data.from.latlng.longitude,
                lat: data.from.latlng.latitude
            }, {
                lng: data.to.latlng.longitude,
                lat: data.to.latlng.latitude
            }],
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            map: null
        }),
        train: new google.maps.Marker({
            position: {
                lng: 0,
                lat: 0
            },
            map: null,
            title: data.trainID
        })
    };
    var self = this;
    this.mapPoints.train.addListener('click', function() {
        activetrain = self.trainID;
            map.setCenter(self.trainLocation.gmaps());
            $(".sidehold").addClass("sideholdan");
            $(".maphold").addClass("mapholdan");
            $("body").addClass("sideactive");
            self.info = self.getInfo(self);
            $(".sidehold").removeClass("hide").html(self.info);
            setTimeout(function() {
                $(".sidehold").removeClass("sideholdan");
                $(".maphold").removeClass("mapholdan");
                google.maps.event.trigger(map, "resize");
            }, 1500);
    });
    this.info = "";
    this.pastLocations = [];
    this.trainLocation = new Cords(0, 0);
    this.pastInfromations = [];
    this.updateData(data);
};

Train.prototype.updateData = function(data) {
    if (data.planned_event_type == "DESTINATION") {
        console.log("DESTINATION");
    }
    if (this.lastLocation && (this.lastLocation.lat != data.from.latlng.latitude || this.lastLocation.lng != data.from.latlng.longitude)) {
        this.pastLocations.push(this.lastLocation);
        this.pastInfromations.push(this.lastInfromation);
    }

    this.sate = data.event_type;
    this.lastInfromation = data.from;
    this.nextInfromation = data.to;
    this.lastLocation = new Cords(data.from.latlng.latitude, data.from.latlng.longitude);
    this.nextLocation = new Cords(data.to.latlng.latitude, data.to.latlng.longitude);
    this.lastEvent = parseInt(data["actual_timestamp"]);
    this.nextEvent = this.lastEvent + parseInt(data["next_report_run_time"]) * 60000;
    this.bearing = turf.bearing(this.lastLocation.geojson(), this.nextLocation.geojson());
    this.distance = turf.distance(this.lastLocation.geojson(), this.nextLocation.geojson(), "miles");
    this.data = data;

    this.toggle();

    var path = [];
    for (i in this.pastLocations) {
        path.push(this.pastLocations[i].gmaps());
    }
    path.push(this.lastLocation.gmaps());
    path.push(this.nextLocation.gmaps());
    this.mapPoints.path.setPath(path);
    this.update();
};


Train.prototype.update = function() {
    if(this.trainID == activetrain){
        var newstuf = this.getInfo(self)
        if(this.info != newstuf){
            this.info = newstuf
            $(".sidehold").html(this.info)
        }

    }
    var trainLocation;
    if (this.sate == "DEPARTURE") {
        if (this.lastEvent > Date.now()) {
            trainLocation = this.lastLocation;
        }
        else if (this.nextEvent < Date.now()) {
            trainLocation = this.nextLocation;
        }
        else {
            var percent = (Date.now() - this.lastEvent) / (this.nextEvent - this.lastEvent);
            var cdistance = this.distance * percent;
            var line = turf.linestring([
                this.lastLocation.array(),
                this.nextLocation.array()
            ]);
            var point = turf.along(line, cdistance, 'miles');
            trainLocation = new Cords(point.geometry.coordinates[0], point.geometry.coordinates[1]);
        }
    }
    else if (this.sate == "ARRIVAL") {
        trainLocation = this.lastLocation;
    }
    if (trainLocation.latlng().lat != this.trainLocation.latlng().lat || trainLocation.latlng().lng != this.trainLocation.latlng().lng) {
        if(this.trainID == activetrain && this.options.follow)
        {
            map.setCenter(this.trainLocation.gmaps());
        }

        this.trainLocation= trainLocation;
        this.mapPoints.train.setPosition(this.trainLocation.gmaps());
    }

    this.SetIcon();
};

Train.prototype.SetIcon = function() {
    var icon;
    if (this.options.spin) {
        this.spin = this.spin + 10;
        icon = {
            path: trainSvg,
            fillColor: "black",
            fillOpacity: 1,
            scale: .5,
            strokeColor: "black",
            strokeWeight: .5,
            anchor: new google.maps.Point(32, 32),
            rotation: this.spin
        };
    }
    else {
        var convertedRotation = 0;

        if (this.bearing == 0) {
            convertedRotation = 90;
        }
        else if (this.bearing == 180 || this.bearing == -180) {
            convertedRotation = -90;
        }
        else if (this.bearing < 0) {
            convertedRotation = -this.bearing + 90;
        }
        else if (this.bearing > 0) {
            convertedRotation = 90 - this.bearing;
        }

        var λ1 = this.lastLocation.latlng().lng;
        var λ2 = this.nextLocation.latlng().lng;
        var φ1 = this.lastLocation.latlng().lat;
        var φ2 = this.nextLocation.latlng().lat;

        var y = Math.sin(λ2-λ1) * Math.cos(φ2);
        var x = Math.cos(φ1)*Math.sin(φ2) -
                Math.sin(φ1)*Math.cos(φ2)*Math.cos(λ2-λ1);
        var brng = Math.atan2(y, x) * (180 / Math.PI);

        icon = {
            path: trainSvg,
            fillColor: "black",
            fillOpacity: 1,
            scale: .5,
            strokeColor: "black",
            strokeWeight: .5,
            anchor: new google.maps.Point(32, 32),
            rotation: brng - 90
        };
    }
    if (this.trainIcon.rotation != icon.rotation) {
        this.trainIcon = icon;
        this.mapPoints.train.setIcon(this.trainIcon);
    }

};

Train.prototype.cleanup = function() {
    console.log("If you ever see this, then you have failed this city.");
    $("body").html("<img src='https://newstoaddotnet.files.wordpress.com/2014/08/shit-bucket-challenge.jpg' width='100%' height='100%'>")
    return "Bucket of shit";
};

Train.prototype.getInfo = function(self) {
    var output = "";
    output += "<div style='padding: 15px 15px 15px 15px;'><h1>Train " + this.trainID + "</h1>";
    output += "<h2>Last Station</h2><p>" + this.lastInfromation.StationName + "</p>";
    output += "<h2>Next Station</h2><p>" + this.nextInfromation.StationName + "</p>";
    if (this.sate == "ARRIVAL") {
        output += "<h2>Status</h2><p>Waiting to depart to " + this.nextInfromation.StationName +" "+moment(this.nextEvent).fromNow()+ "</p>";
    }
    else {
        output += "<h2>Status</h2><p>On route to " + this.nextInfromation.StationName +". Arriving  "+moment(this.nextEvent).fromNow()+ "</p>";
    }
    output += "<h2>Charted by</h2><p>"+Companies[this.data.toc_id].name+"</p>";
    output += "<button style='text-align: center;' class='spinny' data-train='" + this.trainID + "'>You spin my head right round, right round, when you go down, when you go down baby (Toggle Spin)</button>";
    output += "<button style='text-align: center;' class='history' data-train='" + this.trainID + "'>Toggle Route</button>";
    output += "<button style='text-align: center;' class='follow' data-train='" + this.trainID + "'>Toggle Follow</button>";
    output += "<button style='text-align: center;' class='closeside'>Close</button></div>";
    return output;
};

Train.prototype.checkStation = function(filter) {
    if (filter == this.nextInfromation.StationName.toLowerCase()) return true;
    if (filter == this.lastInfromation.StationName.toLowerCase()) return true;

    for (id in this.pastInfromations) {
        if (filter == this.pastInfromations[id].StationName.toLowerCase()) return true;
    }
    return false;
};

Train.prototype.checkCompanies = function(self) {
    var companies = $(".list_companies");
    var bol = true;
    for (var i = 0; i < companies.length; i++) {
        var company = $(companies[i]);
        if (!company.prop("checked")) continue;
        bol = (company.data("id")==this.data.toc_id) ? true : false;
        if (company.prop("checked") && company.data("id")==this.data.toc_id) return true;
    }
    return bol;
};

Train.prototype.toggle = function() {
    var m = map;
    if ($(".filter-train-input").val() != "" && $(".filter-train-input").val().toLowerCase() != this.trainID.toLowerCase()) m = null;
    if ($(".filter-station-input").val() != "" && !this.checkStation($(".filter-station-input").val().toLowerCase())) m = null;
    if (!this.checkCompanies()) m = null;
    this.mapPoints.train.setMap(m);
    this.mapPoints.path.setMap(m);
};