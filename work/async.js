'use strict';

var https = require('https');
//var async = require('async');

var array = [];
for (var i = 1; i <= 100000; i++) {
	array.push(getCallback(i));
}
series(array, function(error, result) {
	var total = 0;
	result.forEach(function(value) {
		total += value;
	});
	console.log('results: %j, total %s', result, total);
	
});

if (false) parallel();
if (false) readDebtTrue();

function parallel(array, callback)
{
	var results = [];
	var finished = false;
	array.forEach(function(next) {
		next(function(error, result) {
			if (finished) return;
			if (error) {
				finished = true;
				return callback(error);
			}
			results.push(result);
			if (results.length == array.length) return callback(null, results);
		});
	});
}

function series(array, callback) {
	callNext(array, [], callback);
}

function callNext(array, results, callback) {
	var next = array.shift();
	if (!next) return callback(null, results);
	next(function(error, result) {
		if (error) return callback(error);
		results.push(result);
		callNext(array, results, callback);
	});
}

function getCallback(i) {
	return function(callback) {
		readDebt(i, callback);
	};
}

function readDebt(number, callback) {
	setImmediate(function()
	{
		return callback(null, number);
	});
}

console.log('array is %j', array);

var cached = {};

function readDebtTrue(number, callback) {
	if (cached[number]) return callback(null, cached[number]);
	var url = 'https://raw.githubusercontent.com/alexfernandez/curso-devacademy/master/async/account-0' + number + '.json';
	https.get(url, (res) => {
		if (res.statusCode !== 200) {
			return console.error(`Invalid status code ${res.statusCode}`);
		}
		let rawData = '';
		res.on('data', (chunk) => rawData += chunk);
		res.on('end', function() {
			console.log(`Result: ${rawData}`);
			var data = JSON.parse(rawData);
			cached[number] = data.Debt;
			callback(null, data.Debt);
		}).on('error', (e) => {
			  console.error(`Got error: ${e.message}`);
		});
	});
}


