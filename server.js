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
  
  socket.on('onLogin', (userID) => {
    var user;
    user.socket = socket.id; 
    user.id = userID; 
    users.push(user); 
    var me = user
    io.sockets.emit('newuser',users)
  });


//     socket.on('onWhriting', (user_to) => {
//       for (var i = users.length - 1; i >= 0; i--) {
//         if(users[i].id == user_to){
//           io.to(user[i].socket).emit('ImOnWhriting');
//           break
//         }
//       }

//     });

//     socket.on('onSendMessage', (user_to,message) => {
//       for (var i = users.length - 1; i >= 0; i--) {
//         if(users[i].id == user_to){
//           io.to(user[i].socket).emit('IHaveSendMessage',({body:message}));
//           break
//         }
//       }

//     });

//     socket.on('disconnect', () => {
//         delete users[socket.id]
//         io.sockets.emit('userDisconnected',users)
//     });
});



setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
