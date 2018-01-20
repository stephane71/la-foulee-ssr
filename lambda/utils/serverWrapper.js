const serverless = require('serverless-http');

module.exports = function(server, app) {
  // server.use()
  let devHandler = (event, context, callback) => {
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
  };
  console.log('----------------');
  console.log('NEXT_ENV', process.env.NEXT_ENV);
  console.log('----------------');
  return process.env.NEXT_ENV !== 'production'
    ? devHandler
    : serverless(server);
};
