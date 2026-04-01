# Papers Automation

This pipeline creates one blog post per day from "Hugging Face daily paper" emails.

## 1) Setup

Copy `config.example.json` to `config.json` and tune values:

```bash
cp src/scripts/papers/config.example.json src/scripts/papers/config.json
```

Set env vars:

```bash
export QQ_EMAIL="your_qq_mail@qq.com"
export QQ_IMAP_AUTH_CODE="qq_imap_auth_code"
export OPENAI_API_KEY="..."
export HUANJUE_TRANSLATE_API_URL="https://your-translate-endpoint"
export HUANJUE_TRANSLATE_API_KEY="..."
```

Or place them in local file `src/scripts/papers/.env`:

```bash
cp src/scripts/papers/.env.example src/scripts/papers/.env
```

Strictly process only today's mail (local timezone in config, default `Asia/Shanghai`) is enabled by script logic.

Optional auto-commit and push:

```bash
export PAPERS_GIT_AUTOPUSH="true"
```

Optional auto deploy to GitHub Pages repo after push:

```bash
export PAPERS_DEPLOY_GITHUB_PAGES="true"
export PAPERS_DEPLOY_SCRIPT="/Users/themaoqiu/CodeRepo/web/website/Xingjian_Wang/deploy-to-github-pages.sh"
```

Optional morning waiting mode (for non-fixed delivery times such as 9/10/11 AM):

```bash
export PAPERS_WAIT_FOR_TODAY_MAIL="true"
```

You can tune these in `config.json`:
- `email.timezone` (default `Asia/Shanghai`)
- `email.waitForTodayMail`
- `email.pollIntervalMinutes`
- `email.waitUntilLocal` (e.g. `"12:00"`)
- `publishing.gitAutoPush`
- `publishing.deployAfterPush`
- `publishing.deployScript`

## 2) Run

```bash
bun papers:daily
```

## 2.1) Auto Run Daily on macOS (launchd)

One-time setup (after filling env vars):

```bash
chmod +x src/scripts/papers/run-daily.sh src/scripts/papers/install-launchd.sh src/scripts/papers/uninstall-launchd.sh
src/scripts/papers/install-launchd.sh
```

This installs a daily job at `09:10` local time.
The job runs:
- fetch today's email
- generate/update papers post
- auto push + deploy (if enabled in `config.json` / env)

Current auto behavior:
- fixed trigger at `09:10`
- if sleeping at 09:10, catch-up checks run every 10 minutes
- auto-run allowed only in `09:10-12:00` (local time)
- once succeeded, it won't auto-run again the same day

Manual trigger (for testing):

```bash
launchctl kickstart -k gui/$(id -u)/com.themaoqiu.papers.daily
```

Force manual run ignoring time window:

```bash
PAPERS_FORCE_RUN=true src/scripts/papers/run-daily.sh
```

Uninstall:

```bash
src/scripts/papers/uninstall-launchd.sh
```

## 3) Output

- Blog post: `src/content/blogs/papers-YYYY-MM-DD/index.mdx`
- Debug JSON: `data/papers/YYYY-MM-DD.raw.json`

## Notes

- Classification is done by AI model, not keyword-only matching.
- Optional Codex review can refine category choices when enabled in config.
- Only mails whose parsed mail date is exactly "today" in configured timezone are accepted.
- When publishing is enabled, script will `git add/commit/push` and then run your deploy script.
