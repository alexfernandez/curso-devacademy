'use strict';

var net = require('net');
var testing = require('testing');

function Client(host, port)
{
	this.host = host;
	this.port = port;
}

Client.prototype.connect = function(callback)
{
	this.socket = net.connect(this.port, this.host, () => {
		this.socket.once('data', (data) => {
		   console.log('started: "%s"', data);
			return callback(null);
		});
	});
};

Client.prototype.get = function(key, callback)
{
	this.socket.write('get ' + key + '\r\n');
	this.socket.once('data', function(data)
	{
		var result = String(data).trim();
		if (result == 'END')
		{
			return callback(null, null);
		}
		console.log('get "%s"', result);
		var parts = result.split(' ');
		return callback(null, parts.slice(2).join(' '));
	});
};

Client.prototype.set = function(key, value, callback)
{
	this.socket.write('set ' + key + ' ' + value + '\r\n');
	this.socket.once('data', (data) => {
		console.log('set %s', data);
 		callback(null);
	});
};

Client.prototype.delete = function(key, callback)
{
	this.socket.write('delete ' + key + '\r\n');
	this.socket.once('data', (data) => {
		console.log('delete %s', data);
 		callback(null);
	});
};

function testClient(callback) {
	var client = new Client('localhost', 11311);
	client.connect(function(error) {
		testing.check(error, 'No connection', callback);
		var key = 'pepito';
		client.get(key, function(error, result)
		{
			testing.check(error, 'No get', callback);
			testing.assert(!result, 'Should not have value', callback);
			var value = 'manolito pitó';
			client.set(key, value, function(error)
			{
				testing.check(error, 'No set', callback);
				client.get(key, function(error, result)
				{
					testing.check(error, 'No get', callback);
					testing.equals(result, value, 'Should have value', callback);
					client.delete(key, function(error)
					{
						testing.check(error, 'No delete', callback);
						client.get(key, function(error, result)
						{
							testing.check(error, 'No get after', callback);
							testing.assert(!result, 'Should have no value again', callback);
							testing.success(callback);
						});
					});
				});
			});
		});
	});
}

testing.run(testClient, testing.show);

