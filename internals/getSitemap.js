require('dotenv').config({ path: './internals/.env' });
const AWS = require('aws-sdk');

const AWSConfig = {
  secretAccessKey: process.env.secretAccessKey,
  accessKeyId: process.env.accessKeyId
};
const params = {
  Bucket: 'assets.la-foulee',
  Key: 'sitemap.txt'
};

AWS.config.update(AWSConfig);
const s3 = new AWS.S3();

module.exports = function() {
  return new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const file = data.Body.toString('utf8');
      resolve(file);
    });
  });
};
