# player-loader-webpack-plugin

## Installation
To install just use

```sh
npm i -D @brightcove/player-loader-webpack-plugin
```


## Using the plugin

First require the plugin at the top of your `webpack.config.js`:

```js
const PlayerLoader = require('@brightcove/player-loader-webpack-plugin');
```

Then create an instance of the `PlayerLoader` plugin in the `plugins` array of your `webpack.config.js`:

> Note: That `accountId` is a required option!

```js
  plugins: [
    new PlayerLoader({accountId: '12345678910'})
  ],
```

For more information on options see the options section of the README.

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

## How does it work
This plugin prepends a brightcove player to the front of your bundle. This will export a `bc` function on the `global` object, usually `window` in the browser. It will also look auto-setup player on the page if they meet certain critrea.

### auto-setup

Any `video` and `video-js` elements on the page and they will be intialized if:

1. They have a `data-player` attribute that is equivelent to the `playerId` of the player you downloaded.
2. They have a `data-embed` attribute that has an equivelent value to the `embedId` of the player you downloaded.

an example for a player whose `playerId` is `1`, and `embedId` is `2`:

`<video-js data-player=1 data-embed=2></video-js>`
`<video data-player=1 data-embed=2></video>`

### The bc function
The API for the `bc` function follows:

`var player = bc(elemOrId, options, readyCallback)`

#### Arguments
##### `elemOrId`
**REQUIRED**

*Type:* `string` | `Element`

A video element or the id of a video element. For more information on attributes that the video element can have see: https://support.brightcove.com/choosing-correct-embed-code

##### `options`
**OPTIONAL**
*Type:* `Object`

Options to set when creating the player. See the [videojs](https://docs.videojs.com/tutorial-options.html) options guide for specifics.

##### `readyCallback`
**OPTIONAL**
*Type:* `Function`

A function that should be called when the player that is about to be created is [`ready`](https://docs.videojs.com/tutorial-setup.html#player-readiness).

#### The return value
The return value is an instance of a `videojs` [`Player`](https://docs.videojs.com/Player.html) with lots of functionality added on for brightcove customers. This will include customizations made in the studio.

### Setting a source
If the player you bundled is configured in studio, or the video element you intialized had a source then the player should be ready to go. If your player does not have a source you can add one using `player.src({src: 'some-url.mp4', type: 'video/mp4'})`.

### Putting it all (Example)
1. Setup the plugin with webpack for the player that you want.
2. Make sure there are no video elements that will auto-setup on the html page you are going to test with, unless you want that. See the auto-setup section for more info on that.
3. Setup the player in your webpack entry point (or anywhere really)

```js
import window from 'global/window';
import document from 'global/document';

// get the bc function which will be on window at this point
const bc = window.bc;

// create a video element
const videoElement = document.createElement('video');

// add it to the body of the page
document.body.appendChild(videoElement);

// make that video element into brightcove player
const player = bc(videoElement);

// set the source for that video
// or do basically anything you want here

player.src({src: 'some-url.mp4', type: 'video/mp4'});

```


## More Resources
* [Brightcove Guides](https://support.brightcove.com/getting-started-brightcove-player)
* [API docs](https://docs.brightcove.com/brightcove-player/current-release/index.html)
* [Video.js Guides](https://docs.videojs.com/tutorial-videojs_.html)

## Running the demo
To run the demo, do the following
1. Clone the repo: `git clone https://github.com/brightcove/player-loader-webpack-plugin`
2. Move into the directory: `cd player-loader-webpack-plugin`
3. Install dependencies: `npm i`
4. Run the demo: `npm run demo -- ACCOUNT_ID` where `ACCOUNT_ID` is a valid account id: `123456789`
5. If everything succeeds, wait for the web server to start then
6. Open `http://localhost:9999` in the browser to view the demo

