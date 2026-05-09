const express = require('express');
const http = require('http');
const socket = require('socket.io');
const open = require('open');

const app = express();
const server = http.createServer(app);
const io = socket(server);

// Static file middleware - points to your 'client' folder
app.use(express.static('client'));

// Socket.io logic
io.on('connection', (sock) => {
  console.log('Someone connected via Socket.io');
  sock.emit('message', 'Hi, you are connected');
});

// Setting the port to 0 tells the OS to assign any available port
const PORT = 0;

server.listen(PORT, '0.0.0.0', async () => {
  // Retrieve the port that the computer assigned
  const assignedPort = server.address().port;
  const url = `http://localhost:${assignedPort}`;

  console.log('------------------------------------');
  console.log(`Server successfully started!`);
  console.log(`Access your app at: ${url}`);
  console.log('------------------------------------');

  // Automatically open the browser to the new random port
  try {
    await open(url);
  } catch (err) {
    console.log('Could not open browser automatically:', err.message);
  }
});