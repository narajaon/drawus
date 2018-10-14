const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
var io = require('socket.io')(server);
const PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + '/dist/drawus'));

console.log(__dirname + '/dist/drawus/index.html');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../dist/drawus/index.html'));
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