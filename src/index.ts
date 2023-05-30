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
	cookie: {secure: true, sameSite: 'none'}
}))

const server = http.createServer(index)
const socket = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
	},
	transports: ['websocket', 'polling'],
	pingTimeout: 60000
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

const usersState = new Map()

socket.on('connection', (socketChannel) => {

	usersState.set(socketChannel, {id: Math.random().toString(), name: "anonymous"})

	socket.on("disconnect", () => {
		usersState.delete(socketChannel)
	})

	socketChannel.on('client-name-sent', (name: string) => {
		const user = usersState.get(socketChannel)
		user.name = name
	})
	socketChannel.on('client-message-sent', (message: string) => {
		const user = usersState.get(socketChannel)
		const messageItem = {
			message: message,
			id: Math.random().toString(),
			user: {id: user.id, name: user.name}
		}
		messages.push(messageItem)
		socket.emit('new-message-sent', messageItem)
	})
	socketChannel.emit('init-messages-published', messages)
})

server.listen(PORT, () => {
	console.log('listening on *:3011');
});


