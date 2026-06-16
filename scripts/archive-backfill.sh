#!/usr/bin/env bash
# Backfill the 10 sprints we've completed
set -e

SPRINT_DATA=(
  "0:kickoff"
  "1:foundation-pms"
  "2:reservations"
  "3:housekeeping"
  "4:billing"
  "5:multi-hotel"
  "6:channel-manager"
  "7:mobile-native"
  "8:commercial-stack"
  "9:rbac-polish"
  "10:industrialization"
)

for entry in "${SPRINT_DATA[@]}"; do
  NUM="${entry%%:*}"
  NAME="${entry#*:}"
  echo "📁 Archiving sprint $NUM ($NAME)..."
  bash scripts/archive.sh "$NUM" "$NAME"
done

echo "✅ All sprints archived"
