Output the following help text exactly as written, no commentary:

---

**claude-multimodel** — Switch model providers in Claude Code

**Terminal commands:**
```
claude-mm                          Interactive profile menu + launch Claude
claude-mm launch <profile>         Launch with specific profile
claude-mm list                     List all profiles + key status
claude-mm active                   Show currently active profile
claude-mm providers                List all known providers + compatibility
claude-mm set-key [profile]        Set API key (hidden input)
claude-mm set-model <profile>      Change model for a profile (interactive)
claude-mm add                      Add new profile interactively
claude-mm remove <profile>         Remove a profile
claude-mm set-default [profile]    Write env vars to shell profile (permanent)
claude-mm unset-default            Remove permanent default
```

**Slash commands (inside Claude Code):**
```
/multimodel/switch-profile         Show active profile + all options
/multimodel/set-api-key            API key setup instructions
/multimodel/add-profile            Add profile guidance
/multimodel/help                   This help
```

**Built-in profiles:** `claude`, `claude-max`, `deepseek`, `deepseek-flash`, `openrouter`, `kimi`, `glm`, `glm-cn`, `openai`, `gemini`, `groq`

**Profiles file:** `~/.claude/multimodel/profiles.json`

**Docs:** https://claude-mm.vatsa.online
