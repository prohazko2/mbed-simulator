try {
  require('dotenv').config();
} catch(err){
  console.log(`${err.message}`);
  console.log('continue');
}

const launchServer = require('./server/launch-server');
const Path = require('path');

let cache;
if (process.env['NODE_ENV'] === 'production') {
  cache = 1 * 60 * 60 * 1000; /*1hour cache*/
}

launchServer(Path.join(__dirname, 'out'), process.env.PORT || 7829, cache , true /*runtime logs*/, function(err) {
    if (err) return console.error(err);

    // noop
});

function handleTerm(signal) {
  console.log(`Received ${signal}, exiting`);
  process.exit();
}

process.on('SIGINT', handleTerm);
process.on('SIGTERM', handleTerm);
