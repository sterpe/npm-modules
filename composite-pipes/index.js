
/**
 * This module provides for a Compound/Composite pipeable stream.
 *
 * By Compound/Composite I mean that we can pipe together two or
 * more streams as an exportable module but that in userland that 
 * internal sequence of streams appears to be and can be manipulated 
 * as if it were actually a single transform stream and not a composite
 * of streams.
 *
 * This is useful if you need to pipe the outside src stream into some
 * kind of PassThrough Stream with specific stream options: i.e., encoding,
 * highWaterMark, objectMode, etc, before piping into the main transform
 * stream that your module provides, and userland never has to be exposed
 * to the internals, dependencies, or requirements of your transform.
 *
 */

var Transform = require('stream').Transform
  , PassThrough = require('stream').PassThrough
  , util = require('util')
  ;

function CompositeStream(streams, opts) {
  "use strict";

  var self = this
    ;

  if (!(this instanceof CompositeStream)) {
    return new CompositeStream(streams, opts);
  }
  opts = opts || {};

  if (opts.objectMode !== false) {
    opts.objectMode = true;
  }

  CompositeStream.super_.call(this, opts);

  self.proxyStream = new PassThrough(opts);

  if (!Array.isArray(streams)) {
    streams = [self.proxyStream, streams];
  } else {
    streams = [self.proxyStream].concat(streams);
  }

  streams.forEach(function (src, index) {
    var dest = streams[index + 1];

    if (dest) {

      src.on('end', function () {
        src.unpipe(dest);
      });

      src.pipe(dest);

    } else {
      //It's the 'head' of the output stream, or the tail, ymmv.
      self._head = src;
    }
    src.on('error', function (e) {
      self.emit('error', e);
    });
  });
}

util.inherits(CompositeStream, Transform);

CompositeStream.prototype._transform = function (chunk, encoding, done) {
  "use strict";
  this.proxyStream.push(chunk);
  done();
};

CompositeStream.prototype._flush = function (done) {
  "use strict";

  var self = this;

  this._head.on('end', function () {
    self.push(null);
    done();
  });


  this._head.on('data', function (chunk) {
    self.push(chunk);
  });

  this.proxyStream.push(null);
};


module.exports = function (streams, opts) {
  return new CompositeStream(streams, opts)
};
