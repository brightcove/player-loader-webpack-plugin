const path = require('path');
const PlayerLoader = require('../src/index.js');

module.exports = {
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    filename: 'dist.js',
    path: path.resolve(__dirname)
  },
  mode: "development",
  plugins: [
    new PlayerLoader({accountId: '12345678910'})
  ],
};
