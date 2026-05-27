'use strict';
const fs = require('fs');
const path = require('path');
const { BASE_DIR, PROFILES_PATH, DEFAULT_PROFILES_PATH } = require('./paths');

const PROVIDERS_PATH = path.join(__dirname, '..', 'defaults', 'providers.json');

function loadProviders() {
  return JSON.parse(fs.readFileSync(PROVIDERS_PATH, 'utf8')).providers;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function load() {
  ensureDir(BASE_DIR);
  if (!fs.existsSync(PROFILES_PATH)) {
    const defaults = JSON.parse(fs.readFileSync(DEFAULT_PROFILES_PATH, 'utf8'));
    fs.writeFileSync(PROFILES_PATH, JSON.stringify(defaults, null, 2));
    return defaults;
  }
  return JSON.parse(fs.readFileSync(PROFILES_PATH, 'utf8'));
}

function save(config) {
  ensureDir(BASE_DIR);
  fs.writeFileSync(PROFILES_PATH, JSON.stringify(config, null, 2));
}

function list() {
  return load();
}

function get(name) {
  const config = load();
  return config.profiles[name] || null;
}

function setActive(name) {
  const config = load();
  if (!config.profiles[name]) throw new Error(`Profile '${name}' not found`);
  config.active = name;
  save(config);
}

function setApiKey(profileName, key) {
  const config = load();
  if (!config.profiles[profileName]) throw new Error(`Profile '${profileName}' not found`);
  config.profiles[profileName].env.ANTHROPIC_AUTH_TOKEN = key;
  save(config);
}

function add(name, profile) {
  const config = load();
  if (config.profiles[name]) throw new Error(`Profile '${name}' already exists`);
  config.profiles[name] = profile;
  save(config);
}

function remove(name) {
  const config = load();
  if (!config.profiles[name]) throw new Error(`Profile '${name}' not found`);
  if (config.active === name) throw new Error(`Cannot remove active profile. Switch first.`);
  delete config.profiles[name];
  save(config);
}

function hasKey(profile) {
  const key = profile.env.ANTHROPIC_AUTH_TOKEN;
  return key && key.trim() !== '' && !key.startsWith('YOUR_');
}

function isNativeAnthropic(profile) {
  const url = profile.env.ANTHROPIC_BASE_URL;
  return !url || url.trim() === '';
}

module.exports = { load, save, list, get, setActive, setApiKey, add, remove, hasKey, isNativeAnthropic, loadProviders };
