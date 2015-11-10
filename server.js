var path = require('path');
var express = require('express');

var port = process.env.PORT ? process.env.PORT : 3000;
var app = express();
app.use(express.static(__dirname + '/build'));

app.get('/', function response(req, res) {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
});
