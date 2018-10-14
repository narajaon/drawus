const app = require('express')();
const server = require('http').createServer(app);
var io = require('socket.io')(server);
const PORT = process.env.PORT || 8080;

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('mouseEvent', (data) => {
        socket.broadcast.emit('mouseEvent', data);
    });
});

server.listen(8080, () => {
    console.log(`listening to port ${PORT}`)
});