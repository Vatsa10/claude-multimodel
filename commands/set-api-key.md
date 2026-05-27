Help the user set an API key for a model profile.

**Never ask the user to paste their API key into the chat.** Keys in conversation are a security risk.

Read `~/.claude/multimodel/profiles.json` to show which profiles need keys.

Show key status for each profile:
- Empty ANTHROPIC_BASE_URL → "native Anthropic — uses system ANTHROPIC_API_KEY, no action needed"
- ANTHROPIC_AUTH_TOKEN is set and not a placeholder → "✓ key configured"
- Otherwise → "✗ missing key"

Tell user to run (hidden input, safe):
```
claude-mm set-key
```
Or for a specific profile:
```
claude-mm set-key <profile-name>
```

If the user passed a profile name as argument (e.g. `/multimodel/set-api-key deepseek`), show the exact command for that profile.

Keys are stored in `~/.claude/multimodel/profiles.json` which is local-only.
