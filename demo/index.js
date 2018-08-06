import window from 'global/window';
import document from 'global/document';

// The Brightcove Player of your choosing, defined in webpack.config.js,
// will be prepended to your bundle. The bc function will be available in
// your entry point.
const player = window.bc(document.querySelector('video'));

// Expose the player globally, so we can easily interact with it in the
// browser console. It is not recommended that you do this in production!
window.player = player;

// Set a poster image and an MP4 source, for demo purposes.
player.poster('http://vjs.zencdn.net/v/oceans.png');
player.src({src: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'video/mp4'});
