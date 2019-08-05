require('newrelic');
const express = require('express');
const httpProxy = require('http-proxy');
const app = express();
const proxy = httpProxy.createProxyServer();

const PORT = process.env.PORT || 8888;
app.use(express.static(__dirname + '/../public'));
app.use('/:id', express.static(__dirname + '/../public'));

const restaurantServiceUrls = [
  'http://52.90.230.178',
  'http://52.23.222.126'
];

const getRandomArrayItem = (array) => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

app.all('/api/restaurant/:id', function(req, res) {
  try {
    proxy.web(req, res, {target: getRandomArrayItem(restaurantServiceUrls)});
  } catch {
    // This catches a 'socket hang up' error that proxy.web() throws if the module
    // is too slow to respond.
    res.status(504).end();
  }
});

app.all('/api/menu/:id', function(req, res) {
  // proxy.web(req, res, {target: 'http://localhost:3000'});
});

app.all('/api/nearby/:id', function(req, res) {
  // proxy.web(req, res, {target: 'http://localhost:1337'});
});



app.listen(PORT, () => console.log(`Proxy Server running on port ${PORT}`));
