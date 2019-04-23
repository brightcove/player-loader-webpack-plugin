/* eslint-disable no-console */
const spawnSync = require('child_process').spawnSync;
const spawnOptions = {};
const path = require('path');
const fs = require('fs');

let debug = false;

for (let i = 0; i < process.argv.length; i++) {
  if ((/-d|--debug/).test(process.argv[i])) {
    debug = true;
    break;
  }
}

if (debug) {
  spawnOptions.stdio = 'inherit';
}

const commands = [
  ['npm', 'i', '--no-save', 'webpack@4'],
  ['npm', 'run', 'demo'],
  ['npm', 'run', 'clean'],
  ['npm', 'i', '--no-save', 'webpack@3'],
  ['npm', 'run', 'demo'],
  ['npm', 'run', 'clean']
];

let exitCode = 0;

for (let i = 0; i < commands.length; i++) {
  const args = commands[i];
  const cmd = args.shift();
  const command = `${path.basename(cmd)} ${args.join(' ')}`;

  const options = Object.assign({}, spawnOptions);

  console.log(`** Running '${command}' **`);
  const retval = spawnSync(cmd, args, options);

  if (retval.status !== 0) {
    const output = retval.output
      .filter((s) => !!s)
      .map((s) => s.toString())
      .join('');

    console.error(output);
    exitCode = 1;
  }

  if (command === 'npm run demo') {
    const stat = fs.statSync(path.join(__dirname, 'demo', 'dist.js'));

    if (stat.size < 10000) {
      console.error('npm run demo failed, demo/dist.js is below 10k bytes');
      exitCode = 1;
    }
  }

  if (exitCode !== 0) {
    break;
  }
}

console.log("** Running 'npm ci' to reset local deps");
const retval = spawnSync('npm', ['ci'], spawnOptions);

if (retval.status !== 0) {
  console.error('Failed to reset npm deps');
  exitCode = 1;
}

process.exit(exitCode);
