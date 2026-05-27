Read `~/.claude/multimodel/profiles.json` (expand ~ to the user's home directory).

Show:
1. **Active profile** — name, description, model, subagent model, effort level
2. **All profiles** as a table: Name | Description | Model | Subagent | Key status

Key status rules:
- Native Anthropic (ANTHROPIC_BASE_URL is empty) → "native auth"
- ANTHROPIC_AUTH_TOKEN is set and not empty/placeholder → "✓ key set"
- Otherwise → "✗ no key"

3. To switch profiles, user must relaunch. Show exact command:
```
claude-mm launch <profile-name>
```
Or interactive:
```
claude-mm
```

If the user passed a profile name as argument (e.g. `/multimodel/switch-profile deepseek`), highlight that profile and show the exact launch command for it.

Keep response concise.
