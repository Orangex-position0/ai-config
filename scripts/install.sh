#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if ! command -v node >/dev/null 2>&1; then
  printf 'Error: Node.js >=20 is required.
' >&2
  exit 1
fi
node -e 'if (Number(process.versions.node.split(".")[0]) < 20) { console.error("Node.js >=20 is required."); process.exit(1); }'
exec node "$script_dir/lib/config-cli.mjs" install "$@"
