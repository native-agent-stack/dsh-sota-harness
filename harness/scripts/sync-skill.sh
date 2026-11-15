#!/usr/bin/env bash
# Sync the vendored skill and docs from the catalog workspace.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SOURCE="${1:-$ROOT/../dsh}"

if [ ! -d "$SOURCE/.dsh/skills/dsh-plugin-sota" ]; then
  echo "Source skill not found: $SOURCE/.dsh/skills/dsh-plugin-sota" >&2
  exit 1
fi

rsync -a --delete "$SOURCE/.dsh/skills/dsh-plugin-sota/" "$ROOT/.dsh/skills/dsh-plugin-sota/"
rsync -a --delete "$SOURCE/docs/plugin-landscape/" "$ROOT/docs/plugin-landscape/"

diff -r "$SOURCE/.dsh/skills/dsh-plugin-sota" "$ROOT/.dsh/skills/dsh-plugin-sota"
diff -r "$SOURCE/docs/plugin-landscape" "$ROOT/docs/plugin-landscape"
echo "Synced and verified from $SOURCE"
