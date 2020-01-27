'use strict';

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
    var me = user
    io.sockets.emit('newuser',users)
  });
  
    socket.on('onWhriting', (user_to) => {
      for (var i = users.length - 1; i >= 0; i--) {
        if(users[i].user.id == user_to.id){
          user.socket = socket.id; 
          users[socket.id] = user; 
          io.to(user[i].socket).emit('ImOnWhriting');
          break
        }
      }

    });

    socket.on('onSendMessage', (detail) => {
      for (var i = users.length - 1; i >= 0; i--) {
        if(users[i].id == detail.user_to){ 
          io.to(user[i].UserSocket).emit('IHaveSendMessage',({body:detail.message}));
          io.sockets.emit('IHaveSendMessage',{body:users[i].id})
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
