#!/usr/bin/env bash
# Sync the vendored skill and docs from a catalog workspace.
# Source precedence: DSH_CATALOG_REPO, first argument, ../dsh.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd -P)"
if [ -n "${DSH_CATALOG_REPO:-}" ]; then
  SOURCE="$DSH_CATALOG_REPO"
elif [ -n "${1:-}" ]; then
  SOURCE="$1"
elif [ -d "$ROOT/../dsh-plugin-landscape" ]; then
  SOURCE="$ROOT/../dsh-plugin-landscape"
else
  SOURCE="$ROOT/../dsh"
fi

if [ ! -d "$SOURCE" ]; then
  echo "Catalog source not found: $SOURCE" >&2
  echo "Set DSH_CATALOG_REPO or pass the catalog path as the first argument." >&2
  exit 1
fi

SOURCE="$(cd "$SOURCE" && pwd -P)"
if [ "$SOURCE" = "$ROOT" ]; then
  echo "Refusing to sync the harness from itself: $SOURCE" >&2
  exit 1
fi

if [ ! -d "$SOURCE/.dsh/skills/dsh-plugin-sota" ]; then
  echo "Source skill not found: $SOURCE/.dsh/skills/dsh-plugin-sota" >&2
  exit 1
fi
if [ ! -d "$SOURCE/docs/plugin-landscape" ]; then
  echo "Source docs not found: $SOURCE/docs/plugin-landscape" >&2
  exit 1
fi

rsync -a --delete "$SOURCE/.dsh/skills/dsh-plugin-sota/" "$ROOT/.dsh/skills/dsh-plugin-sota/"
rsync -a --delete "$SOURCE/docs/plugin-landscape/" "$ROOT/docs/plugin-landscape/"

diff -r "$SOURCE/.dsh/skills/dsh-plugin-sota" "$ROOT/.dsh/skills/dsh-plugin-sota"
diff -r "$SOURCE/docs/plugin-landscape" "$ROOT/docs/plugin-landscape"
echo "Synced and verified from $SOURCE"
