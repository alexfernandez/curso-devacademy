'use strict';

const params = {
	port: 1702,
};

function letsDoIt(param)
{
	params.port = 7;
	var i;
	if (param) {
		i = 5;
	} else {
		i = 6;
	}
}

letsDoIt();

