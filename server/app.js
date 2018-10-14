const express = require('express');
const app = express();
const server = require('http').createServer(app);
var io = require('socket.io')(server);
const PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + '/dist/drawus'));

console.log(__dirname + '/../src/index.html');

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/../src/index.html'));
});

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('mouseEvent', (data) => {
        socket.broadcast.emit('mouseEvent', data);
    });
});

server.listen(PORT, () => {
    console.log(`listening to port ${PORT}`)
});