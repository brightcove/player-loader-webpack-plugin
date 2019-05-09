/* eslint-disable no-console */
const path = require('path');
const PlayerLoader = require('../src/index.js');

const accountId = process.env.BC_ACCOUNT_ID;

if (!accountId) {
  console.error('You must set a valid `BC_ACCOUNT_ID` environment variable!');
  console.error();
  process.exit(1);
}

const playerId = process.env.BC_PLAYER_ID || 'default';
const embedId = process.env.BC_EMBED_ID || 'default';

module.exports = {
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    filename: 'dist.js',
    path: path.resolve(__dirname)
  },
  plugins: [
    new PlayerLoader({accountId, embedId, playerId, prependTo: 'dist.js'})
  ]
};
