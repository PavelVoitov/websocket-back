import express from 'express'
import http from  'http'
import {Server} from 'socket.io'

const index = express()


const server = http.createServer(index)
const socket = new Server(server, {
	cors: {
		origin: "http://localhost:3000/"
	}
});

const PORT = process.env.PORT || 3011

index.get('/', (req, res) => {
	res.send('<h1>Hello world</h1>');
});

socket.on('connection', (socketChannel) => {
	socketChannel.on('client-message-sent', (message: string) => {
		console.log((message))
	})
})

server.listen(PORT, () => {
	console.log('listening on *:3011');
});


