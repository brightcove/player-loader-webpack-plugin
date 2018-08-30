# player-loader-webpack-plugin
The official webpack plugin for the Brightcove Player.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [How it Works](#how-it-works)
  - [Limitations](#limitations)
  - [Auto Setup](#auto-setup)
  - [Manual Setup via `bc` Function](#manual-setup-via-bc-function)
  - [Setting a Source](#setting-a-source)
- [Putting it All Together](#putting-it-all-together)
- [Running the Demo Project](#running-the-demo-project)
- [Options](#options)
  - [`accountId`](#accountid)
  - [`embedId`](#embedid)
  - [`playerId`](#playerid)
- [More Resources](#more-resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation
To install, use:

```sh
npm install --save-dev @brightcove/player-loader-webpack-plugin
```

## Basic Usage
First, require the plugin at the top of your `webpack.config.js`:

```js
const PlayerLoader = require('@brightcove/player-loader-webpack-plugin');
```

Then create an instance of the `PlayerLoader` plugin in the `plugins` array:

> **Note:** `accountId` is a required parameter!

```js
plugins: [
  new PlayerLoader({accountId: '12345678910'})
]
```

For a full list of options, see the [Options section](#options) below.

## How it Works
This webpack plugin will prepend your Brightcove Player to your bundle. Doing this can reduce the number of requests needed by your website and ensure that the global `bc` function is available synchronously.

### Limitations
There are several limitations and caveats to using this plugin.

1. iframe embeds are not supported. This plugin is only suitable for use with in-page/advanced embeds.
1. If your player is updated or republished, the bundle will need to be re-generated before the bundled player is updated.

As an alternative, users who want an iframe embed or want to load their player script asynchronously can use the [@brightcove/player-loader](https://github.com/brightcove/player-loader) project instead, which downloads players at runtime rather than at build time. It does not have these limitations.

### Auto Setup
When your bundle executes, the Player will automatically set up any embed elements that match certain criteria:

1. Must be either a `<video>` or `<video-js>` element.
1. Must have a `data-player` attribute that is equivalent to the `playerId` of the bundled player.
1. Must have a `data-embed` attribute that is equivalent to the `embedId` of the bundled player.

For example, if this project is used with the following configuration:

```js
plugins: [
  new PlayerLoader({
    accountId: '12345678910',
    playerId: 'abc123xyz',
    embedId: 'default'
  })
]
```

The following embed elements will be _automatically initialized_ when the bundle executes:

```html
<video-js
  data-player="abc123xyz" 
  data-embed="default">
</video-js>

<video
  data-player="abc123xyz" 
  data-embed="default">
</video>
```

This behavior is implicit to the Brightcove Player, not this plugin.

### Manual Setup via `bc` Function
Any embeds that cannot be auto set up will need to be manually set up using the global `bc` function (or `window.bc`).

This function is created by all Brightcove Players. Its signature matches [the `videojs` function](https://docs.brightcove.com/brightcove-player/current-release/module-videojs.html#~videojs) - please refer to that documentation for a complete description.

At a minimum, the `bc` function takes an element or `id` attribute value. And, just like `videojs`, the `bc` function returns [a Video.js Player instance](https://docs.brightcove.com/brightcove-player/current-release/Player.html):

```js
const player = bc(document.querySelector('video-js'));
```

### Setting a Source
Most Video Cloud users configure sources either in the Studio application or [via programmatic methods](https://support.brightcove.com/assigning-video-player-programmatically). However, using the Video.js `src` method works as well:

```js
player.src({src: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'video/mp4'});
```

## Putting it All Together
This is a complete example for using this webpack plugin, which will bundle an imaginary Brightcove Player and set it up manually (as described above). It may also be beneficial to try the included demo project.

First, set up the `webpack.config.js` properly:

```js
const PlayerLoader = require('@brightcove/player-loader-webpack-plugin');

module.exports = {

  // Additional configuration for entry, output, etc.

  plugins: [
    new PlayerLoader({accountId: '12345678910'})
  ]
};
```

Second, in the JavaScript source (somewhere in the webpack entry point or in an imported path):

```js
// Because the player is prepended to the bundle, the global `bc` function
// will be available immediately.
//
// Note that if your bundle needs to be executed in a Node.js environment 
// instead of just the browser, we advise using the something like the
// `global` package on npm.
const bc = window.bc;

// Create a video-js element (or find one in the DOM).
const playerEl = document.createElement('video-js');

// Append it to the body.
document.body.appendChild(playerEl);

// Make that element into a Brightcove Player.
const player = bc(playerEl);

// At this point, the player is created. A source can be set or any other 
// integration can be written.
player.src({src: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'video/mp4'});
```

## Running the Demo Project
This project's Git repository comes with a working demo project.

1. Clone the repo: `git clone https://github.com/brightcove/player-loader-webpack-plugin`
1. Move into the directory: `cd player-loader-webpack-plugin`
1. Install dependencies: `npm i`
1. Set environment variables that will configure the demo. At a minimum, `BC_ACCOUNT_ID`: `export BC_ACCOUNT_ID="1234567890"` (`BC_PLAYER_ID` and `BC_EMBED_ID` are also supported).
1. Run the demo: `npm run demo`
1. If everything succeeds, wait for the web server to start then open `http://localhost:9999/` in the browser.

## Options
### `accountId`
* **REQUIRED**
* *Type:* `string` | `number`

A Video Cloud account ID.

### `embedId`
* *Type:* `string`
* *Default:* `'default'`

The Brightcove Player [embed ID](https://support.brightcove.com/guide-embed-apis) for the player. The default value is correct for most users.

### `playerId`
* *Type:* `string`
* *Default:* `'default'`

A Brightcove Player ID.

## More Resources
* [Brightcove Guides](https://support.brightcove.com/getting-started-brightcove-player)
* [API Docs](https://docs.brightcove.com/brightcove-player/current-release/index.html)
* [Video.js Guides](https://docs.videojs.com/tutorial-videojs_.html)
