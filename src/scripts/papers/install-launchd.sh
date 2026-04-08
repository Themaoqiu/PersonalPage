#!/bin/zsh
set -euo pipefail

PROJECT_ROOT="/Users/themaoqiu/CodeRepo/web/website/Xingjian_Wang"
SCHEDULE_JOB_LABEL="com.themaoqiu.papers.daily"
WAKE_JOB_LABEL="com.themaoqiu.papers.wakewatch"
SCHEDULE_PLIST_PATH="$HOME/Library/LaunchAgents/${SCHEDULE_JOB_LABEL}.plist"
WAKE_PLIST_PATH="$HOME/Library/LaunchAgents/${WAKE_JOB_LABEL}.plist"
DAILY_SCRIPT="${PROJECT_ROOT}/src/scripts/papers/run-daily.sh"
WAKE_SCRIPT="${PROJECT_ROOT}/src/scripts/papers/on-wakeup.sh"
SLEEPWATCHER_BIN=""

mkdir -p "$HOME/Library/LaunchAgents"
chmod +x "$DAILY_SCRIPT"
chmod +x "$WAKE_SCRIPT"

for candidate in \
  "/opt/homebrew/sbin/sleepwatcher" \
  "/usr/local/sbin/sleepwatcher" \
  "/opt/homebrew/bin/sleepwatcher" \
  "/usr/local/bin/sleepwatcher" \
  "/usr/sbin/sleepwatcher" \
  "/usr/bin/sleepwatcher"
do
  if [ -x "$candidate" ]; then
    SLEEPWATCHER_BIN="$candidate"
    break
  fi
done

if [ -z "$SLEEPWATCHER_BIN" ]; then
  echo "sleepwatcher not found. Install it first, for example: brew install sleepwatcher" >&2
  exit 1
fi

cat > "$SCHEDULE_PLIST_PATH" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>${SCHEDULE_JOB_LABEL}</string>

    <key>ProgramArguments</key>
    <array>
      <string>/bin/zsh</string>
      <string>-lc</string>
      <string>${DAILY_SCRIPT}</string>
    </array>

    <key>WorkingDirectory</key>
    <string>${PROJECT_ROOT}</string>

    <key>StartCalendarInterval</key>
    <dict>
      <key>Hour</key>
      <integer>9</integer>
      <key>Minute</key>
      <integer>10</integer>
    </dict>

    <key>RunAtLoad</key>
    <false/>

    <key>StandardOutPath</key>
    <string>${PROJECT_ROOT}/data/papers/launchd.out.log</string>
    <key>StandardErrorPath</key>
    <string>${PROJECT_ROOT}/data/papers/launchd.err.log</string>
  </dict>
</plist>
EOF

cat > "$WAKE_PLIST_PATH" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>${WAKE_JOB_LABEL}</string>

    <key>ProgramArguments</key>
    <array>
      <string>${SLEEPWATCHER_BIN}</string>
      <string>-V</string>
      <string>-w</string>
      <string>${WAKE_SCRIPT}</string>
    </array>

    <key>WorkingDirectory</key>
    <string>${PROJECT_ROOT}</string>

    <key>KeepAlive</key>
    <true/>

    <key>RunAtLoad</key>
    <true/>

    <key>StandardOutPath</key>
    <string>${PROJECT_ROOT}/data/papers/launchd.out.log</string>
    <key>StandardErrorPath</key>
    <string>${PROJECT_ROOT}/data/papers/launchd.err.log</string>
  </dict>
</plist>
EOF

launchctl bootout "gui/$(id -u)/${SCHEDULE_JOB_LABEL}" >/dev/null 2>&1 || true
launchctl bootout "gui/$(id -u)/${WAKE_JOB_LABEL}" >/dev/null 2>&1 || true

launchctl enable "gui/$(id -u)/${SCHEDULE_JOB_LABEL}" >/dev/null 2>&1 || true
launchctl enable "gui/$(id -u)/${WAKE_JOB_LABEL}" >/dev/null 2>&1 || true
launchctl bootstrap "gui/$(id -u)" "$SCHEDULE_PLIST_PATH"
launchctl bootstrap "gui/$(id -u)" "$WAKE_PLIST_PATH"

echo "Installed launchd jobs:"
echo "  ${SCHEDULE_JOB_LABEL} -> ${SCHEDULE_PLIST_PATH}"
echo "  ${WAKE_JOB_LABEL} -> ${WAKE_PLIST_PATH}"
echo "Using sleepwatcher: ${SLEEPWATCHER_BIN}"
echo "Test now:"
echo "  launchctl kickstart -k gui/$(id -u)/${SCHEDULE_JOB_LABEL}"
