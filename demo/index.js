import window from 'global/window';
import document from 'global/document';

// the brightcove player of your choosing, defined in webpack.config.js
// will be prepended to your bundle. The bc function will be available in your
// entry point.
const player = window.bc(document.getElementById('vid1'));

/* eslint-disable no-console */
console.log(player);
