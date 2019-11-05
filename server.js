const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const usersRouter = require("./routes/api/users");
const authenRouter = require("./routes/api/authen");
var debug = require('debug')

const app = express();



// Passport config
require("./config/passport")(passport);

// Passport middleware
app.use(passport.initialize());

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Routes
app.use("/user", usersRouter);
app.use("/auth", authenRouter);

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

  // ########### init Redis Connection ############
const redis = require('./utilities/redis');

const port = process.env.PORT || 5000;


const server = require('http').createServer(app);
const sockIO = require('./utilities/socketio');

server.listen(port,() => console.log(`Server up and running on port ${port} !`));

server.on('error', onError);
server.on('listening', onListening);
sockIO.listen(server);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}



//app.listen(port, () => console.log(`Server up and running on port ${port} !`));


module.exports = app;
