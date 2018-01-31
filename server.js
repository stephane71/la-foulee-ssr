console.log('---- Running local dev server ----');

const config = require('./config/server/env.developpement.json');
for (let name in config) {
  process.env[name] = config[name];
}
process.env['NEXT_ENV'] = 'developpement';

const express = require('express');
const next = require('next');

const serverWrapper = require('./lambda/utils/serverWrapper');
const appMiddleware = require('./lambda/utils/appMiddleware');

const dev = true;
const dir = './src';

const app = next({ dev, dir });
const handle = app.getRequestHandler();
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

server.get('/_next/*', (req, res) => {
  return handle(req, res);
});

server.get('/static/*', (req, res) => {
  return handle(req, res);
});

serverWrapper(server, app)();
