console.log('----------------------------------');
console.log('----- Running NextJS server ------');
console.log('----------------------------------');

console.log('NODE_ENV', process.env.NODE_ENV);

require('dotenv').config({ path: `.env.server.${process.env.LA_FOULEE_ENV}` });

const AWS = require('aws-sdk');
const express = require('express');
const next = require('next');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const dir = './src';

const app = next({ dev, dir });
const handle = app.getRequestHandler();
const server = express();

const AWSConfig = {
  secretAccessKey: process.env.secretAccessKey,
  accessKeyId: process.env.accessKeyId,
  region: process.env.region,
  endpoint: process.env.DB
};

AWS.config.update(AWSConfig);
let dbDocClient = new AWS.DynamoDB.DocumentClient();

server.get('/event/:keyword', (req, res) => {
  console.log('Req for /event/', req.params.keyword);
  const eventPage = '/event';
  const queryParams = { title: req.params.keyword };

  dbDocClient.get(
    { TableName: 'Events', Key: { keyword: queryParams.title } },
    (err, data) => {
      if (err) {
        // TODO: handle error -> the keyword doesn't exist !
        console.log(err, err.stack);
        app.render(req, res, eventPage, { keyword: null });
      } else {
        app.render(req, res, eventPage, { ...data.Item });
      }
    }
  );
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
