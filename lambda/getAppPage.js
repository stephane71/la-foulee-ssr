'use strict';

const express = require('express');
const next = require('next');

const serverWrapper = require('./utils/serverWrapper');
const appMiddleware = require('./utils/appMiddleware');

const dir = './src';
const dev = process.env.NEXT_ENV !== 'production';

const app = next({ dev, dir });
const server = express();

server.get('/search', appMiddleware(app));
server.get(
  '/event/:keyword',
  (req, res, next) => {
    req.query = { event: req.params.keyword };
    next();
  },
  appMiddleware(app)
);

module.exports.handler = serverWrapper(server, app);
