import express from 'express'
import http from  'http'
import {Server} from 'socket.io'
const cors = require('cors');

const index = express()

index.use(cors());

const server = http.createServer(index)
const socket = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
	}
});

const messages = [
		{message: "Hi", id: "sdfwaf5", user: {id: "4534132dawd", name: "Pavel Voitov"}},
		{message: "Hi", id: "sdfdaf5", user: {id: "dwadwad5556", name: "chat GPT"}},
	{message: "How are you?", id: "sdfdaf5", user: {id: "dwadwad5556", name: "Pavel Voitov"}}
	]


const PORT = process.env.PORT || 3011

index.get('/', (req, res) => {
	res.send('<h1>Hello world</h1>');
});

socket.on('connection', (socketChannel) => {
	debugger
	socketChannel.on('client-message-sent', (message: string) => {
		console.log((message))
	})
	socketChannel.emit('init-messages-published', messages)
})

server.listen(PORT, () => {
	console.log('listening on *:3011');
});


