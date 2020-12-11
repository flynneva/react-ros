#!/usr/bin/env node
'use strict';

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const spawn = require('child_process').spawnSync;

async function version(versionType) {
    console.log('increment version');
    const { stdout, stderr } = await exec(`npm version ${versionType} --no-git-tag-version`);
    console.log(stdout);
    if (stderr) throw stderr;
    return stdout;
}

async function branch() {
  const { stdout, stderr } = await exec(`git rev-parse --abbrev-ref HEAD`);
  if (stderr) throw stderr;
  return stdout;
}

const run = async () => {
  try {
    const versionType = process.argv[2];
    const gitMessage = process.argv[3];

    if (versionType !== 'patch' && versionType !== 'minor' && versionType !== 'major') throw new Error('You need to specify npm version! [patch|minor|major]');
    if (!gitMessage) throw new Error('You need to provide a git commit message!');

    console.log('running git cmds');
    var npmVersion = version(versionType);
    console.log('running git add');
    await spawn('git', ['add', 'package.json', 'package-lock.json'], { stdio: 'inherit' });
    await spawn('git', ['commit', '-m', gitMessage.trim()], { stdio: 'inherit' });
    console.log('running git commit');
    await spawn('git', ['tag', npmVersion], { stdio: 'inherit' });
    await spawn('git', ['status'], { stdio: 'inherit' });
    const currentBranch = await branch();
    await spawn('git', ['push', 'origin', currentBranch.trim()], { stdio: 'inherit' });

  } catch (err) {
    console.log('Something went wrong:');
    console.error(err.message);
    console.error('\nPlease use this format: \nnpm run bump [patch|minor|major] "Commit message"');
  }
};

run();
