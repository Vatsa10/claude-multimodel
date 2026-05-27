'use strict';
const os = require('os');
const path = require('path');

const BASE_DIR = path.join(os.homedir(), '.claude', 'multimodel');
const PROFILES_PATH = path.join(BASE_DIR, 'profiles.json');
const COMMANDS_DIR = path.join(os.homedir(), '.claude', 'commands', 'multimodel');
const PACKAGE_COMMANDS_DIR = path.join(__dirname, '..', 'commands');
const DEFAULT_PROFILES_PATH = path.join(__dirname, '..', 'defaults', 'profiles.json');

module.exports = { BASE_DIR, PROFILES_PATH, COMMANDS_DIR, PACKAGE_COMMANDS_DIR, DEFAULT_PROFILES_PATH };
