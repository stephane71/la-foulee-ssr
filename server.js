console.log('----------------------------------');
console.log('----- Running NextJS server ------');
console.log('----------------------------------');

console.log('NODE_ENV', process.env.NODE_ENV);

require('dotenv').config({ path: `.env.server.${process.env.LA_FOULEE_ENV}` });

const express = require('express');
const next = require('next');
const getSitemap = require('./internals/getSitemap');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const dir = './src';

const app = next({ dev, dir });
const handle = app.getRequestHandler();
const server = express();

server.get('/sw.js', (req, res) => {
  var options = {
    root: __dirname + '/src/static/',
    dotfiles: 'deny'
  };
  res.sendFile('sw.js', options);
});

server.get('/robots.txt', (req, res) => {
  var options = {
    root: __dirname + '/src/static/',
    dotfiles: 'deny'
  };
  res.sendFile('robots.txt', options);
});

server.get('/sitemap.txt', async (req, res) => {
  // FIXME: S3 access when build on prod env
  // const sitemap = await getSitemap();
  // res.set('Content-Type', 'text/plain; charset=UTF-8');
  // res.status(200).send(sitemap);

  //Idea: update the sitemap any time an item has been added in DynamoDB table
  // Use DynaoDB Stream + Lambda

  var options = {
    root: __dirname + '/src/static/',
    dotfiles: 'deny'
  };
  res.sendFile('sitemap.txt', options);
});

server.get('/event/:keyword', (req, res) => {
  app.render(req, res, '/event');
});

server.get('*', (req, res) => {
  // FIXME: doesn't serve pre-render pages
  return handle(req, res);
});

app
  .prepare()
  .then(() => {
    server.listen(port, err => {
      if (err) {
        console.log(`Error when try to run NextJS server`);
        console.log(JSON.stringify(err));
        throw err;
        return;
      }
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
