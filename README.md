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

> Note: That accountId is a required options!

```js
  plugins: [
    new PlayerLoader({accountId: '12345678910'})
  ],
```

For more information on options see the options section of the README.

## Running the demo
To run the demo, do the following
1. Clone the repo: `git clone https://github.com/brightcove/player-loader-webpack-plugin`
2. Move into the directory: `cd player-loader-webpack-plugin`
3. Install dependencies: `npm i`
4. Run the demo: `npm run demo -- ACCOUNT_ID` where `ACCOUNT_ID` is a valid account id: `123456789`
5. If everything succeeds, wait for the web server to start then
6. Open `http://localhost:9999` in the browser to view the demo

## Available Options

### `accountId`\*
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
