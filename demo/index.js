// the brightcove player of your choosing, defined in webpack.config.js
// will be prepended to your bundle. The bc function will be available in your
// entry point.
const player = bc(document.getElementById('vid1'));
console.log(player);
