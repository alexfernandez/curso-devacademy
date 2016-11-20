'use strict';

// requires
var restify = require('restify');

// globals
var server = restify.createServer();
var users = {
	'a@b.c': {
		email: 'a@b.c',
		password: '123',
	},
};
var tokens = {};
var products = {
	a1: {
		id: 'a1',
		name: 'movida',
		description: 'One movida',
		price: 1.5,
	},
	a2: {
		id: 'a2',
		name: 'movidón',
		description: 'One large movida',
		price: 2,
	},
};
var carts = {};

// init
server.listen(4071, () => console.log('movidastore running'));
server.use(restify.queryParser());

server.post('/api/login', (request, response) => {
	var email = request.query.email;
	var user = users[email];
	if (!user) return response.send(400, 'Invalid user');
	if (user.password != request.query.password) return response.send(400, 'Invalid password');
	var token = Math.random();
	tokens[token] = email;
	console.log('token %s for %s', token, email);
	return response.send({token: token});
});

server.get('/api/list', (request, response) => {
	console.log('query %j', request.query);
	if (!tokens[request.query.token]) return response.send(400, 'Invalid token');
	var list = [];
	for (var id in products)
	{
		var product = products[id];
		list.push({
			id: product.id,
			name: product.name,
			price: product.price,
		});
	}
	return response.send(list);
});

server.get('/api/get', (request, response) => {
	if (!tokens[request.query.token]) return response.send(400, 'Invalid token');
	var id = request.query.id;
	console.log('query %j id %s', request.query, id);
	if (!products[id]) return response.send(404, 'Invalid id');
	return response.send(products[id]);
});

server.post('/api/add', (request, response) => {
	if (!tokens[request.query.token]) return response.send(400, 'Invalid token');
	var email = tokens[request.query.token];
	if (!carts[email])
	{
		carts[email] = {};
	}
	var cart = carts[email];
	var id = request.query.id;
	if (!cart[id])
	{
		cart[id] = 0;
	}
	cart[id] += 1;
	response.send('OK');
});

server.get('/api/cart', (request, response) => {
	if (!tokens[request.query.token]) return response.send(400, 'Invalid token');
	var email = tokens[request.query.token];
	if (!carts[email]) return response.send({});
	var cart = carts[email];
	var contents = [];
	var total = 0;
	for (var id in cart)
	{
		var product = products[id];
		var quantity = cart[id];
		total += quantity * product.price;
		contents.push({
			id: id,
			quantity: quantity,
			name: product.name,
			price: product.price,
		});
	}
	return response.send({
		products: contents,
		total: total,
	});
});

server.post('/api/checkout', (request, response) => {
	if (!tokens[request.query.token]) return response.send(400, 'Invalid token');
	var email = tokens[request.query.token];
	if (!carts[email]) return response.send(404);
	var cart = carts[email];
	var address = request.query.address;
	console.log('Checking out %j to %s', cart, address);
	carts[email] = null;
	response.send('OK');
});

