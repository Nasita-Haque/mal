// init project
const express = require('express');
const app = express();
const jikanjs  = require('jikanjs');
const lessMiddleware = require("less-middleware");

app.use(lessMiddleware(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

//unofficial MAL API
app.get('/search', function(req, res, next) {
  jikanjs.loadSeason(2017, 'summer')
  .then(function (response) {
    console.log('response', response)
    res.send(response)
  })
  .catch(function (err) {
    console.log('NOT WORKING')
  })
});

//view
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
