var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\nApp (pronos2012) is running on Node.JS ' + process.version);
}).listen(15436);
