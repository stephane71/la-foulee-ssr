console.log('----------------------------------');
console.log('----- Running NextJS server ------');
console.log('----------------------------------');

console.log('NODE_ENV', process.env.NODE_ENV);

const env =
  process.env.LA_FOULEE_ENV === 'local' ? 'dev' : process.env.LA_FOULEE_ENV;
require('dotenv').config({ path: `.env.server.${env}` });

const express = require('express');
const next = require('next');

const getSitemap = require('./internals/getSitemap');
const getCity = require('./src/server/getCity');
const getEvents = require('./src/server/getEvents');
const getGeohash = require('./src/server/getGeohash');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const dir = './src';

const app = next({ dev, dir });
const handle = app.getRequestHandler();
const server = express();

server.use(function(req, res, next) {
  if (req.path.substr(-1) == '/' && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    res.redirect(301, req.path.slice(0, -1) + query);
  } else {
    next();
  }
});

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

// TODO: update new sitemap files name
server.get('/sitemap/:sitemap', async (req, res) => {
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
  res.sendFile(req.params.sitemap, options);
});

server.get('/event/:keyword/:edition', (req, res) => {
  app.render(req, res, '/event');
});

server.get('/event/:keyword', (req, res) => {
  app.render(req, res, '/event');
});

server.get('/events/:city', async (req, res) => {
  let position = null;
  let city = null;
  let events = [];

  try {
    city = await getCity(req.params.city);
    if (!city) res.statusCode = 404;
    else {
      position = getGeohash(city);
      events = await getEvents(position);
    }
  } catch (e) {
    console.log(
      `[La Foulée] - Error - Server:'/events/${
        req.params.city
      }' | Error when try to fetch city or events`
    );
    console.log(e);
    res.statusCode = 500;
  }

  app.render(req, res, '/events', { ...req.query, events, city, position });
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
