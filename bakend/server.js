const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { YSocketIO } = require('y-socket.io/dist/server');

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

const ysocketio = new YSocketIO(io);

ysocketio.initialize();

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Yjs server is running'
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});