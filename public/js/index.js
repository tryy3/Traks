var style = [{
     "featureType": "administrative",
     "elementType": "all",
     "stylers": [{
         "visibility": "simplified"
     }]
 }, {
     "featureType": "administrative",
     "elementType": "labels.text.fill",
     "stylers": [{
         "lightness": "0"
     }]
 }, {
     "featureType": "administrative",
     "elementType": "labels.icon",
     "stylers": [{
         "color": "#c2d760"
     }]
 }, {
     "featureType": "landscape",
     "elementType": "geometry.fill",
     "stylers": [{
         "color": "#ffffff"
     }]
 }, {
     "featureType": "landscape",
     "elementType": "labels.text.fill",
     "stylers": [{
         "lightness": "0"
     }, {
         "visibility": "off"
     }]
 }, {
     "featureType": "poi",
     "elementType": "all",
     "stylers": [{
         "visibility": "off"
     }]
 }, {
     "featureType": "road",
     "elementType": "all",
     "stylers": [{
         "lightness": "70"
     }]
 }, {
     "featureType": "transit.line",
     "elementType": "geometry.fill",
     "stylers": [{
         "color": "#6666ff"
     }, {
         "gamma": "1"
     }, {
         "weight": "1.80"
     }]
 }, {
     "featureType": "transit.station.airport",
     "elementType": "all",
     "stylers": [{
         "lightness": "70"
     }]
 }, {
     "featureType": "transit.station.bus",
     "elementType": "all",
     "stylers": [{
         "lightness": "70"
     }]
 }, {
     "featureType": "water",
     "elementType": "geometry.fill",
     "stylers": [{
         "color": "#dbe7f3"
     }]
 }, {
     "featureType": "water",
     "elementType": "labels",
     "stylers": [{
         "lightness": "70"
     }]
 }];

map = new google.maps.Map(document.getElementById('map'), {
    center: {
        lat: 51.506966,
        lng: -0.129089
    },
    zoom: 12,
    styles:style
});
activetrain = null;
window.onresize = function(event) {
    setTimeout(function (){
        google.maps.event.trigger(map, "resize");
    },1500)
};
var sideactive = false;
for (var id in Companies) {
    var Company = Companies[id];
    $(".filter-company-check").append('<label><input type="checkbox" class="list_companies" data-id="'+Company.id+'"/>'+Company.name+"</label>");
}

$(document).on("keyup", ".filter", function() {
    for (id in trains) {
        trains[id].toggle();
    }
});

$(document).on("click", ".list_companies", function() {
    for (id in trains) {
        trains[id].toggle();
    }
});

$(document).on('click', '.spinny', function() {
    var train = trains[$(this).data("train")];
    $(".spinny").toggleClass("toggleButton");
    train.options.spin = !train.options.spin;
});

$(document).on('click', '.history', function() {
    var train = trains[$(this).data("train")];
    $(".history").toggleClass("toggleButton");
    train.options.history = !train.options.history;
    train.mapPoints.path.setOptions({
        strokeColor: (train.options.history) ? "#000000" : "#FF0000"
    });
});

$(document).on('click', '.follow', function() {
    var train = trains[$(this).data("train")];
    $(".follow").toggleClass("toggleButton");
    train.options.follow = !train.options.follow;
});

$(document).on('click', '.closeside', function() {
    activetrain = null;
    $(".sidehold").addClass("sideholdan");
    $(".maphold").addClass("mapholdan");
    $("body").removeClass("sideactive");
    $(".sidehold").addClass("hide");
    setTimeout(function() {
        $(".sidehold").removeClass("sideholdan");
        $(".maphold").removeClass("mapholdan");
        google.maps.event.trigger(map, "resize");
    }, 1500);

});


function showTheFilters(){
    $(".options-panel").toggleClass("here");
}

function showTheChecks(){
    $(".filter-company-check").toggleClass("showCheck");
}

function toggleLanding(){
    $(".landing").toggleClass("landingBye");
    $(".landing-home").toggleClass("landingBye");
}

function addAbout(){
    $(".landing-home").addClass("landingBye");
    setTimeout(function(){ $(".landing-info").addClass("landingHi"); }, 1000);
}

function removeAbout(){
    $(".landing-info").removeClass("landingHi");
    setTimeout(function(){ $(".landing-home").removeClass("landingBye"); }, 1000);
}

var trains = {};
var socket = io.connect();
socket.on('train', function(data) {
    if (typeof trains[data.trainID] == "undefined") {
        trains[data.trainID] = new Train(data);
    }
    else {
        trains[data.trainID].updateData(data);
    }
});

var loop = function() {
    for (var id in trains) {
        trains[id].update();
    }
    setTimeout(loop, 1000 / 30);
};
loop();