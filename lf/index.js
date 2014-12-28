var through2 = require('through2')
;

exports = through2(function (chunk, enc, done) {
	chunk.toString()
		.replace(/\r\n/g, '\n')
		.split('\n')
		.forEach(function (chunk) {
			exports.push(chunk);
		});
	done();
});

