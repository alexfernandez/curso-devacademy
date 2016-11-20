'use strict';

var testing = require('testing');

function getFiveAsync(callback) {
	setImmediate(function() {
		callback('he petado', 5);
	});
}

function testFiveAsync(callback) {
	getFiveAsync((error, result) => {
		testing.check(error, 'Failed with error', callback);
		testing.equals(result, 4, 'Different result', callback);
		testing.success(callback);
	});
}

exports.test = function(callback) {
	testing.run(testFiveAsync, callback);
};

exports.test(testing.show);


