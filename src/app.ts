import express from 'express'
import http from  'http'
import {Server} from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const PORT = process.env.PORT || 3011

app.get('/', (req, res) => {
	res.send('<h1>Hello world</h1>');
});

io.on('connection', (io) => {
	console.log(('a user connected'))
})

server.listen(PORT, () => {
	console.log('listening on *:3011');
});


// const { Server } = require("socket.io");
// const io = new Server(server);
//
// app.get('/', (req, res) => {
// 	res.sendFile(__dirname + '/index.html');
// });
//
// io.on('connection', (socket) => {
// 	console.log('a user connected');
// });
//
// server.listen(3000, () => {
// 	console.log('listening on *:3000');
// });