const express = require('express')
const next = require('next')
const apigClientFactory = require('aws-api-gateway-client').default;

yaml = require('js-yaml');
fs   = require('fs');
const env = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));

process.env.ASSETS_URL = env.ASSETS_URL

const config = {
  invokeUrl: `https://api.la-foulee.com/${env.stageAPI}`,
  region: 'eu-west-1',
  accessKey: env.AccessKeyID,
  secretKey: env.SecretAccessKey
};
var apigClient = apigClientFactory.newClient(config);

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  const server = express()

  server.get('/event/:keyword', (req, res) => {
    let data;
    getStride(req.params.keyword)
      .then(data => app.render(req, res, '/event', { event: data }))
      .catch(e => {
        console.log('Something bad happened here :(');
        res.status(404).send('Event Not Found');
      });
  });

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})


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
