require('dotenv').config({ path: './internals/.env' });
const AWS = require('aws-sdk');
const fs = require('fs');
const slug = require('slug');
const sm = require('sitemap');
const moment = require('moment');

const communes = require('./communes');

const BASE_URL = 'https://www.la-foulee.com';
const AWSConfig = {
  secretAccessKey: process.env.secretAccessKey,
  accessKeyId: process.env.accessKeyId,
  region: 'eu-west-3',
  endpoint: 'https://dynamodb.eu-west-3.amazonaws.com'
};

AWS.config.update(AWSConfig);
let dbDocClient = new AWS.DynamoDB.DocumentClient();

const pause = () =>
  new Promise((resolve, reject) => setTimeout(() => resolve(), 60000));

const createSitemapGlobal = () => {
  const urls = [
    {
      url: `/`,
      changefreq: 'monthly',
      lastmodISO: moment().format('YYYY-MM-DD')
    }
  ];

  const sitemap = sm.createSitemap({
    hostname: BASE_URL,
    cacheTime: 600000, // 600 sec cache period
    urls
  });

  fs.writeFileSync('./src/static/sitemap.xml', sitemap.toString());
};

let sitemapEventsRef = 0;
const createSitemapEvents = async (lastEvaluatedKey = null) => {
  const data = await getEvents(lastEvaluatedKey);
  const { Items: events, LastEvaluatedKey } = data;

  const urls = events.map(({ keyword, date }) => ({
    url: `/event/${keyword}/${moment
      .unix(date)
      .utc()
      .year()}`,
    changefreq: moment.unix(date).isBefore(moment()) ? 'yearly' : 'monthly'
    // lastmodISO: moment().format('YYYY-MM-DD')
  }));

  const sitemap = sm.createSitemap({
    hostname: BASE_URL,
    cacheTime: 600000, // 600 sec cache period
    urls
  });

  fs.writeFileSync(
    `./src/static/sitemap_events_${sitemapEventsRef}.xml`,
    sitemap.toString()
  );

  if (LastEvaluatedKey) {
    console.log('1 minute pause', LastEvaluatedKey);
    await pause();
    debugger;
    sitemapEventsRef++;
    await createSitemapEvents(LastEvaluatedKey);
  }
};

const createSitmapLists = () => {
  const urls = communes.map(c => ({
    url: `/events/${slug(c, { lower: true })}`,
    changefreq: 'weekly',
    lastmodISO: moment().format('YYYY-MM-DD')
  }));

  const sitemap = sm.createSitemap({
    hostname: BASE_URL,
    cacheTime: 600000, // 600 sec cache period
    urls
  });

  fs.writeFileSync('./src/static/sitemap_lists.xml', sitemap.toString());
};

build();

async function build() {
  console.log('See the code to create sitemaps');
  // console.log('Building sitemap_lists');
  // createSitmapLists();
  // console.log('-- sitemap_lists updated');

  console.log('Building sitemap_events');
  await createSitemapEvents();
  console.log('-- sitemap_events updated');
  debugger;

  // createSitemapGlobal();
}

function getEvents(lastEvaluatedKey = null) {
  let params = {
    TableName: process.env.EVENTS_TABLE
  };
  if (lastEvaluatedKey) {
    params = { ...params, ExclusiveStartKey: lastEvaluatedKey };
  }
  return new Promise((resolve, reject) => {
    dbDocClient.scan(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        reject(err);
        return;
      }
      console.log('scan ok');
      resolve(data);
    });
  });
}
