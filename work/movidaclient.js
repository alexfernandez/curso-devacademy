'use strict';

// requires
var testing = require('testing');
var basicRequest = require('basic-request');

// globals
var server = 'localhost:4071';
var stub = 'http://' + server + '/api';

function testMovidas(callback)
{
	basicRequest.post(stub + '/login?email=a@b.c&password=123', (error, result) => {
		console.log('error %s result %s', error, result);
		testing.check(error, 'Could not login', callback);
		var parsed = JSON.parse(result);
		console.log('login: %j', parsed);
		var token = parsed.token;
		testing.assert(token, 'Empty token', callback);
		basicRequest.get(stub + '/list?token=' + token, (error, result) => {
			testing.check(error, 'Could not list', callback);
			var list = JSON.parse(result);
			testing.assert(list.length, 'Nothing listed', callback);
			console.log('list %j', list);
			var id = list[0].id;
			basicRequest.get(stub + '/get?token=' + token + '&id=' + id, (error, result) => {
				testing.check(error, 'Could not get', callback);
				console.log('get %j', result);
				basicRequest.post(stub + '/add?token=' + token + '&id=' + id, (error) => {
					testing.check(error, 'Could not add', callback);
					basicRequest.get(stub + '/cart?token=' + token, (error, result) => {
						testing.check(error, 'Could not cart', callback);
						var cart = JSON.parse(result);
						console.log('cart %j', cart);
						testing.assert(cart.products.length, 'Nothing in cart', callback);
						testing.assert(cart.total, 'No total', callback);
						basicRequest.post(stub + '/checkout?token=' + token, (error) => {
							testing.check(error, 'Could not checkout', callback);
							testing.success(callback);
						});
					});
				});
			});
		});
	});
}

testing.run(testMovidas, testing.show);

