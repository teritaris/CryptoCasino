const express = require('express');
const app = express();

app.set('port', (process.env.PORT || 8890));

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, access_token'
  )

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.send(200)
  } else {
    next()
  }
}
app.use(allowCrossDomain)

app.get('/', function(request, response) {
  response.send('Hello World!\n');
});

app.get('/jp', function(request, response) {
  const name1 = request.query.name1 || 'Name1';
  const name2 = request.query.name2 || 'Name2';
  console.log(name1)
  console.log(name2)
  response.send(`done`)
});

app.use("/v1", require("./casino.js"))

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
