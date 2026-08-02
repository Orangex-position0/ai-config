#!/usr/bin/env bash
set -euo pipefail

dry_run=0
json=0

for arg in "$@"; do
  case "$arg" in
    --dry-run) dry_run=1 ;;
    --json) json=1 ;;
    --help|-h)
      printf 'Usage: install.sh [--dry-run] [--json]\n'
      exit 0
      ;;
    *)
      printf 'Error: unknown argument: %s\n' "$arg" >&2
      exit 2
      ;;
  esac
done

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="$(cd "$script_dir/.." && pwd)"
claude_home="${CLAUDE_HOME:-$HOME/.claude}"
codex_home="${CODEX_HOME:-$HOME/.codex}"
operations=()

add_copy_dir() {
  local rel="$1"
  local dest_root="$2"
  add_copy_dir_as "$rel" "$rel" "$dest_root"
}

add_copy_dir_as() {
  local rel="$1"
  local dest_rel="$2"
  local dest_root="$3"
  local src="$root/$rel"
  local dest="$dest_root/$dest_rel"

  [[ -d "$src" ]] || return 0
  operations+=("copy-dir|$src|$dest")
}

add_agent_copy() {
  local dest_root="$1"

  if [[ -d "$root/agents" ]]; then
    add_copy_dir_as "agents" "agents" "$dest_root"
  elif [[ -d "$root/agent" ]]; then
    add_copy_dir_as "agent" "agents" "$dest_root"
  fi
}

add_copy_file() {
  local rel="$1"
  local dest="$2"
  local src="$root/$rel"

  [[ -f "$src" ]] || return 0
  operations+=("copy-file|$src|$dest")
}

run_operation() {
  local op="$1"
  IFS='|' read -r kind src dest <<< "$op"

  [[ "$dry_run" -eq 1 ]] && return 0

  if [[ "$kind" == "copy-dir" ]]; then
    rm -rf "$dest"
    mkdir -p "$(dirname "$dest")"
    cp -R "$src" "$dest"
  else
    mkdir -p "$(dirname "$dest")"
    cp "$src" "$dest"
  fi
}

add_copy_dir "rules" "$claude_home"
add_copy_dir "skills" "$claude_home"
add_agent_copy "$claude_home"
add_copy_dir "commands" "$claude_home"
add_copy_dir "templates" "$claude_home"
add_copy_file "CLAUDE.md" "$claude_home/CLAUDE.md"

add_copy_dir "rules" "$codex_home"
add_copy_dir "skills" "$codex_home"
add_agent_copy "$codex_home"
add_copy_dir "commands" "$codex_home"
add_copy_dir "templates" "$codex_home"
add_copy_file "AGENTS.md" "$codex_home/AGENTS.md"

for op in "${operations[@]}"; do
  run_operation "$op"
done

if [[ "$dry_run" -eq 0 ]]; then
  {
    printf '{\n'
    printf '  "generated": "Generated from ai-config. Do not edit generated copies directly.",\n'
    printf '  "installedAt": "%s",\n' "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    printf '  "sourceRoot": "%s",\n' "$root"
    printf '  "operationCount": %s\n' "${#operations[@]}"
    printf '}\n'
  } > "$root/install-state.json"
fi

if [[ "$json" -eq 1 ]]; then
  printf '{"dryRun":%s,"operationCount":%s}\n' "$([[ "$dry_run" -eq 1 ]] && printf true || printf false)" "${#operations[@]}"
else
  if [[ "$dry_run" -eq 1 ]]; then
    printf 'Planned %s operations.\n' "${#operations[@]}"
  else
    printf 'Installed %s operations.\n' "${#operations[@]}"
  fi
  for op in "${operations[@]}"; do
    IFS='|' read -r kind src dest <<< "$op"
    printf -- '- %s: %s -> %s\n' "$kind" "$src" "$dest"
  done
fi
