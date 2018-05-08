import http from 'http';
import express from 'express';
import cors from 'cors';
import io from 'socket.io';
import config from '../config/config.json';
import path from 'path';
import postgre from 'pg';

// setup server
const app = express();
const server = http.createServer(app);

const socketIo = io(server);

// Allow CORS
app.use(cors());

const { Pool, Client } = postgre

const client = new Client({
  user: 'postgres',
  host: '192.168.0.104',
  database: 'realtime_message',
  password: 'qwer1234',
  port: 5432,
})

client.connect(function (err) {
  if (err) throw err;
  console.log("Connected!")
});

//İlk 

app.route('/message')
		.get(function(req, res) {
      client.query("SELECT * FROM message ORDER BY id DESC LIMIT 50", function (err, result, fields) {
		    if (err) throw err;
		    res.json(result);
		    console.log(result);
		  })
		});

// Start listening
// Render a API index page
app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});


// Start listening
server.listen(process.env.PORT || config.port);
console.log(`Started on port ${config.port}`);

// Setup socket.io
socketIo.on('connection', socket => {
  const username = socket.handshake.query.username;
  console.log(`${username} connected`);

  socket.on('client:message', data => {
    console.log(`${data.username}: ${data.message}`);
	client.query("INSERT INTO \"message\" (\"user\", \"mesaj\") VALUES ('"+data.username+"', '"+data.message+"')", function (err, result) {
	    if (err) throw err;
	    console.log("1 record inserted");
	  });

    // message received from client, now broadcast it to everyone else
    socket.broadcast.emit('server:message', data);
  });

  socket.on('disconnect', () => {
    console.log(`${username} disconnected`);
  });
});

export default app;
