#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-3000}"
HOST="${HOST:-127.0.0.1}"
LOG_FILE="${LOG_FILE:-/tmp/solar-system-local-dev.log}"
PID_FILE="${PID_FILE:-/tmp/solar-system-local-dev.pid}"
HEALTH_PATH="${HEALTH_PATH:-/lunar-eclipse/?lang=zh}"
URL="http://${HOST}:${PORT}"
HEALTH_URL="${URL}${HEALTH_PATH}"
LAUNCH_LABEL="${LAUNCH_LABEL:-com.solar-system.local-dev}"
LAUNCH_AGENT_DIR="${HOME}/Library/LaunchAgents"
LAUNCH_AGENT_PLIST="${LAUNCH_AGENT_DIR}/${LAUNCH_LABEL}.plist"
NPM_BIN="$(command -v npm)"

cd "$ROOT_DIR"

echo "Stopping existing local Next dev server..."
if [[ "$(uname -s)" == "Darwin" ]] && command -v launchctl >/dev/null 2>&1; then
  launchctl bootout "gui/$(id -u)" "$LAUNCH_AGENT_PLIST" >/dev/null 2>&1 || true
  launchctl remove "$LAUNCH_LABEL" >/dev/null 2>&1 || true
fi

if [[ -f "$PID_FILE" ]]; then
  OLD_PID="$(cat "$PID_FILE")"
  if [[ -n "$OLD_PID" ]] && kill -0 "$OLD_PID" 2>/dev/null; then
    kill "$OLD_PID" 2>/dev/null || true
  fi
  rm -f "$PID_FILE"
fi

pkill -f "${ROOT_DIR}/node_modules/.bin/next dev" 2>/dev/null || true
pkill -f "next dev.*${PORT}" 2>/dev/null || true
if command -v lsof >/dev/null 2>&1; then
  while IFS= read -r LISTENER_PID; do
    [[ -n "$LISTENER_PID" ]] || continue
    kill "$LISTENER_PID" 2>/dev/null || true
  done < <(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)
fi

echo "Cleaning Next.js development cache..."
rm -rf .next

echo "Starting local dev server at ${URL}..."
: >"$LOG_FILE"
if [[ "$(uname -s)" == "Darwin" ]] && command -v launchctl >/dev/null 2>&1; then
  mkdir -p "$LAUNCH_AGENT_DIR"
  cat >"$LAUNCH_AGENT_PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${LAUNCH_LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-lc</string>
    <string>cd "${ROOT_DIR}" &amp;&amp; exec "${NPM_BIN}" run dev -- --hostname "${HOST}" --port "${PORT}"</string>
  </array>
  <key>WorkingDirectory</key>
  <string>${ROOT_DIR}</string>
  <key>StandardOutPath</key>
  <string>${LOG_FILE}</string>
  <key>StandardErrorPath</key>
  <string>${LOG_FILE}</string>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <false/>
</dict>
</plist>
PLIST
  launchctl bootstrap "gui/$(id -u)" "$LAUNCH_AGENT_PLIST"
  launchctl kickstart -k "gui/$(id -u)/${LAUNCH_LABEL}" >/dev/null 2>&1 || true
else
  nohup bash -c 'exec npm run dev -- --hostname "$1" --port "$2"' _ "$HOST" "$PORT" >"$LOG_FILE" 2>&1 </dev/null &
  SERVER_PID="$!"
  echo "$SERVER_PID" >"$PID_FILE"
  disown "$SERVER_PID" 2>/dev/null || true
fi

echo "Waiting for server health check..."
for _ in {1..60}; do
  if curl -fsS "$HEALTH_URL" >/dev/null 2>&1; then
    if command -v lsof >/dev/null 2>&1; then
      LISTENER_PID="$(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null | head -n 1 || true)"
      [[ -z "$LISTENER_PID" ]] || echo "$LISTENER_PID" >"$PID_FILE"
    fi
    echo "Local deployment is ready: ${URL}"
    echo "Health check: ${HEALTH_URL}"
    echo "Log file: ${LOG_FILE}"
    echo "PID file: ${PID_FILE}"
    exit 0
  fi
  sleep 1
done

echo "Local deployment did not become ready in time. Last log lines:" >&2
tail -n 60 "$LOG_FILE" >&2 || true
exit 1
