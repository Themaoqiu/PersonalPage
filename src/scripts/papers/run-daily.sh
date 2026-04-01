#!/bin/zsh
set -euo pipefail

PROJECT_ROOT="/Users/themaoqiu/CodeRepo/web/website/Xingjian_Wang"
cd "$PROJECT_ROOT"

# Ensure common binaries are available in launchd environment
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"
export PATH="$HOME/.bun/bin:$PATH"

# Optional local env file for secrets/config
# Example keys:
# QQ_EMAIL=...
# QQ_IMAP_AUTH_CODE=...
# PAPERS_WAIT_FOR_TODAY_MAIL=true
# PAPERS_GIT_AUTOPUSH=true
# PAPERS_DEPLOY_GITHUB_PAGES=true
if [ -f "src/scripts/papers/.env" ]; then
  set -a
  source "src/scripts/papers/.env"
  set +a
fi

if [ -z "${QQ_EMAIL:-}" ] || [ -z "${QQ_IMAP_AUTH_CODE:-}" ]; then
  echo "[papers] missing QQ_EMAIL or QQ_IMAP_AUTH_CODE in src/scripts/papers/.env" >> data/papers/cron.log
  exit 1
fi

if [ "${QQ_IMAP_AUTH_CODE}" = "replace_with_your_qq_imap_auth_code" ]; then
  echo "[papers] QQ_IMAP_AUTH_CODE is still placeholder, please set real QQ IMAP auth code" >> data/papers/cron.log
  exit 1
fi

# Default: wait for today's mail in the morning window
export PAPERS_WAIT_FOR_TODAY_MAIL="${PAPERS_WAIT_FOR_TODAY_MAIL:-true}"

mkdir -p data/papers
echo "[papers] ===== $(date '+%Y-%m-%d %H:%M:%S') run start =====" >> data/papers/cron.log
echo "[papers] PATH=$PATH" >> data/papers/cron.log

# Auto-run window control:
# - scheduled at 09:10
# - if machine sleeps, allow catch-up run only between 09:10 and 12:00
# - after 12:00 skip auto-run
if [ "${PAPERS_FORCE_RUN:-false}" != "true" ]; then
  HHMM="$(date '+%H:%M')"
  TODAY="$(date '+%F')"
  START="${PAPERS_AUTO_WINDOW_START:-09:10}"
  END="${PAPERS_AUTO_WINDOW_END:-12:00}"
  STAMP_FILE="data/papers/auto-run-${TODAY}.stamp"

  if [[ "$HHMM" < "$START" || "$HHMM" == "$END" || "$HHMM" > "$END" ]]; then
    echo "[papers] skip: now=$HHMM outside auto window [$START, $END]" >> data/papers/cron.log
    exit 0
  fi

  if [ -f "$STAMP_FILE" ]; then
    echo "[papers] skip: already succeeded today ($STAMP_FILE)" >> data/papers/cron.log
    exit 0
  fi
fi

if [ -x "$HOME/.bun/bin/bun" ]; then
  "$HOME/.bun/bin/bun" papers:daily >> data/papers/cron.log 2>&1
elif command -v bun >/dev/null 2>&1; then
  "$(command -v bun)" papers:daily >> data/papers/cron.log 2>&1
elif command -v node >/dev/null 2>&1; then
  echo "[papers] bun not found, fallback to node" >> data/papers/cron.log
  "$(command -v node)" src/scripts/papers/daily.mjs >> data/papers/cron.log 2>&1
else
  echo "[papers] neither bun nor node found in PATH: $PATH" >> data/papers/cron.log
  exit 127
fi

if [ "${PAPERS_FORCE_RUN:-false}" != "true" ]; then
  TODAY="$(date '+%F')"
  STAMP_FILE="data/papers/auto-run-${TODAY}.stamp"
  date '+%Y-%m-%d %H:%M:%S' > "$STAMP_FILE"
  echo "[papers] success stamp written: $STAMP_FILE" >> data/papers/cron.log
fi
