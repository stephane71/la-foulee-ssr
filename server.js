console.log('---- Running local dev server ----');

const config = require('./config/server/env.developpement.json');
for (let name in config) {
  process.env[name] = config[name];
}
process.env['NEXT_ENV'] = 'developpement';

const express = require('express');
const next = require('next');

const serverWrapper = require('./lambda/utils/serverWrapper');

const dev = true;
const dir = './src';

const app = next({ dev, dir });
const handle = app.getRequestHandler();
const server = express();
const APP_PAGE = '/';

server.get('/_next/*', (req, res) => {
  return handle(req, res);
});

server.get('/static/*', (req, res) => {
  return handle(req, res);
});

server.get('*', (req, res) => {
  // FIXME: doesn't serve pre-render pages
  return app.render(req, res, APP_PAGE, {});
});

serverWrapper(server, app)();
