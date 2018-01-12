require('dotenv').config({ path: '.env.dev' });

const express = require('express');
const next = require('next');

const getStrideList = require('./lambda/api/getStrideList');
const getStride = require('./lambda/api/getStride');
const serverWrapper = require('./lambda/utils/serverWrapper');
const apigClientFactory = require('./lambda/utils/getAPIGatewayClient');

const apigClient = apigClientFactory();
const app = next({ dev: true, dir: './src' });
const handle = app.getRequestHandler();
const server = express();

server.get('/search', (req, res) => {
  const selectors = {
    month: '0-2018',
    dep: '',
    page: 0
  };

  getStrideList(apigClient, selectors).then(data =>
    app.render(req, res, '/search', { eventList: data })
  );
});

server.get('/event/:keyword', (req, res) => {
  let data;
  getStride(apigClient, req.params.keyword)
    .then(data => app.render(req, res, '/event', { event: data }))
    .catch(e => {
      console.log('Something bad happened here :(');
      res.status(404).send('Event Not Found');
    });
});

server.get('/_next/*', (req, res) => {
  return handle(req, res);
});

server.get('/static/*', (req, res) => {
  return handle(req, res);
});

serverWrapper(server, app)();
