'use strict';

var net = require('net');

var server = net.createServer(handleConnection);

server.listen(1702);

function handleConnection(socket)
{
	socket.write('¿Hola?\r\n');
	socket.on('data', function(data)
	{
		var start = Date.now();
		var message = data.toString().trim();
		console.log(message);
		if (message == 'hola') {
			socket.end('mundo\r\n');
		}
		else {
			socket.end('ERROR\r\n');
		}
		console.log('Elapsed: %s', Date.now() - start);
	});
}

