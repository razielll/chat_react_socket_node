const express = require('express');
const path = require('path');

const app = express();
const server = require('http').Server(app);

const io = module.exports.io = require('socket.io')(server);

const PORT = process.env.PORT || 3231;
app.use(express.static(__dirname + '/../../build'));

app.get('*', (req, res) => {
    res.sendFile(path.join((__dirname + '/../../build/index.html')));
});

const SocketManager = require('./socketManager.js');

io.on('connection', SocketManager);

server.listen(PORT, () => console.log("Connected to port:" + PORT));