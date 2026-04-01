#!/bin/zsh
set -euo pipefail

JOB_LABEL="com.themaoqiu.papers.daily"
PLIST_PATH="$HOME/Library/LaunchAgents/${JOB_LABEL}.plist"

launchctl bootout "gui/$(id -u)/${JOB_LABEL}" >/dev/null 2>&1 || true
launchctl disable "gui/$(id -u)/${JOB_LABEL}" >/dev/null 2>&1 || true
rm -f "$PLIST_PATH"

echo "Removed launchd job: ${JOB_LABEL}"
