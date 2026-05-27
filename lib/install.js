'use strict';
const fs = require('fs');
const path = require('path');
const { COMMANDS_DIR, PACKAGE_COMMANDS_DIR } = require('./paths');

function install() {
  if (!fs.existsSync(COMMANDS_DIR)) {
    fs.mkdirSync(COMMANDS_DIR, { recursive: true });
  }

  const files = fs.readdirSync(PACKAGE_COMMANDS_DIR).filter(f => f.endsWith('.md'));
  let installed = 0;

  for (const file of files) {
    const src = path.join(PACKAGE_COMMANDS_DIR, file);
    const dest = path.join(COMMANDS_DIR, file);
    fs.copyFileSync(src, dest);
    installed++;
  }

  console.log(`\n\x1b[32m✓ claude-multimodel installed\x1b[0m`);
  console.log(`  ${installed} slash commands → ~/.claude/commands/multimodel/`);
  console.log(`  Profiles → ~/.claude/multimodel/profiles.json`);
  console.log(`\n  Launch Claude with a profile:`);
  console.log(`  \x1b[36mclaude-mm\x1b[0m                   (interactive menu)`);
  console.log(`  \x1b[36mclaude-mm launch deepseek\x1b[0m   (direct)`);
  console.log(`  \x1b[36mclaude-mm set-key deepseek\x1b[0m  (store API key)`);
  console.log(`\n  Inside Claude: \x1b[36m/multimodel/switch-profile\x1b[0m\n`);
}

try {
  install();
} catch (err) {
  console.error('claude-multimodel install warning:', err.message);
}
