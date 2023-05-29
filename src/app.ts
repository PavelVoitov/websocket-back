const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const PORT = process.env.PORT || 3011

app.get('/', (req, res) => {
	res.send('<h1>Hello world</h1>');
});

server.listen(PORT, () => {
	console.log('listening on *:3011');
});