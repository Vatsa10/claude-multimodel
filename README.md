# claude-multimodel

Switch between model providers (DeepSeek, Gemini, OpenAI, Groq, Anthropic) in Claude Code. Install once, works globally in every project.

## Install

```bash
npm install -g claude-multimodel
```

That's it. Slash commands are available in all Claude Code sessions immediately.

## Usage

### Terminal

```bash
claude-mm                        # interactive menu → launch Claude
claude-mm launch deepseek        # direct launch with profile
claude-mm list                   # show all profiles + key status
claude-mm active                 # show current profile
claude-mm set-key deepseek       # set API key (hidden input)
claude-mm add                    # add new profile interactively
claude-mm remove my-profile      # remove a profile
```

### Inside Claude Code

```
/multimodel/switch-profile       show active profile + all options
/multimodel/set-api-key          key setup instructions
/multimodel/add-profile          add profile guidance
/multimodel/help                 all commands
```

## Built-in profiles

| Profile | Provider | Notes |
|---------|----------|-------|
| `claude-sonnet` | Anthropic | Default — uses system `ANTHROPIC_API_KEY` |
| `claude-opus` | Anthropic | Max power |
| `deepseek` | DeepSeek | Needs API key |
| `openai-gpt4o` | OpenAI | Needs API key |
| `gemini` | Google | Needs API key |
| `groq` | Groq | Ultra-fast, needs API key |

## Set API keys

```bash
claude-mm set-key              # interactive, hidden input
claude-mm set-key deepseek     # specific profile
```

Keys stored in `~/.claude/multimodel/profiles.json` — local only, never committed.

Native Anthropic profiles (`claude-sonnet`, `claude-opus`) read your existing `ANTHROPIC_API_KEY` — no setup needed.

## Add a custom profile

```bash
claude-mm add
```

Asks for: name, base URL, model IDs, effort level. Or edit `~/.claude/multimodel/profiles.json` directly.

## How it works

- Profiles are named sets of env vars (`ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_MODEL`, etc.)
- `claude-mm launch` sets those env vars in the child process, then runs `claude`
- Env vars must be set at launch — switching mid-session requires relaunch
- Slash commands are installed to `~/.claude/commands/multimodel/` and work in every project

## Env vars per profile

| Var | Purpose |
|-----|---------|
| `ANTHROPIC_BASE_URL` | API endpoint (empty = native Anthropic) |
| `ANTHROPIC_AUTH_TOKEN` | API key for third-party providers |
| `ANTHROPIC_MODEL` | Default model |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | Model when Opus is requested |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | Model when Sonnet is requested |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Model when Haiku is requested |
| `CLAUDE_CODE_SUBAGENT_MODEL` | Model for background subagents |
| `CLAUDE_CODE_EFFORT_LEVEL` | `low` / `medium` / `high` / `max` |
