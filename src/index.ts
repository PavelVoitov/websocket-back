import express from 'express'
import http from 'http'
import {Server} from 'socket.io'
const session = require('express-session');

const cors = require('cors');

const index = express()

index.use(cors())
index.use(session({
	secret: 'your-secret-key',
	resave: true,
	saveUninitialized: true,
	cookie: { secure: true, sameSite: 'none' }
}))

const server = http.createServer(index)
const socket = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
	},
	transports: ['websocket']
});

const messages = [
	{message: "Hi", id: "sdfwaf5", user: {id: "4534132dawd", name: "Pavel Voitov"}},
	{message: "Hi", id: "sdfdaf5", user: {id: "dwadwad5556", name: "chat GPT"}},
	{message: "How are you?", id: "sdfddf5", user: {id: "dwadwad5556", name: "Pavel Voitov"}}
]


const PORT = process.env.PORT || 3011

index.get('/', (req, res) => {
	res.send('<h1>Hello world</h1>');
});

socket.on('connection', (socketChannel) => {
	socketChannel.on('client-message-sent', (message: string) => {
		const messageItem = {message: message, id: Math.random().toString(), user: {id: "dwadwad5556", name: "Pavel Voitov"}}
		messages.push(messageItem)
		socket.emit('new-message-sent', messageItem)
	})
	socketChannel.emit('init-messages-published', messages)
})

server.listen(PORT, () => {
	console.log('listening on *:3011');
});


