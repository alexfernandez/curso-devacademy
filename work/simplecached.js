'use strict';

var net = require('net');

var server = net.createServer(handleConnection);
server.listen(11311);

function handleConnection(socket)
{
	new SocketServer(socket);
}

function SocketServer(socket)
{
	socket.write('Simplecached\r\n');
	this.socket = socket;
	socket.on('data', (data) => this.handle(data));
}

var cache = {};

SocketServer.prototype.handle = function(data)
{
	let message = String(data).trim();
	console.log('Received %s', message);
	let tokens = message.split(' ');
	let key = tokens[1];
	if (tokens[0] == 'get' && tokens.length == 2) {
		if (cache[key]) {
			this.socket.write('VALUE ' + key + ' ' + cache[key] + '\r\n');
		}
		else {
			this.socket.write('END\r\n');
		}
		return;
	}
	if (tokens[0] == 'set' && tokens.length >= 3) {
		let value = tokens.slice(2).join(' ');
		cache[key] = value;
		this.socket.write('STORED\r\n');
		return;
	}
	if (tokens[0] == 'delete' && tokens.length == 2) {
		if (cache[key]) {
			delete cache[key];
			this.socket.write('DELETED\r\n');
		}
		else {
			this.socket.write('NOT_FOUND\r\n');
		}
		return;
	}
	this.socket.write('ERROR\r\n');
};

