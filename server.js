'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);
var users = {};
var me;
io.on('connection', function (socket) {
  io.sockets.emit('newconnection')
  socket.on('onLogin', (userID) => {
    var user;
    user.socket = socket.id; 
    user.id = userID; 
    users.push(user); 
    var me = user
    io.sockets.emit('newuser',users)
  });
});



setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
