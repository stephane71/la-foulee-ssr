'use strict';

const express = require('express');
const next = require('next');
const serverWrapper = require('./utils/serverWrapper');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: './src' });
const handle = app.getRequestHandler();

const server = express();

server.get('/_next/*', (req, res) => {
  return handle(req, res);
});

module.exports.handler = serverWrapper(server, app);
