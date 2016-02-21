var Cords = function(lat, lng) {
    this.lat = lat;
    this.lng = lng;
};
Cords.prototype.array = function() {
    return [this.lat, this.lng];
};
Cords.prototype.geojson = function() {
    return turf.point(this.array());
};
Cords.prototype.latlng = function() {
    return {
        lat: this.lat,
        lng: this.lng
    };
};
Cords.prototype.gmaps = function() {
    return new google.maps.LatLng(this.lat, this.lng);
};