'use strict';

const express = require('express');
const next = require('next');
const apigClientFactory = require('aws-api-gateway-client').default;
const getHandlerNextJS = require('./utils/getHandlerNextJS');

const config = {
  invokeUrl: `https://api.la-foulee.com/${process.env.stageAPI}`,
  region: 'eu-west-1',
  accessKey: process.env.AccessKeyID,
  secretKey: process.env.SecretAccessKey
};
var apigClient = apigClientFactory.newClient(config);

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();

server.get('/event/:keyword', (req, res) => {
  let data;
  getStride(req.params.keyword)
    .then(data => app.render(req, res, '/event', { event: data }))
    .catch(e => {
      console.log('Something bad happened here :(');
      res.status(404).send('Event Not Found');
    });
});

module.exports.handler = getHandlerNextJS(server, app);

function getStride(strideID) {
  const params = {
    strideID
  };
  // Template syntax follows url-template https://www.npmjs.com/package/url-template
  const pathTemplate = '/stride/{strideID}';
  const method = 'GET';
  const additionalParams = {};
  const body = {};

  return apigClient
    .invokeApi(params, pathTemplate, method, additionalParams, body)
    .then(res => res.data);
}
