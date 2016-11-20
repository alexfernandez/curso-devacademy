'use strict';

let net = require('net');

let socket = net.connect(11311, handleConnection);
let commands = ['get pepito', 'set pepito manolito', 'delete pepito'];
let responses = ['Simplecached', 'END', 'STORED', 'DELETED'];

function handleConnection() {
	socket.on('data', (data) => {
		var message = data.toString().trim();
		console.log('data is %s', message);
		let response = responses.shift();
		console.assert(response == message);
		let command = commands.shift();
		if (!command) process.exit(0);
		socket.write(command + '\r\n');
	});
}

