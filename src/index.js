/* eslint-disable no-console */
const request = require('request-promise');
const {ConcatSource} = require('webpack-sources');
const brightcovePlayerUrl = require('@brightcove/player-url');
const path = require('path');

const defaults = {
  embedId: 'default',
  playerId: 'default'
};

class PlayerLoaderPlugin {

  constructor(options) {
    this.settings_ = Object.assign({}, defaults, options);
    const {accountId, embedId, playerId} = this.settings_;

    // if prependTo was passed in, and was a string make it an array
    if (typeof this.settings_.prependTo !== 'undefined') {
      if (!Array.isArray(this.settings_.prependTo)) {
        this.settings_.prependTo = [this.settings_.prependTo];
      }
    }

    if (!accountId || !embedId || !playerId) {
      console.error('accountId is required and, if given, playerId and embedId must have a value!');
      console.error();
      process.exit(1);
    }

    this.playerUrl = brightcovePlayerUrl({accountId, embedId, playerId});

  }

  apply(compiler) {
    if (this.settings_.backwardCompatible) {
      // webpack@3 syntax
      compiler.plugin('emit', this.downloadAndAppendPlayer.bind(this));
    } else {
      // webpack@4 syntax
      compiler.hooks.emit.tapAsync('PlayerLoaderPlugin', this.downloadAndAppendPlayer.bind(this));
    }
  }

  downloadAndAppendPlayer(compilation, callback) {
    request.get(this.playerUrl).then((playerjs) => {
      let assets = Object.keys(compilation.assets);

      // normally we filter out all non .js outputs, and choose prepend to
      // only the first output
      if (typeof this.settings_.prependTo === 'undefined') {
        // filter out non js files
        assets = assets.filter((filename) => path.extname(filename) === '.js');

        // only prepend to the first one
        assets = [assets[0]];

      // if prependTo is specified though, we prepend to anything that is listed
      } else {
        assets = assets.filter((filename) => this.settings_.prependTo.indexOf(filename) !== -1);
      }

      if (!assets.length) {
        console.error('webpack-player-loader-plugin: did not find anything to prepend the player to!');
        console.error();
        process.exit(1);
      }

      assets.forEach(function(file) {
        compilation.assets[file] = new ConcatSource(playerjs, compilation.assets[file]);
      });
      callback();
    }).catch(function(err) {
      console.error('Failed to get a player at ' + this.playerUrl + ' double check your options');
      console.error(err);
      console.error();
      process.exit(1);
    });
  }
}

module.exports = PlayerLoaderPlugin;
