'use strict';

const express = require('express');
const next = require('next');
const getHandlerNextJS = require('./utils/getHandlerNextJS');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: './src' });
const handle = app.getRequestHandler();

const server = express();

server.get('/search', (req, res) => {
  return handle(req, res);
});

module.exports.handler = getHandlerNextJS(server, app);
