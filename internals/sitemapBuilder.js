require('dotenv').config({ path: './internals/.env' });
const AWS = require('aws-sdk');
const fs = require('fs');

const AWSConfig = {
  secretAccessKey: process.env.secretAccessKey,
  accessKeyId: process.env.accessKeyId,
  region: 'eu-west-3',
  endpoint: 'https://dynamodb.eu-west-3.amazonaws.com'
};

AWS.config.update(AWSConfig);
let dbDocClient = new AWS.DynamoDB.DocumentClient();

const SITEMAP = 'src/static/sitemap.txt';
const BASE_URL = 'https://www.la-foulee.com';
const APP_URLS = [BASE_URL];

build();

async function build() {
  const events = await getEvents();

  fs.writeFileSync(SITEMAP, '');

  const eventsURLs = events.map(
    ({ keyword }) => `${APP_URLS}/event/${keyword}`
  );

  APP_URLS.concat(eventsURLs).forEach(url => {
    fs.writeFileSync(SITEMAP, `${url}\n`, { flag: 'a' });
  });
}

function getEvents() {
  return JSON.parse(
    fs.readFileSync('../competition-scraper/out/events_bis.json')
  );

  return new Promise((resolve, reject) => {
    dbDocClient.scan(
      {
        TableName: process.env.EVENTS_TABLE
      },
      (err, data) => {
        if (err) {
          console.log(err, err.stack);
          reject(err);
          return;
        }
        debugger;
        resolve(data.Items);
      }
    );
  });
}
