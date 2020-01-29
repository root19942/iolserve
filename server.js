ta'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);
var users = [];
var me;
io.on('connection', function (socket) {
  io.sockets.emit('newconnection')
  socket.on('onLogin', (userID) => {
    var user = {id:userID,UserSocket:socket.id};
    users.push(user); 
    me = user
    io.sockets.emit('newuser',users)
  });

    socket.on('onSendMessage', (detail) => {
      for (var i = users.length - 1; i >= 0; i--) {
        if(users[i].id == detail.user_to){ 
          var socketId = users[i].UserSocket
          io.to(`${socketId}`).emit('IHaveSendMessage',{id:me.id, message:detail.message});
          break
        }
      }
    });
  
      socket.on('Imwhriting', (detail) => {
      for (var i = users.length - 1; i >= 0; i--) {
        if(users[i].id == detail.user_to){ 
          var socketId = users[i].UserSocket
          io.to(`${socketId}`).emit('PrepareYou',{detail.me});
          break
        }
      }
    });

    socket.on('disconnect', () => {
        delete users[socket.id]
        io.sockets.emit('userDisconnected',users)
    });
});



setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
