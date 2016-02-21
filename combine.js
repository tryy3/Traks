var csv = require('fast-csv');
var fs = require('fs');
var jsonfile = require('jsonfile');
var json = [];

var tiploc = fs.createReadStream("tiplocs.csv");
var railref = fs.createReadStream("RailReferences.csv");

var railrefStream = csv()
    .on("data", function(data){
        var obj = {};

        obj.AtcoCode = data[0];
        obj.TiplocCode = data[1];
        obj.CrsCode = data[2];
        obj.StationName = data[3];
        obj.StationNameLang = data[4];
        obj.GridType = data[5];
        obj.Easting = data[6];
        obj.Northing = data[7];
        obj.CreationDateTime = data[8];
        obj.ModificationDateTime = data[9];
        obj.RevisionNumber = data[10];
        obj.Modification = data[11];
        json.push(obj);
    })
    .on("end", function(){
        tiploc.pipe(tiplocStream);
    });
var newobj = {};
var tiplocStream = csv()
    .on("data", function(data){
        for (var i = 0; i < json.length; i++) {
            if (json[i].TiplocCode == data[1]) {
                var obj = {};
                newobj[data[0]] = json[i];
            }
        }
    })
    .on("end", function() {
        jsonfile.writeFile("Rails.json", newobj, {spaces: 2}, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
        });
    });



railref.pipe(railrefStream);