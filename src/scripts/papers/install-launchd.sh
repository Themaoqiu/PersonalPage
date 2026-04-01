#!/bin/zsh
set -euo pipefail

PROJECT_ROOT="/Users/themaoqiu/CodeRepo/web/website/Xingjian_Wang"
JOB_LABEL="com.themaoqiu.papers.daily"
PLIST_PATH="$HOME/Library/LaunchAgents/${JOB_LABEL}.plist"
RUN_SCRIPT="${PROJECT_ROOT}/src/scripts/papers/run-daily.sh"

mkdir -p "$HOME/Library/LaunchAgents"
chmod +x "$RUN_SCRIPT"

cat > "$PLIST_PATH" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>${JOB_LABEL}</string>

    <key>ProgramArguments</key>
    <array>
      <string>/bin/zsh</string>
      <string>-lc</string>
      <string>${RUN_SCRIPT}</string>
    </array>

    <key>WorkingDirectory</key>
    <string>${PROJECT_ROOT}</string>

    <!-- Primary schedule: run at 09:10 local time -->
    <key>StartCalendarInterval</key>
    <dict>
      <key>Hour</key>
      <integer>9</integer>
      <key>Minute</key>
      <integer>10</integer>
    </dict>

    <!-- Catch-up checks every 10 minutes; script enforces 09:10-12:00 window -->
    <key>StartInterval</key>
    <integer>600</integer>

    <key>RunAtLoad</key>
    <true/>

    <key>StandardOutPath</key>
    <string>${PROJECT_ROOT}/data/papers/launchd.out.log</string>
    <key>StandardErrorPath</key>
    <string>${PROJECT_ROOT}/data/papers/launchd.err.log</string>
  </dict>
</plist>
EOF

launchctl bootout "gui/$(id -u)/${JOB_LABEL}" >/dev/null 2>&1 || true
launchctl bootstrap "gui/$(id -u)" "$PLIST_PATH"
launchctl enable "gui/$(id -u)/${JOB_LABEL}"

echo "Installed launchd job: ${JOB_LABEL}"
echo "Plist: ${PLIST_PATH}"
echo "Test now:"
echo "  launchctl kickstart -k gui/$(id -u)/${JOB_LABEL}"
