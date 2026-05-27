Show help for claude-multimodel. Display this exactly:

---

**claude-multimodel** — Switch model providers in Claude Code

**Terminal commands:**
```
claude-mm                        Interactive profile menu + launch Claude
claude-mm launch <profile>       Launch with specific profile
claude-mm list                   List all profiles + key status
claude-mm active                 Show currently active profile
claude-mm set-key [profile]      Set API key (hidden input)
claude-mm add                    Add new profile interactively
claude-mm remove <profile>       Remove a profile
```

**Slash commands (use inside Claude):**
```
/multimodel/switch-profile       Show profiles, get relaunch command
/multimodel/set-api-key          Key management instructions
/multimodel/add-profile          Add profile guidance
/multimodel/help                 This help
```

**Built-in profiles:** claude-sonnet, claude-opus, deepseek, openai-gpt4o, gemini, groq

**Profiles file:** `~/.claude/multimodel/profiles.json`
