#!/usr/bin/env bash
# scripts/archive.sh — Archive current sprint into construction/
set -e

SPRINT_NUM=$1
SPRINT_NAME=$2
DATE=$(date +%Y-%m-%d)

if [ -z "$SPRINT_NUM" ] || [ -z "$SPRINT_NAME" ]; then
  echo "Usage: $0 <sprint-number> <sprint-name>"
  echo "Example: $0 11 refactor-ddd"
  exit 1
fi

DIR="construction/sprints/sprint-$(printf '%02d' $SPRINT_NUM)-${SPRINT_NAME}"
mkdir -p "$DIR"

# Copy transcript if exists
[ -f "transcript.md" ] && cp "transcript.md" "$DIR/transcript-$DATE.md"

# Generate sprint README
cat > "$DIR/README.md" << EOF
# Sprint $SPRINT_NUM — $SPRINT_NAME

**Date**: $DATE
**Status**: 🚧 In Progress

## Objectives
<!-- What we're trying to achieve -->

## Deliverables
- [ ] 

## Technical Notes
<!-- Architecture decisions, gotchas, important patterns -->

## Retrospective
<!-- Lessons learned, what worked, what didn't -->
EOF

echo "✅ Archived sprint $SPRINT_NUM to $DIR/"
echo "📝 Edit $DIR/README.md to fill in the details"
