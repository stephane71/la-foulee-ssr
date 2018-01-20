'use strict';

const express = require('express');
const next = require('next');
const serverWrapper = require('./utils/serverWrapper');
const getStride = require('./api/getStride');

const apigClientFactory = require('./utils/getAPIGatewayClient');
const apigClient = apigClientFactory();

const dev = process.env.NEXT_ENV !== 'production';
const app = next({ dev, dir: './src' });
const handle = app.getRequestHandler();
const server = express();

server.get('/event/:keyword', (req, res) => {
  let data;
  getStride(apigClient, req.params.keyword)
    .then(data => app.render(req, res, '/event', { event: data }))
    .catch(e => {
      console.log('Something bad happened here :(');
      res.status(404).send('Event Not Found');
    });
});

module.exports.handler = serverWrapper(server, app);
