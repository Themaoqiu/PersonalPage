#!/bin/zsh
set -euo pipefail

SCHEDULE_JOB_LABEL="com.themaoqiu.papers.daily"
WAKE_JOB_LABEL="com.themaoqiu.papers.wakewatch"
SCHEDULE_PLIST_PATH="$HOME/Library/LaunchAgents/${SCHEDULE_JOB_LABEL}.plist"
WAKE_PLIST_PATH="$HOME/Library/LaunchAgents/${WAKE_JOB_LABEL}.plist"

launchctl bootout "gui/$(id -u)/${SCHEDULE_JOB_LABEL}" >/dev/null 2>&1 || true
launchctl disable "gui/$(id -u)/${SCHEDULE_JOB_LABEL}" >/dev/null 2>&1 || true
launchctl bootout "gui/$(id -u)/${WAKE_JOB_LABEL}" >/dev/null 2>&1 || true
launchctl disable "gui/$(id -u)/${WAKE_JOB_LABEL}" >/dev/null 2>&1 || true
rm -f "$SCHEDULE_PLIST_PATH" "$WAKE_PLIST_PATH"

echo "Removed launchd jobs: ${SCHEDULE_JOB_LABEL}, ${WAKE_JOB_LABEL}"
