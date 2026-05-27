# claude-multimodel

Switch between model providers in Claude Code — DeepSeek, Gemini, OpenAI, Groq, Kimi, GLM, Qwen, Ollama, Anthropic. Install once, works globally in every project.

**Website:** https://claude-mm.vatsa.online

## Install

```bash
npm install -g claude-multimodel
```

Slash commands register automatically. No config needed.

---

## Usage

### Terminal

```bash
claude-mm                          # interactive menu → launch Claude
claude-mm launch deepseek          # launch with specific profile
claude-mm list                     # show all profiles + key status
claude-mm active                   # show current profile
claude-mm providers                # list all known providers + compatibility
claude-mm set-key deepseek         # set API key (hidden input)
claude-mm set-model deepseek       # change model for a profile (interactive)
claude-mm set-model deepseek deepseek-r1          # set main model directly
claude-mm set-model deepseek deepseek-r1 deepseek-v4-flash  # set main + subagent
claude-mm add                      # add new profile (guided wizard)
claude-mm remove <profile>         # remove a profile
claude-mm set-default deepseek     # make DeepSeek permanent (writes to shell profile)
claude-mm unset-default            # remove permanent override
```

### Inside Claude Code

```
/multimodel/switch-profile         show active profile + all options
/multimodel/set-api-key            key setup instructions
/multimodel/add-profile            add profile guidance
/multimodel/help                   all commands
```

---

## Built-in profiles

| Profile | Provider | Main Model | Subagent | Key needed | Setup |
|---------|----------|------------|----------|------------|-------|
| `claude` | Anthropic | *(Claude Code default)* | *(default)* | No | None |
| `claude-max` | Anthropic | *(Claude Code default, max effort)* | *(default)* | No | None |
| `deepseek` | DeepSeek | deepseek-v4-pro | deepseek-v4-flash | Yes | Direct |
| `deepseek-flash` | DeepSeek | deepseek-v4-flash | deepseek-v4-flash | Yes | Direct |
| `openrouter` | OpenRouter | anthropic/claude-opus-4 | llama-3.3-70b | Yes | Direct |
| `kimi` | Moonshot AI | kimi-k2.5 | moonshot-v1-8k | Yes | Direct |
| `glm` | Z.AI (intl) | glm-4.6 | glm-4-flash | Yes | Direct |
| `glm-cn` | Zhipu BigModel | glm-4.6 | glm-4-flash | Yes | Direct (CN) |
| `openai` | OpenAI | gpt-4.1 | gpt-4o-mini | Yes | LiteLLM proxy |
| `gemini` | Google | gemini-2.5-pro | gemini-2.5-flash | Yes | LiteLLM proxy |
| `groq` | Groq | llama-3.3-70b-versatile | llama-3.1-8b-instant | Yes | LiteLLM proxy |

> `claude` and `claude-max` set no model overrides — Claude Code always picks its current best models. Zero staleness.
>
> **Direct** profiles connect to the provider's Anthropic-compatible API without any proxy. **LiteLLM proxy** profiles require `litellm` running locally — see setup below.

---

## Set API keys

```bash
claude-mm set-key              # interactive menu, hidden input
claude-mm set-key deepseek     # specific profile
```

Keys stored in `~/.claude/multimodel/profiles.json` — local only, never committed.

Native Anthropic profiles read your existing `ANTHROPIC_API_KEY`. No setup needed.

---

## Change model for a profile

```bash
claude-mm set-model deepseek                              # interactive
claude-mm set-model deepseek deepseek-r1                  # set main model
claude-mm set-model deepseek deepseek-r1 deepseek-v4-flash  # main + subagent
```

Shows current models, hints popular models for that provider, then saves.

Updates: `ANTHROPIC_MODEL`, `ANTHROPIC_DEFAULT_OPUS_MODEL`, `ANTHROPIC_DEFAULT_SONNET_MODEL`, `ANTHROPIC_DEFAULT_HAIKU_MODEL`, `CLAUDE_CODE_SUBAGENT_MODEL`.

Or edit directly:
```bash
# open profiles file
code ~/.claude/multimodel/profiles.json    # VS Code
notepad $env:USERPROFILE\.claude\multimodel\profiles.json  # Windows
```

---

## Add a custom model or provider

```bash
claude-mm add
```

Guided wizard:
1. Pick from known providers list (or "manual" for custom endpoint)
2. Enter profile name
3. Enter model ID (flagship + fast/subagent)
4. Set API key

**Custom model from existing provider** — pick the provider, enter any model ID they offer:
```
Provider: deepseek
Profile name: deepseek-reasoner
Main model: deepseek-reasoner
Subagent: deepseek-v4-flash
```

**New provider** — pick "custom", enter base URL + model IDs:
```
Provider: custom
Base URL: https://api.myprovider.com/anthropic
Main model: my-model-v1
```

---

## Known providers

View the full registry:
```bash
claude-mm providers
```

| Provider | Key | Compatibility | Setup |
|----------|-----|---------------|-------|
| Anthropic | `anthropic` | Native | None |
| DeepSeek | `deepseek` | Anthropic-compatible | Direct |
| OpenRouter | `openrouter` | Anthropic-compatible | Direct |
| Kimi (Moonshot) | `kimi` | Anthropic-compatible | Direct |
| GLM / Z.AI (intl) | `glm` | Anthropic-compatible | Direct |
| GLM / Zhipu (CN) | `glm-cn` | Anthropic-compatible | Direct (CN) |
| OpenAI | `openai` | OpenAI-only | LiteLLM proxy |
| Google Gemini | `gemini` | OpenAI-only | LiteLLM proxy |
| Groq | `groq` | OpenAI-only | LiteLLM proxy |
| Mistral AI | `mistral` | OpenAI-only | LiteLLM proxy |
| Together AI | `together` | OpenAI-only | LiteLLM proxy |
| Qwen (Alibaba) | `qwen` | OpenAI-only | LiteLLM proxy |
| Ollama (local) | `ollama` | OpenAI-only | LiteLLM proxy |
| Custom | `custom` | Anthropic-compatible | Direct |

**Why LiteLLM for some?** Claude Code sends requests in Anthropic's `/v1/messages` format. OpenAI, Groq, Gemini etc. only speak `/v1/chat/completions` — a different wire protocol. LiteLLM translates between them locally. DeepSeek, OpenRouter, Kimi, and GLM all ship real Anthropic-compatible endpoints so they connect directly with no proxy.

### Providers that need LiteLLM proxy

Install LiteLLM once:
```bash
pip install 'litellm[proxy]'
```

Start the proxy for your provider (in a separate terminal, before launching Claude):

```bash
# OpenAI
litellm --model openai/gpt-4.1 --api_key $OPENAI_API_KEY --port 4000

# Google Gemini (get key at aistudio.google.com)
litellm --model gemini/gemini-2.5-pro --api_key $GEMINI_API_KEY --port 4000

# Groq
litellm --model groq/llama-3.3-70b-versatile --api_key $GROQ_API_KEY --port 4000

# Mistral
litellm --model mistral/mistral-large-latest --api_key $MISTRAL_API_KEY --port 4000

# Together AI
litellm --model together_ai/meta-llama/Llama-3.3-70B-Instruct-Turbo --api_key $TOGETHERAI_API_KEY --port 4000

# OpenRouter — access 100+ models with one key (openrouter.ai)
litellm --model openrouter/anthropic/claude-opus-4 --api_key $OPENROUTER_API_KEY --port 4000

# Kimi (Moonshot)
litellm --model openai/moonshot-v1-128k --api_key $MOONSHOT_API_KEY --port 4000

# GLM (Zhipu AI)
litellm --model openai/glm-4-plus --api_key $ZHIPUAI_API_KEY --port 4000

# Ollama (local, no API key)
litellm --model ollama/llama3.3 --api_base http://localhost:11434 --port 4000
```

Then run `claude-mm launch <profile>`. The CLI will remind you with the exact command if LiteLLM isn't set up.

**OpenRouter popular models** (swap into the LiteLLM `--model` flag):
```
openrouter/anthropic/claude-opus-4
openrouter/openai/gpt-4.1
openrouter/google/gemini-2.5-pro
openrouter/deepseek/deepseek-chat
openrouter/deepseek/deepseek-r1
openrouter/meta-llama/llama-3.3-70b-instruct
openrouter/x-ai/grok-3
```

---

## Make a provider permanent

Want DeepSeek every time — even with plain `claude`?

```bash
claude-mm set-default deepseek
# restart terminal
claude                          # now uses DeepSeek
```

Writes env vars into your shell profile (`$PROFILE` on Windows, `.bashrc`/`.zshrc` on Mac/Linux).

Revert:
```bash
claude-mm unset-default
# restart terminal
```

---

## How it works

- Profiles = named sets of env vars
- `claude-mm launch` sets env vars in child process → runs `claude`
- Env vars must be set at launch — switching mid-session requires relaunch
- `set-default` writes vars to shell profile so every terminal already has them
- Slash commands installed to `~/.claude/commands/multimodel/` — available in every project

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

---

## Update

```bash
npm update -g claude-multimodel
```
