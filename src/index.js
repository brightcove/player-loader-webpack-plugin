const request = require('request-promise');
const {ConcatSource} = require("webpack-sources");
const PlayerLoader = require('@brightcove/player-loader');

// we don't need embedType, Promise, or refNodeInsert
const defaults = {
  embedId: 'default',
  playerId: 'default',
};

class PlayerLoaderPlugin {
  constructor(options) {
    const settings = Object.assign({}, defaults, options);
    const {accountId, embedId, playerId} = settings;

    if (!accountId || !embedId || !playerId) {
      throw new Error('accountId is required and playerId/embedId must be set to a value!')
    }

    const url = PlayerLoader.getUrl(settings);

    this.playerPromise = request.get(url).catch(function(err) {
      throw new Error('Failed to get ' + url, err);
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
