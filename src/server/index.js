const express = require('express');
const app = express();
const server = require('http').Server(app);

const io = module.exports.io = require('socket.io')(server);

const PORT = process.env.PORT || 3232;
app.use(express.static(__dirname + '/../../build'));

const SocketManager = require('./SocketManager');

io.on('connection', SocketManager);

server.listen(PORT, () => console.log("Connected to port:" + PORT));