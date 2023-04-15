const http = require('http');
const { Server } = require('socket.io');

const app = require('./app');

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
});

io.on('connect', socket => {
  console.log('Connected');
  socket.emit('welcome', 'This message come from server');
});

httpServer.listen(8080);

module.exports = {
  httpServer,
  io
};
