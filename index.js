var StompClient = require('stomp-client').StompClient;
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var data = require("./Rails.json");
var jsonfile = require('jsonfile');
server.listen(80);
app.use(express.static('public'));
var OSPoint = require('ospoint');
io.on('connection', function(socket) {

});

var trains = {};

function addSample(obj) {
  if (typeof trains[obj.trainID] == "undefined") trains[obj.trainID] = [];

  trains[obj.trainID].push(obj);
}
function saveSample() {
  jsonfile.writeFile("samples.json", trains, {spaces: 2}, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  });
}

var destination = '/topic/TRAIN_MVT_ALL_TOC',
  client = new StompClient('datafeeds.networkrail.co.uk', 61618, 'maxc@maxc.in', 'Hacksummit1*', '1.0');

client.connect(function(sessionId) {
  console.log('Trying to connect...');
  client.subscribe(destination, function(body, headers) {
    body = JSON.parse(body);
    for (var i = 0; i < body.length; i++) {
      var message = body[i];
      if (message.header.msg_type == '0003' && message.body.next_report_stanox != '' && message.body.loc_stanox != '') {

        var output = message.body;
        output["trainID"] = message.body.train_id;
        output["from"] = data[message.body.loc_stanox];
        if (typeof output["from"] != "undefined") {
          output["to"] = data[message.body.next_report_stanox];
          if (typeof output["to"] != "undefined") {
            var from = new OSPoint(output.from.Northing, output.from.Easting);
            output.from.latlng = from.toWGS84();
            var to = new OSPoint(output.to.Northing, output.to.Easting);
            output.to.latlng = to.toWGS84();
            io.sockets.emit("train", output);
            //addSample(output);
            console.log(output);
          }
        }
      }
    }
    //saveSample()
  });
});

/*

  */