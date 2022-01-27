var express = require("express");
var server = express();
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var port = 1234;

server.get("/add", function (req, res) {
    var a = parseFloat(req.query.a);
    var b = parseFloat(req.query.b);
    res.send((a+b).toString()); // send response body
});

// subtraction 

server.get("/sub", function (req, res) {
    var a = parseFloat(req.query.a);
    var b = parseFloat(req.query.b);
    res.send((a-b).toString()); // send response body
});

// multiplication

server.get("/mul", function (req, res) {
    var a = parseFloat(req.query.a);
    var b = parseFloat(req.query.b);
    res.send((a*b).toString()); // send response body
});

// DIV function.  needs to have if/else to catch dividing by zero or undefined

server.get("/div", function (req, res) {
    var a = parseFloat(req.query.a);
    var b = parseFloat(req.query.b);

    if(a == 0)

    {
      res.send("A cannot be zero. Answer is undefined"); // send response body
    }

    else if (b==0)
    {
      res.send("B cannot be zero. Cannot divide by zero");
    }

    else {

      res.send((a/b).toString()); // send response body

    }
});


server.use(methodOverride());
server.use(bodyParser());
server.use(errorHandler());

console.log("Simple static server listening at http://" + hostname + ":" + port);
server.listen(port);
