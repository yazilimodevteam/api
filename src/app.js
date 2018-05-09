import http from 'http';
import express from 'express';
import cors from 'cors';
import io from 'socket.io';
import config from '../config/config.json';
import path from 'path';
import postgre from 'pg';
import session  from "express-session";
import bodyParser from 'body-parser';
import parseFormdata from 'parse-formdata'

// setup server
const app = express();
const server = http.createServer(app);

const socketIo = io(server);

// Allow CORS
app.use(cors());

const { Pool, Client } = postgre

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'realtime_message',
  password: 'qwer1234',
  port: 5432,
})

client.connect(function (err) {
  if (err) throw err;
  console.log("Connected!")
});

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
  extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

app.use(session({
  secret: "Özel-Anahtar",
  resave: false,
  saveUninitialized: true
}));

//İlk 

app.route('/message')
		.get(function(req, res) {
      /*if (req.session.login)
      {*/
        client.query("SELECT * FROM message ORDER BY \"Id\" DESC LIMIT 50", function (err, result, fields) {
          if (err) throw err;
          res.json(result);
          //console.log(result);
        });
      /*}
      else
      {
        res.send("Kullanıcı girişi yapılmadı.");
      }*/
      
    });
app.route('/login')
  .get(function (req, res) {
    
    if (req.session.login) return res.send(req.session.login);
    res.send("Session bulunamadı");
  })
  .post(function (req, res) {
    parseFormdata(req, function (err, data) {
      if (err) throw err
      var user_name = data.fields.user;
      var password = data.fields.password;
      console.log("Login Successful")
      console.log("User name = " + user_name + ", password is " + password);
    })
  })
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
