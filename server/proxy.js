const express = require('express');
const httpProxy = require('http-proxy');
const app = express();
const proxy = httpProxy.createProxyServer();

const PORT = process.env.PORT || 8888;
app.use(express.static(__dirname + '/../public'));
app.use('/:id', express.static(__dirname + '/../public'));

app.all('/api/:id', function(req, res) {
  console.log('redirecting to Restaurant Main Info');
  proxy.web(req, res, {target: 'http://localhost:2000'});
});

app.all('/api/menu/:id', function(req, res) {
  console.log('redirecting to Menus');
  proxy.web(req, res, {target: 'http://localhost:3000'});
});


app.listen(PORT, () => console.log(`Proxy Server running on port ${PORT}`));
