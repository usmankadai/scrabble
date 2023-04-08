const express = require('express');
const port = 8080;
const app = express();
const socket = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socket(server);
io.on('connection', (sock) => {
  console.log('someone connected');
  sock.emit('message', 'Hi, you are connected');
});
app.use(express.static('client'));
app.listen(port, function () {
  console.log('server starts on localhost:' + port);
});
