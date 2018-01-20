'use strict';

const express = require('express');
const next = require('next');
const serverWrapper = require('./utils/serverWrapper');
const getStrideList = require('./api/getStrideList');

const apigClientFactory = require('./utils/getAPIGatewayClient');
const apigClient = apigClientFactory();

const dev = process.env.NEXT_ENV !== 'production';
const app = next({ dev, dir: './src' });
const handle = app.getRequestHandler();

const server = express();

server.get('/search', (req, res) => {
  // app.render(req, res, '/search', { eventList: 'test' });

  const selectors = {
    month: '0-2018',
    dep: '',
    page: 0
  };

  getStrideList(apigClient, selectors).then(data =>
    app.render(req, res, '/search', { eventList: data })
  );
  //   .catch(err => handle(req, res, { data: err }));
});

module.exports.handler = serverWrapper(server, app);
