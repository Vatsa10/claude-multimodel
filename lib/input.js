'use strict';
const readline = require('readline');

function ask(question) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, answer => { rl.close(); resolve(answer.trim()); });
  });
}

function askHidden(question) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: null });
    process.stdout.write(question);

    const isWin = process.platform === 'win32';
    let input = '';

    if (isWin) {
      // Windows: readline doesn't support raw mode easily, use stdin directly
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding('utf8');

      const onData = (char) => {
        if (char === '\r' || char === '\n') {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdin.removeListener('data', onData);
          process.stdout.write('\n');
          rl.close();
          resolve(input);
        } else if (char === '') {
          process.stdin.setRawMode(false);
          process.stdout.write('\n');
          process.exit();
        } else if (char === '' || char === '\b') {
          input = input.slice(0, -1);
        } else {
          input += char;
        }
      };
      process.stdin.on('data', onData);
    } else {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding('utf8');

      const onData = (char) => {
        if (char === '\n' || char === '\r') {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdin.removeListener('data', onData);
          process.stdout.write('\n');
          rl.close();
          resolve(input);
        } else if (char === '') {
          process.stdin.setRawMode(false);
          process.stdout.write('\n');
          process.exit();
        } else if (char === '') {
          input = input.slice(0, -1);
        } else {
          input += char;
        }
      };
      process.stdin.on('data', onData);
    }
  });
}

async function pickFromList(prompt, items, labelFn, activeName) {
  console.log(`\n${prompt}`);
  items.forEach((item, i) => {
    const label = labelFn(item);
    const isActive = item === activeName;
    const marker = isActive ? ' (active)' : '';
    const color = isActive ? '\x1b[32m' : '\x1b[37m';
    console.log(`  ${color}[${i + 1}] ${label}${marker}\x1b[0m`);
  });
  console.log('');

  const answer = await ask('Enter number or name: ');
  if (/^\d+$/.test(answer)) {
    const idx = parseInt(answer, 10) - 1;
    return items[idx] || null;
  }
  return items.find(i => i === answer) || answer;
}

module.exports = { ask, askHidden, pickFromList };
