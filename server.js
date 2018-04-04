console.log('----------------------------------');
console.log('---- Running local dev server ----');
console.log('----------------------------------');

process.env['NEXT_ENV'] = 'developpement';

const express = require('express');
const next = require('next');

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

app
  .prepare()
  .then(() => {
    server.listen(3000, err => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
