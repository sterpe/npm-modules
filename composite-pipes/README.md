composite-pipes
===============

Composite a sequence of piped streams into a single duplex stream.

__NOTE__:  There is, it turns out, already a [stream-combiner](https://github.com/dominictarr/stream-combiner) npm package whose functionality and
purpose are similar.  The differences are largely internal:
__stream_combiner__ relies on [duplex](https://github.com/Raynos/duplexer), which shims a proxy object that *appears* to be a duplex transform stream from two component streams, one readable, the other writable.

 __composite-pipes__ performs a similar function but *is* itself a node transform stream, so the read/write endpoints of the composite actually do point to the same stream object.  Six of one, half dozen of another really...

However, one advantage of the __composite-pipes__ approach is that the compositor, as an instance of a transform stream, can itself be passed the usual stream options object as an arguments and act as a default simple transforming passthrough to set options such as encoding, highWaterMark, objectMode as may be required by the destination stream.

Consider (these two are equivalent):

````javascript

  var Composite = require('composite-pipes')
    , PassThrough = require('streams').PassThrough
    , lf = require('lf')
    ; //imagine a line delimiting transform stream, for example.
  
  //The generic case a passthrough stream that chunks the data in
  //a particular way required by the consumer, but something we don't
  //really want to expose in userland.

  var pt = new PassThrough({
    objectMode: true,
    highWaterMark: 7,
    encoding: 'utf8'
  });
  var composite  = new Composite([pt, lf()]);


  //sugar syntax...possible because `composite` is a stream too!.
  var composite = new Composite(lf(), {
    objectMode: true,     
    highWaterMark: 7,     
    encoding: 'utf8'
  });


  .
  .
  .

  // Later...
  var fstream = getFileStreamSomehow();

  fstream.pipe(composite)
    .pipe(...)

````

By default a composite is always in objectMode but that can be overridden by explicitly setting objectMode to `false`.


For even more advanced functionality checkout [stream-splicer](https://github.com/substack/stream-splicer) &
[labeled-stream-splicer](https://github.com/substack/labeled-stream-splicer)

###LICENSE###

MIT.
