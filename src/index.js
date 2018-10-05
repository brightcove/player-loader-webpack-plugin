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

    /* if prependTo was passed in, and was a string make it an array */
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
    compiler.hooks.emit.tapAsync('PlayerLoaderPlugin', (compilation, callback) => {
      request.get(this.playerUrl).then((playerjs) => {
        // normally we filter out all non .js outputs
        let filterFn = (filename) => path.extname(filename) !== '.js';

        // if prependTo is specified though, we just filter out anything not listed
        if (typeof this.settings_.prependTo !== 'undefined') {
          filterFn = (filename) => this.settings_.prependTo.indexOf(filename) !== -1;
        }

        const assets = Object.keys(compilation.assets).filter(filterFn);

        if (assets.length) {
          console.error('webpack-player-loader-plugin: did not find anything to prepend the player to!');
          console.error();
          process.exit(1);
        }

        Object.keys(assets).forEach(function(file) {
          compilation.assets[file] = new ConcatSource(playerjs, compilation.assets[file]);
        });
        callback();
      }).catch(function(err) {
        console.error('Failed to get a player at ' + this.playerUrl + ' double check your options');
        console.error(err);
        console.error();
        process.exit(1);
      });
    });
  }
}

module.exports = PlayerLoaderPlugin;
