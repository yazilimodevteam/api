'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _config = require('../config/config.json');

var _config2 = _interopRequireDefault(_config);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// setup server
var app = (0, _express2.default)();
var server = _http2.default.createServer(app);

var socketIo = (0, _socket2.default)(server);

const { Pool, Client } = require('pg')

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'realtime_message',
  password: 'qwer1234',
  port: 5432,
})

client.connect(function(err) {
	  if (err) throw err;
	  console.log("Connected!")
	});


// Allow CORS
app.use((0, _cors2.default)());

// Render a API index page
app.get('/', function (req, res) {
  res.sendFile(_path2.default.resolve('public/index.html'));
});

//İlk 

app.route('/message')
		.get(function(req, res) {
		  db.query("SELECT * FROM message", function (err, result, fields) {
		    if (err) throw err;
		    res.json(result);
		    console.log(result);
		  })
		});

// Start listening
server.listen(process.env.PORT || _config2.default.port);
console.log('Started on port ' + _config2.default.port);

// Setup socket.io
socketIo.on('connection', function (socket) {
  var username = socket.handshake.query.username;
  console.log(username + ' connected');

  socket.on('client:message', function (data) {
    console.log(data.username + ': ' + data.message);
	
    client.query("INSERT INTO \"message\" (\"user\", \"mesaj\") VALUES ('"+data.username+"', '"+data.message+"')", function (err, result) {
	    if (err) throw err;
	    console.log("1 record inserted");
	  });

    // message received from client, now broadcast it to everyone else
    socket.broadcast.emit('server:message', data);
  });

  socket.on('disconnect', function () {
    console.log(username + ' disconnected');

  });
});
// client.end()


exports.default = app;
