import express from 'express'
import http from 'http'
import {Server} from 'socket.io'
import cors from 'cors';


const index = express()

index.use(cors())

const server = http.createServer(index)
const socket = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
	}
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
	socketChannel.on('client-is-typing', () => {
		socketChannel.emit('user-typing', usersState.get(socketChannel))
	})
	socketChannel.on('client-message-sent', (message: string, successFn) => {
		if (message.length > 300) {
			successFn("Message should be less than 300 chars")
			return;
		}
		if (message.trim() === '') {
			successFn("Message is empty")
			return;
		}

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


