'use strict';
const fs = require('fs');
const path = require('path');
const { BASE_DIR, PROFILES_PATH, COMMANDS_DIR, PACKAGE_COMMANDS_DIR, DEFAULT_PROFILES_PATH } = require('./paths');

const PLACEHOLDER_TOKENS = new Set(['', 'sk-litellm', 'YOUR_API_KEY', 'YOUR_KEY_HERE']);

function hasRealKey(profile) {
  const token = profile.env?.ANTHROPIC_AUTH_TOKEN || '';
  return token.trim() !== '' && !PLACEHOLDER_TOKENS.has(token.trim());
}

function isNativeAnthropic(profile) {
  return !profile.env?.ANTHROPIC_BASE_URL || profile.env.ANTHROPIC_BASE_URL.trim() === '';
}

function mergeProfiles(existing, defaults) {
  const defaultProfiles = defaults.profiles;
  const userProfiles = existing.profiles;
  const merged = { ...userProfiles };
  let added = 0;
  let updated = 0;

  for (const [name, defaultProfile] of Object.entries(defaultProfiles)) {
    if (!merged[name]) {
      // New profile in defaults — add it
      merged[name] = defaultProfile;
      added++;
      continue;
    }

    const userProfile = merged[name];

    // User has a real key saved — preserve their profile entirely, only update non-URL env vars
    if (hasRealKey(userProfile) && !isNativeAnthropic(userProfile)) {
      // Update base URL and model fields but keep their auth token
      const savedToken = userProfile.env.ANTHROPIC_AUTH_TOKEN;
      merged[name] = {
        ...defaultProfile,
        env: {
          ...defaultProfile.env,
          ANTHROPIC_AUTH_TOKEN: savedToken,
        }
      };
      updated++;
      continue;
    }

    // No real key — safe to fully replace with default (fixes stale URLs, models)
    merged[name] = defaultProfile;
    updated++;
  }

  return { profiles: merged, added, updated };
}

function installProfiles() {
  const defaults = JSON.parse(fs.readFileSync(DEFAULT_PROFILES_PATH, 'utf8'));

  if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR, { recursive: true });
  }

  if (!fs.existsSync(PROFILES_PATH)) {
    // First install — copy defaults as-is
    fs.writeFileSync(PROFILES_PATH, JSON.stringify(defaults, null, 2));
    return { added: Object.keys(defaults.profiles).length, updated: 0, fresh: true };
  }

  // Existing file — smart merge
  let existing;
  try {
    existing = JSON.parse(fs.readFileSync(PROFILES_PATH, 'utf8'));
  } catch {
    // Corrupt file — replace with defaults
    fs.writeFileSync(PROFILES_PATH, JSON.stringify(defaults, null, 2));
    return { added: Object.keys(defaults.profiles).length, updated: 0, fresh: true };
  }

  const { profiles: mergedProfiles, added, updated } = mergeProfiles(existing, defaults);

  const result = {
    active: existing.active || defaults.active,
    profiles: mergedProfiles,
  };

  fs.writeFileSync(PROFILES_PATH, JSON.stringify(result, null, 2));
  return { added, updated, fresh: false };
}

function installCommands() {
  if (!fs.existsSync(COMMANDS_DIR)) {
    fs.mkdirSync(COMMANDS_DIR, { recursive: true });
  }

  const files = fs.readdirSync(PACKAGE_COMMANDS_DIR).filter(f => f.endsWith('.md'));
  for (const file of files) {
    fs.copyFileSync(path.join(PACKAGE_COMMANDS_DIR, file), path.join(COMMANDS_DIR, file));
  }
  return files.length;
}

function install() {
  const commandCount = installCommands();
  const { added, updated, fresh } = installProfiles();

  console.log(`\n\x1b[32m✓ claude-multimodel installed\x1b[0m`);
  console.log(`  ${commandCount} slash commands → ~/.claude/commands/multimodel/`);

  if (fresh) {
    console.log(`  Profiles created → ~/.claude/multimodel/profiles.json`);
  } else {
    console.log(`  Profiles merged → ${added} added, ${updated} updated (keys preserved)`);
  }

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
