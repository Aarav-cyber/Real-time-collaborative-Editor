const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

app.get('/', (req, res) => {
    res.json({
        sucess: true,
        message: 'server is running'
    });
})


io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id);
    })
})

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});