var express = require("express");
var server = express();
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var port = 1234;
var Client = require('node-rest-client').Client;
var client = new Client();
var MS = require("mongoskin");

var db = MS.db("mongodb://127.0.0.1:27017/rssReader")


server.get("/addFeed", function (req, res) {
  var url = req.query.url;
  var obj = {
    time: new Date().getTime(),
    url: url,
    id: new Date().getTime().toString(),
    name: "Untitled"
  }

  db.collection("data").insert(obj, function(e,r){
    res.send("1");
  });
});

server.get("/editFeed", function (req, res) {
  var id = req.query.id;
  var newName = req.query.newName;
  db.collection("data").findOne({id:id}, function(e,r){
    console.log(r);
    r.name = newName;
    db.collection("data").save(r, function(e1,r1){
      res.send("1");
    });
  });
});

server.get("/getAllFeeds", function (req, res) {
  db.collection("data").find({}).toArray(function(e,r){
    res.send(JSON.stringify(r))
  });
});

server.get("/makeHTTPReq", function (req, res) {
  var url = req.query.url;
  client.get(url, function (data, response) {
    // parsed response body as js object
    //console.log(data);
    res.send(data);
  });
});

server.get("/deleteFeed", function (req, res) {
  var id = parseInt(req.query.id);
  console.log(id);
  console.log(typeof id);
  db.collection("data").remove({id:id}, function(e,r){
    //console.log(r);
      res.send("1");
  });
});


server.use(methodOverride());
server.use(bodyParser());
server.use(errorHandler());
server.use(express.static(__dirname + '/public'));

console.log("Simple static server listening at http://" + hostname + ":" + port);
server.listen(port);
