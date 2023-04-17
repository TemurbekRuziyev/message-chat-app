const http = require('http');
const { Server } = require('socket.io');
const { uniq, uniqBy } = require('lodash');

const app = require('./app');

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
});

let users = [];
let messages = [];
let rooms = [];

io.on('connect', socket => {
  socket.on('rooms:join', ({ room, username }) => {
    socket.join(room);
    rooms = uniq([...rooms, room]);
    io.emit('rooms:list', rooms);

    // Update users
    users = uniqBy([...users, { room, username, id: socket.id }], 'username');
    io.to(room).emit(
      'users:list',
      users.filter(user => user.room === room)
    );
  });

  // Leaving the room
  socket.on('rooms:leave', ({ username, room }) => {
    socket.leave(room);

    // Update users
    users = users.filter(user => user.username !== username);
    io.to(room).emit(
      'users:list',
      users.filter(user => user.room === room)
    );
  });

  // Disconnecting
  socket.on('disconnect', () => {
    const user = users.find(user => user.id === socket.id);
    users = users.filter(user => user.id !== socket.id);

    io.to(user.room).emit(
      'users:list',
      users.filter(user => user.room === user.room)
    );
  });

  // Get all rooms in Welcome page
  socket.on('getRooms', () => {
    socket.emit('rooms:list', rooms);
  });

  // Receive message and send others with the same room
  socket.on('message:send', message => {
    io.to(Array.from(socket.rooms)[1]).emit('message:one', message);
    messages.push(message);
  });

  // Send all messages to client
  socket.on('messages:list', (item, callback) => {
    callback(messages);
  });

  // Typing action
  socket.on('typing', ({ username, room }) => {
    socket.broadcast.to(room).emit('typing:indication', username);
  });

  socket.on('typing:clear', ({ room }) => {
    socket.broadcast.to(room).emit('typing:indication', '');
  });
});

httpServer.listen(8080);

module.exports = {
  httpServer,
  io
};
