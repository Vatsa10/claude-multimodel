Help the user add a new model profile.

Tell the user to run the interactive wizard:
```
claude-mm add
```

The wizard will ask for:
- Profile name (slug)
- Description
- Base URL (provider endpoint, empty for native Anthropic)
- Main model ID
- Subagent model ID
- Effort level

Alternatively, if the user wants to add manually, read `~/.claude/multimodel/profiles.json` and show the exact JSON structure to add:

```json
"profile-name": {
  "description": "...",
  "env": {
    "ANTHROPIC_BASE_URL": "https://...",
    "ANTHROPIC_AUTH_TOKEN": "",
    "ANTHROPIC_MODEL": "model-id",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "model-id",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "model-id",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "fast-model-id",
    "CLAUDE_CODE_SUBAGENT_MODEL": "fast-model-id",
    "CLAUDE_CODE_EFFORT_LEVEL": "max"
  }
}
```

Then run `claude-mm set-key <profile-name>` to set the API key.

If the user provides profile details in their message, help them construct the JSON and offer to write it to the profiles file directly.
