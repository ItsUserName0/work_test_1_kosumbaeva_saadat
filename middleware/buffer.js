const buffer = (req, res, next) => {
  let data = new Buffer('');
  req.on('data', function(chunk) {
    data = Buffer.concat([data, chunk]);
  });
  req.on('end', function() {
    req.buffer = data;
    req.mimeType = req.headers['content-type'];
    req.contentLength = req.headers['content-length'];
    next();
  });
}

module.exports = buffer;