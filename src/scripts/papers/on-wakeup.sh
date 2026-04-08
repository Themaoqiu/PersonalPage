#!/bin/zsh
set -euo pipefail

PROJECT_ROOT="/Users/themaoqiu/CodeRepo/web/website/Xingjian_Wang"
RUN_SCRIPT="${PROJECT_ROOT}/src/scripts/papers/run-daily.sh"
LOG_FILE="${PROJECT_ROOT}/data/papers/cron.log"

mkdir -p "${PROJECT_ROOT}/data/papers"
echo "[papers] wake event at $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE"
"$RUN_SCRIPT" >> "$LOG_FILE" 2>&1 || true
