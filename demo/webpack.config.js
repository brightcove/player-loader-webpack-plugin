const path = require('path');
const PlayerLoader = require('../src/index.js');

let accountId = '';

if (process.argv[5]) {
  accountId = process.argv[5].trim();
}

if (!accountId) {
  console.error('Please pass a valid accountId to this command. ex: `npm run demo -- 123456789`')
  console.error();
  process.exit(1);
}

module.exports = {
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    filename: 'dist.js',
    path: path.resolve(__dirname)
  },
  mode: "development",
  plugins: [
    new PlayerLoader({accountId})
  ],
};
