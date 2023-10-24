const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);
const joinedIDs = {};

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  joinedIDs[socket.id]=Object.keys(joinedIDs).length;
  console.log(socket.id)
  console.log(joinedIDs[socket.id])
  socket.join(joinedIDs[socket.id])
  io.to(joinedIDs[socket.id]).emit('player info',`player${joinedIDs[socket.id]+1}`)
  if(joinedIDs[socket.id]===0){
    io.to(joinedIDs[socket.id]).emit('chat message','start the game')
    socket.on('chat message', (msg) => {
        console.log('server received')
        console.log(joinedIDs[socket.id]+1)
        io.to(joinedIDs[socket.id]+1).emit('chat message', msg);
    });
  }
  else{
    socket.on('chat message', (msg) => {
      console.log('server received')
      console.log(joinedIDs[socket.id]+1)
      io.to(joinedIDs[socket.id]+1).emit('chat message', msg);
    });
  }
  io.on('disconnection',(socket)=>{
    socket.leave(joinedIDs[socketID])
    delete joinedIDs[socketID]
  })
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
