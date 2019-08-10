require('newrelic');
const express = require('express');
const httpProxy = require('http-proxy');
const NodeCache = require('node-cache');

const app = express();
const proxy = httpProxy.createProxyServer();
const cache = new NodeCache();
const PORT = process.env.PORT || 8888;

app.use(express.static(__dirname + '/../public'));
app.use('/:id', express.static(__dirname + '/../public'));

const restaurantServiceUrls = [
  'http://52.90.230.178',
  'http://52.23.222.126',
  'http://54.196.95.134'
];

let urlIndex = 0;
const getNextUrl = () => {
  if (urlIndex < 2) {
    urlIndex += 1;
  } else {
    urlIndex = 0;
  }
  return restaurantServiceUrls[urlIndex];
};

const cacheResponse = (proxyRes) => {
  const chunks = [];
  const id = proxyRes.client.parser.outgoing.socket._httpMessage. __NR_segment.transaction.nameState.pathStack[0].params.id;

  proxyRes.on('data', chunk => {
    chunks.push(chunk.toString());
  })

  proxyRes.on('end', () => {
    const currentResponse = chunks.join('');
    cache.set(id, currentResponse);
  });
};

proxy.on('proxyRes', cacheResponse);

app.all('/api/restaurant/:id', function(req, res) {
  const { id } = req.params;
  cache.get(id, (err, value) => {
    if (value) {
      res.end(value);
    } else {
      proxy.web(req, res, {target: getNextUrl()}, function(err) {
        res.status(504).end();
      });
    }
  });
});

app.all('/api/menu/:id', function(req, res) {
  // proxy.web(req, res, {target: 'http://localhost:3000'});
});

app.all('/api/nearby/:id', function(req, res) {
  // proxy.web(req, res, {target: 'http://localhost:1337'});
});



app.listen(PORT, () => console.log(`Proxy Server running on port ${PORT}`));
