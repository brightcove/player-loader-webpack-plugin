/* eslint-disable no-console */
const request = require('request-promise');
const {ConcatSource} = require('webpack-sources');
const brightcovePlayerUrl = require('@brightcove/player-url');

const defaults = {
  embedId: 'default',
  playerId: 'default'
};

class PlayerLoaderPlugin {

  constructor(options) {
    const settings = Object.assign({}, defaults, options);
    const {accountId, embedId, playerId} = settings;

    if (!accountId || !embedId || !playerId) {
      console.error('accountId is required and, if given, playerId and embedId must have a value!');
      console.error();
      process.exit(1);
    }

    const url = brightcovePlayerUrl({accountId, embedId, playerId});

    this.playerPromise = request.get(url).catch(function(err) {
      console.error('Failed to get a player at ' + url + ' double check your options');
      console.error(err);
      console.error();
      process.exit(1);
    });
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('PlayerLoaderPlugin', (compilation, callback) => {
      this.playerPromise.then((playerjs) => {
        Object.keys(compilation.assets).forEach(function(file) {
          compilation.assets[file] = new ConcatSource(
            playerjs, compilation.assets[file]
          );
        });
        callback();
      });
    });
  }
}

module.exports = PlayerLoaderPlugin;
