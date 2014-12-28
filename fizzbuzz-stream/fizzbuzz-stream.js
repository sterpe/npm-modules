/* fizzbuzz-stream.js */

var Readable = require("stream").Readable
    , util = require('util')
    ;

function FizzBuzzStream() {
  "use strict";

  FizzBuzzStream.super_.apply(this, arguments);

  this._index = 0;
}

util.inherits(FizzBuzzStream, Readable);

FizzBuzzStream.prototype._read = function (size) {
  "use strict";

  var i
    , f = "Fizz"
    , b = "Buzz"
    , index
    ;

  for (i = 0; i < size && this._index  < 100; i += 1) {
    index = ++this._index;
    if (!(index % 15))
      this.push(f + b);
    else if (!(index % 3))
      this.push(f);
    else if (!(index % 5))
      this.push(b);
    else this.push(index);
  }
};

/*
 * ex:
 *
var fizzBuzzStream = new FizzBuzzStream({
  objectMode: true
});
fizzBuzzStream.on('data', function (chunk) {
  console.log(chunk);
});
*/

module.exports = FizzBuzzStream;
