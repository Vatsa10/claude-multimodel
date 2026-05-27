#!/usr/bin/env node
'use strict';

const { spawnSync } = require('child_process');
const profiles = require('../lib/profiles');
const { ask, askHidden, pickFromList } = require('../lib/input');
const { PROFILES_PATH } = require('../lib/paths');

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const GRAY = '\x1b[90m';
const RED = '\x1b[31m';

function die(msg) { console.error(`${RED}Error: ${msg}${RESET}`); process.exit(1); }

function printProfile(name, profile, isActive) {
  const marker = isActive ? ` ${GREEN}(active)${RESET}` : '';
  const keyStatus = profiles.isNativeAnthropic(profile)
    ? `${GRAY}native Anthropic${RESET}`
    : profiles.hasKey(profile)
      ? `${GREEN}key set${RESET}`
      : `${YELLOW}no key${RESET}`;
  console.log(`  ${isActive ? GREEN : RESET}${name}${RESET}${marker}`);
  console.log(`    ${GRAY}${profile.description}${RESET}`);
  console.log(`    model: ${profile.env.ANTHROPIC_MODEL}  subagent: ${profile.env.CLAUDE_CODE_SUBAGENT_MODEL}  ${keyStatus}`);
}

async function cmdLaunch(profileName, extraArgs) {
  const config = profiles.load();
  const names = Object.keys(config.profiles);

  if (!profileName) {
    profileName = await pickFromList(
      'Select model profile:',
      names,
      name => {
        const p = config.profiles[name];
        return `${name} — ${p.description}`;
      },
      config.active
    );
  }

  if (!config.profiles[profileName]) die(`Unknown profile '${profileName}'. Run: claude-mm list`);

  const profile = config.profiles[profileName];

  // Check key needed
  if (!profiles.isNativeAnthropic(profile) && !profiles.hasKey(profile)) {
    console.log(`\n${YELLOW}Warning: Profile '${profileName}' has no API key.${RESET}`);
    const ans = await ask('Set key now? (y/N): ');
    if (ans.toLowerCase() === 'y') {
      await setKey(profileName);
    }
  }

  // Reload after possible key set
  const fresh = profiles.get(profileName);
  const env = { ...process.env };

  for (const [key, val] of Object.entries(fresh.env)) {
    if (val && val.trim() !== '') {
      env[key] = val;
    } else {
      delete env[key];
    }
  }

  profiles.setActive(profileName);

  console.log(`\n${CYAN}Profile:${RESET} ${GREEN}${profileName}${RESET} — ${fresh.description}`);
  console.log(`${GRAY}Model: ${fresh.env.ANTHROPIC_MODEL}  Effort: ${fresh.env.CLAUDE_CODE_EFFORT_LEVEL}${RESET}\n`);

  const result = spawnSync('claude', extraArgs || [], {
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  process.exit(result.status ?? 0);
}

function cmdList() {
  const config = profiles.load();
  console.log(`\n${CYAN}Profiles${RESET} ${GRAY}(${PROFILES_PATH})${RESET}\n`);
  for (const [name, profile] of Object.entries(config.profiles)) {
    printProfile(name, profile, name === config.active);
    console.log('');
  }
}

async function setKey(profileName) {
  const config = profiles.load();
  const names = Object.keys(config.profiles);

  if (!profileName) {
    profileName = await pickFromList(
      'Select profile to set API key:',
      names,
      name => {
        const p = config.profiles[name];
        const status = profiles.isNativeAnthropic(p)
          ? 'native'
          : profiles.hasKey(p) ? 'key set' : 'no key';
        return `${name} [${status}] — ${p.description}`;
      },
      config.active
    );
  }

  if (!config.profiles[profileName]) die(`Unknown profile '${profileName}'`);

  const profile = config.profiles[profileName];

  if (profiles.isNativeAnthropic(profile)) {
    console.log(`\n${YELLOW}Note: '${profileName}' uses native Anthropic — reads ANTHROPIC_API_KEY from system env.${RESET}`);
    const ans = await ask('Set ANTHROPIC_AUTH_TOKEN override anyway? (y/N): ');
    if (ans.toLowerCase() !== 'y') return;
  }

  const key = await askHidden(`\nAPI key for '${profileName}' (hidden): `);
  if (!key || key.trim() === '') die('Empty key. Aborted.');

  profiles.setApiKey(profileName, key.trim());
  console.log(`${GREEN}✓ Key saved for '${profileName}'${RESET}`);
}

async function cmdAdd() {
  console.log(`\n${CYAN}Add new profile${RESET}\n`);

  const providerRegistry = profiles.loadProviders();
  const providerKeys = Object.keys(providerRegistry);

  // Step 1: pick known provider or manual
  console.log('Select provider:');
  providerKeys.forEach((key, i) => {
    const p = providerRegistry[key];
    const compat = p.requiresLiteLLM
      ? `${YELLOW}[needs LiteLLM]${RESET}`
      : p.compatibility === 'native' ? `${GRAY}[native]${RESET}` : `${GREEN}[compatible]${RESET}`;
    console.log(`  [${i + 1}] ${p.name} ${compat}`);
    if (p.note) console.log(`        ${GRAY}${p.note}${RESET}`);
  });
  console.log('');

  const providerAnswer = await ask('Enter number or provider key (or "manual" to skip): ');
  let selectedProvider = null;

  if (providerAnswer.toLowerCase() !== 'manual') {
    if (/^\d+$/.test(providerAnswer)) {
      const idx = parseInt(providerAnswer, 10) - 1;
      const key = providerKeys[idx];
      selectedProvider = key ? providerRegistry[key] : null;
    } else {
      selectedProvider = providerRegistry[providerAnswer.toLowerCase()] || null;
    }
  }

  // LiteLLM warning
  if (selectedProvider?.requiresLiteLLM) {
    console.log(`\n${YELLOW}⚠  ${selectedProvider.name} uses OpenAI-compatible API only.${RESET}`);
    console.log(`   Claude Code needs Anthropic-compatible API.`);
    console.log(`   Requires LiteLLM proxy running locally:\n`);
    console.log(`   ${CYAN}pip install litellm${RESET}`);
    console.log(`   ${CYAN}litellm --model ${selectedProvider.litellmModel} --api_key YOUR_KEY --port 4000${RESET}\n`);
    console.log(`   Base URL will be: ${GRAY}http://localhost:4000${RESET}`);
    console.log(`   Set ${selectedProvider.litellmEnvKey} in your env before running LiteLLM.\n`);
    const cont = await ask('Continue anyway? (y/N): ');
    if (cont.toLowerCase() !== 'y') return;
  }

  // Step 2: profile name
  const defaultName = selectedProvider
    ? providerKeys.find(k => providerRegistry[k] === selectedProvider) || ''
    : '';
  const nameInput = await ask(`Profile name (slug)${defaultName ? ` [${defaultName}]` : ''}: `);
  const name = nameInput.trim() || defaultName;
  if (!name || /\s/.test(name)) die('Invalid name — no spaces allowed');

  // Step 3: description
  const defaultDesc = selectedProvider?.name || name;
  const descInput = await ask(`Description [${defaultDesc}]: `);
  const description = descInput.trim() || defaultDesc;

  // Step 4: base URL
  const defaultUrl = selectedProvider?.baseUrl || '';
  const urlInput = await ask(`Base URL${defaultUrl ? ` [${defaultUrl}]` : ' (empty = native Anthropic)'}: `);
  const baseUrl = urlInput.trim() || defaultUrl;

  // Step 5: models
  const defaultFlagship = selectedProvider?.models?.flagship || '';
  const defaultFast = selectedProvider?.models?.fast || '';

  console.log(`\n${CYAN}Model IDs${RESET} ${GRAY}(check provider docs for exact names)${RESET}`);
  if (selectedProvider?.docsUrl) console.log(`  Docs: ${selectedProvider.docsUrl}\n`);

  const modelInput = await ask(`Main model ID${defaultFlagship ? ` [${defaultFlagship}]` : ''}: `);
  const model = modelInput.trim() || defaultFlagship;
  if (!model) die('Model ID required');

  const subagentInput = await ask(`Subagent model ID (fast/cheap)${defaultFast ? ` [${defaultFast}]` : ''}: `);
  const subagent = subagentInput.trim() || defaultFast || model;

  // Step 6: effort
  const effortInput = await ask('Effort level [low/medium/high/max] (default: max): ');
  const effort = effortInput.trim() || 'max';

  const profile = {
    description,
    env: {
      ANTHROPIC_BASE_URL: baseUrl,
      ANTHROPIC_AUTH_TOKEN: '',
      ANTHROPIC_MODEL: model,
      ANTHROPIC_DEFAULT_OPUS_MODEL: model,
      ANTHROPIC_DEFAULT_SONNET_MODEL: model,
      ANTHROPIC_DEFAULT_HAIKU_MODEL: subagent,
      CLAUDE_CODE_SUBAGENT_MODEL: subagent,
      CLAUDE_CODE_EFFORT_LEVEL: effort,
    }
  };

  try {
    profiles.add(name, profile);
    console.log(`\n${GREEN}✓ Profile '${name}' added.${RESET}`);

    const needsKey = baseUrl && !selectedProvider?.requiresLiteLLM;
    if (needsKey) {
      const setNow = await ask('Set API key now? (y/N): ');
      if (setNow.toLowerCase() === 'y') await setKey(name);
    }

    if (selectedProvider?.requiresLiteLLM) {
      console.log(`\n${YELLOW}Remember: start LiteLLM proxy before launching:${RESET}`);
      console.log(`  ${CYAN}litellm --model ${selectedProvider.litellmModel} --api_key $${selectedProvider.litellmEnvKey} --port 4000${RESET}`);
    }

    console.log(`\nLaunch: ${CYAN}claude-mm launch ${name}${RESET}\n`);
  } catch (err) {
    die(err.message);
  }
}

async function cmdSetDefault(profileName) {
  const config = profiles.load();
  const names = Object.keys(config.profiles);

  if (!profileName) {
    profileName = await pickFromList(
      'Select profile to set as permanent default:',
      names,
      name => `${name} — ${config.profiles[name].description}`,
      config.active
    );
  }

  if (!config.profiles[profileName]) die(`Unknown profile '${profileName}'`);

  const profile = config.profiles[profileName];

  // 1. Update active in profiles.json
  profiles.setActive(profileName);

  // 2. Write env vars to shell profiles
  const envLines = [];
  for (const [key, val] of Object.entries(profile.env)) {
    if (val && val.trim() !== '') {
      envLines.push({ key, val });
    } else {
      envLines.push({ key, val: null }); // to remove
    }
  }

  const isWin = process.platform === 'win32';
  const shellProfilePaths = isWin
    ? [require('path').join(require('os').homedir(), 'Documents', 'PowerShell', 'Microsoft.PowerShell_profile.ps1')]
    : [
        require('path').join(require('os').homedir(), '.bashrc'),
        require('path').join(require('os').homedir(), '.zshrc'),
      ];

  const marker = '# claude-multimodel managed block';
  const endMarker = '# end claude-multimodel';

  const fs = require('fs');

  for (const shellProfile of shellProfilePaths) {
    try {
      let content = fs.existsSync(shellProfile) ? fs.readFileSync(shellProfile, 'utf8') : '';

      // Remove old block
      const start = content.indexOf(marker);
      const end = content.indexOf(endMarker);
      if (start !== -1 && end !== -1) {
        content = content.slice(0, start).trimEnd() + '\n' + content.slice(end + endMarker.length).trimStart();
      }

      // Build new block
      let block = `\n${marker} — profile: ${profileName}\n`;
      if (isWin) {
        for (const { key, val } of envLines) {
          if (val) block += `$env:${key} = "${val}"\n`;
          else block += `Remove-Item Env:${key} -ErrorAction SilentlyContinue\n`;
        }
      } else {
        for (const { key, val } of envLines) {
          if (val) block += `export ${key}="${val}"\n`;
          else block += `unset ${key}\n`;
        }
      }
      block += `${endMarker}\n`;

      fs.writeFileSync(shellProfile, content + block);
      console.log(`${GREEN}✓${RESET} Written to ${shellProfile}`);
    } catch (e) {
      console.log(`${YELLOW}⚠${RESET}  Could not write to ${shellProfile}: ${e.message}`);
    }
  }

  console.log(`\n${GREEN}✓ Default profile set to '${profileName}'${RESET}`);
  console.log(`${GRAY}Restart terminal or reload shell profile to apply.${RESET}`);
  console.log(`Then plain ${CYAN}claude${RESET} command uses ${profileName} automatically.\n`);
}

function cmdUnsetDefault() {
  const fs = require('fs');
  const isWin = process.platform === 'win32';
  const shellProfilePaths = isWin
    ? [require('path').join(require('os').homedir(), 'Documents', 'PowerShell', 'Microsoft.PowerShell_profile.ps1')]
    : [
        require('path').join(require('os').homedir(), '.bashrc'),
        require('path').join(require('os').homedir(), '.zshrc'),
      ];

  const marker = '# claude-multimodel managed block';
  const endMarker = '# end claude-multimodel';

  for (const shellProfile of shellProfilePaths) {
    if (!fs.existsSync(shellProfile)) continue;
    let content = fs.readFileSync(shellProfile, 'utf8');
    const start = content.indexOf(marker);
    const end = content.indexOf(endMarker);
    if (start !== -1 && end !== -1) {
      content = content.slice(0, start).trimEnd() + '\n' + content.slice(end + endMarker.length).trimStart();
      fs.writeFileSync(shellProfile, content);
      console.log(`${GREEN}✓${RESET} Removed from ${shellProfile}`);
    }
  }
  console.log(`\n${GREEN}✓ Permanent default cleared.${RESET}`);
  console.log(`${GRAY}Restart terminal. Plain claude uses system defaults again.${RESET}\n`);
}

function cmdProviders() {
  const registry = profiles.loadProviders();
  console.log(`\n${CYAN}Known providers${RESET}\n`);
  for (const [key, p] of Object.entries(registry)) {
    const compat = p.requiresLiteLLM
      ? `${YELLOW}needs LiteLLM proxy${RESET}`
      : p.compatibility === 'native' ? `${GRAY}native Anthropic${RESET}` : `${GREEN}Anthropic-compatible${RESET}`;
    console.log(`  ${CYAN}${key}${RESET} — ${p.name} (${compat})`);
    console.log(`    Models: ${p.models.flagship} / ${p.models.fast}`);
    if (p.baseUrl) console.log(`    URL: ${GRAY}${p.baseUrl}${RESET}`);
    if (p.docsUrl) console.log(`    Docs: ${GRAY}${p.docsUrl}${RESET}`);
    console.log('');
  }
  console.log(`Add profile from provider: ${CYAN}claude-mm add${RESET}\n`);
}

function cmdRemove(name) {
  if (!name) die('Usage: claude-mm remove <profile-name>');
  try {
    profiles.remove(name);
    console.log(`${GREEN}✓ Profile '${name}' removed.${RESET}`);
  } catch (err) {
    die(err.message);
  }
}

function cmdActive() {
  const config = profiles.load();
  const profile = config.profiles[config.active];
  console.log(`\n${CYAN}Active profile:${RESET} ${GREEN}${config.active}${RESET}`);
  console.log(`  ${profile.description}`);
  console.log(`  Model: ${profile.env.ANTHROPIC_MODEL}`);
  console.log(`  Subagent: ${profile.env.CLAUDE_CODE_SUBAGENT_MODEL}`);
  console.log(`  Effort: ${profile.env.CLAUDE_CODE_EFFORT_LEVEL}\n`);
}

function printHelp() {
  console.log(`
${CYAN}claude-mm${RESET} — Multi-model profile switcher for Claude Code

${CYAN}Usage:${RESET}
  claude-mm                        Interactive profile menu + launch
  claude-mm launch [profile]       Launch Claude with profile
  claude-mm list                   List all profiles
  claude-mm active                 Show current active profile
  claude-mm set-key [profile]      Set API key for profile (hidden input)
  claude-mm add                    Add new profile interactively
  claude-mm remove <profile>       Remove a profile
  claude-mm set-default [profile]  Write env vars to shell profile (permanent)
  claude-mm unset-default          Remove permanent env vars from shell profile
  claude-mm providers              List all known providers + compatibility
  claude-mm help                   Show this help

${CYAN}Inside Claude:${RESET}
  /multimodel/switch-profile       Show profiles, get relaunch command
  /multimodel/set-api-key          Key management instructions
  /multimodel/add-profile          Guided profile wizard

${CYAN}Profiles stored at:${RESET}
  ${PROFILES_PATH}
`);
}

async function main() {
  const [,, cmd, ...args] = process.argv;

  switch (cmd) {
    case undefined:
    case 'launch':
      await cmdLaunch(args[0], args.slice(1));
      break;
    case 'list':
    case 'ls':
      cmdList();
      break;
    case 'active':
      cmdActive();
      break;
    case 'set-key':
    case 'setkey':
      await setKey(args[0]);
      break;
    case 'add':
      await cmdAdd();
      break;
    case 'remove':
    case 'rm':
    case 'delete':
      cmdRemove(args[0]);
      break;
    case 'providers':
    case 'provider-list':
      cmdProviders();
      break;
    case 'set-default':
    case 'default':
    case 'pin':
      await cmdSetDefault(args[0]);
      break;
    case 'unset-default':
    case 'unpin':
    case 'reset-default':
      cmdUnsetDefault();
      break;
    case 'help':
    case '--help':
    case '-h':
      printHelp();
      break;
    default:
      // Treat unknown arg as profile name → launch
      await cmdLaunch(cmd, args);
  }
}

main().catch(err => { console.error(RED + err.message + RESET); process.exit(1); });
