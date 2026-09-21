#!/usr/bin/env bash
set -euo pipefail

dry_run=0
json=0
force=0

for arg in "$@"; do
  case "$arg" in
    --dry-run) dry_run=1 ;;
    --json) json=1 ;;
    --force) force=1 ;;
    --help|-h)
      printf 'Usage: install.sh [--dry-run] [--json] [--force]\n'
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
agents_home="${AGENTS_HOME:-$HOME/.agents}"
claude_home="${CLAUDE_HOME:-$HOME/.claude}"
codex_home="${CODEX_HOME:-$HOME/.codex}"
operations=()
warnings=()
shared_dirs=(rules skills agents commands templates assets references)
helper_scripts=(scripts/inline-template.mjs scripts/export-resume-pdf.mjs)

json_escape() {
  local s="$1"
  s=${s//\\/\\\\}
  s=${s//\"/\\\"}
  s=${s//$'\n'/\\n}
  printf '%s' "$s"
}

record_op() {
  local kind="$1" src="$2" dest="$3" mode="${4:-planned}"
  operations+=("$kind|$src|$dest|$mode")
}

same_dir() {
  local src="$1" dest="$2"
  [[ -d "$src" && -d "$dest" ]] || return 1
  diff -qr "$src" "$dest" >/dev/null 2>&1
}

same_file() {
  local src="$1" dest="$2"
  [[ -f "$src" && -f "$dest" ]] || return 1
  cmp -s "$src" "$dest"
}

is_managed_shared_home() {
  [[ -f "$agents_home/install-state.json" ]]
}

replace_dir_with_copy() {
  local src="$1" dest="$2"
  rm -rf "$dest"
  mkdir -p "$(dirname "$dest")"
  cp -R "$src" "$dest"
}

install_shared_dir() {
  local rel="$1" dest_rel="${2:-$1}"
  local src="$root/$rel" dest="$agents_home/$dest_rel"
  [[ -d "$src" ]] || return 0
  record_op "install-shared-dir" "$src" "$dest"
  [[ "$dry_run" -eq 1 ]] && return 0

  if [[ -e "$dest" || -L "$dest" ]]; then
    if [[ "$force" -eq 1 ]] || is_managed_shared_home || same_dir "$src" "$dest"; then
      rm -rf "$dest"
    else
      printf 'Error: refusing to replace unmanaged shared directory: %s (use --force)\n' "$dest" >&2
      exit 1
    fi
  fi
  mkdir -p "$(dirname "$dest")"
  cp -R "$src" "$dest"
}

install_shared_file() {
  local rel="$1" dest_rel="${2:-$1}"
  local src="$root/$rel" dest="$agents_home/$dest_rel"
  [[ -f "$src" ]] || return 0
  record_op "install-shared-file" "$src" "$dest"
  [[ "$dry_run" -eq 1 ]] && return 0

  if [[ -e "$dest" || -L "$dest" ]]; then
    if [[ "$force" -eq 1 ]] || is_managed_shared_home || same_file "$src" "$dest"; then
      rm -f "$dest"
    else
      printf 'Error: refusing to replace unmanaged shared file: %s (use --force)\n' "$dest" >&2
      exit 1
    fi
  fi
  mkdir -p "$(dirname "$dest")"
  cp "$src" "$dest"
}

shared_source_exists_for_projection() {
  local rel="$1"
  if [[ "$rel" == "scripts" ]]; then
    [[ -f "$root/scripts/inline-template.mjs" || -f "$root/scripts/export-resume-pdf.mjs" ]]
  elif [[ "$rel" == "agents" && ! -d "$root/agents" ]]; then
    [[ -d "$root/agent" ]]
  else
    [[ -d "$root/$rel" ]]
  fi
}

project_shared_dir() {
  local rel="$1" runtime_home="$2"
  local src="$agents_home/$rel" dest="$runtime_home/$rel"
  if [[ ! -d "$src" ]]; then
    if [[ "$dry_run" -eq 1 ]] && shared_source_exists_for_projection "$rel"; then
      :
    else
      return 0
    fi
  fi
  record_op "project-dir" "$src" "$dest"
  [[ "$dry_run" -eq 1 ]] && return 0

  if [[ -e "$dest" || -L "$dest" ]]; then
    if [[ -L "$dest" ]]; then
      local target
      target="$(readlink "$dest" || true)"
      if [[ "$target" == "$src" ]]; then
        return 0
      fi
    fi
    if [[ "$force" -eq 1 ]] || same_dir "$src" "$dest"; then
      rm -rf "$dest"
    else
      printf 'Error: refusing to replace drifted runtime directory: %s (use --force)\n' "$dest" >&2
      exit 1
    fi
  fi

  mkdir -p "$(dirname "$dest")"
  if ln -s "$src" "$dest" 2>/dev/null && [[ -L "$dest" ]]; then
    operations[-1]="project-dir|$src|$dest|symlink"
  else
    [[ -e "$dest" || -L "$dest" ]] && rm -rf "$dest"
    replace_dir_with_copy "$src" "$dest"
    operations[-1]="project-dir|$src|$dest|copy-fallback"
    warnings+=("copy fallback used for $dest")
  fi
}

install_runtime_file() {
  local rel="$1" dest="$2"
  local src="$root/$rel"
  [[ -f "$src" ]] || return 0
  record_op "install-runtime-file" "$src" "$dest"
  [[ "$dry_run" -eq 1 ]] && return 0

  if [[ -e "$dest" || -L "$dest" ]]; then
    if [[ "$force" -eq 1 ]] || same_file "$src" "$dest"; then
      rm -f "$dest"
    else
      printf 'Error: refusing to replace drifted runtime file: %s (use --force)\n' "$dest" >&2
      exit 1
    fi
  fi
  mkdir -p "$(dirname "$dest")"
  cp "$src" "$dest"
}

for dir in "${shared_dirs[@]}"; do
  if [[ "$dir" == "agents" && ! -d "$root/agents" && -d "$root/agent" ]]; then
    install_shared_dir "agent" "agents"
  else
    install_shared_dir "$dir"
  fi
done
for helper in "${helper_scripts[@]}"; do
  install_shared_file "$helper"
done

for dir in "${shared_dirs[@]}" scripts; do
  project_shared_dir "$dir" "$claude_home"
  project_shared_dir "$dir" "$codex_home"
done
install_runtime_file "CLAUDE.md" "$claude_home/CLAUDE.md"
install_runtime_file "AGENTS.md" "$codex_home/AGENTS.md"

if [[ "$dry_run" -eq 0 ]]; then
  mkdir -p "$agents_home"
  installed_at="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  {
    printf '{\n'
    printf '  "generated": "Generated from ai-config. Do not edit generated copies directly.",\n'
    printf '  "installedAt": "%s",\n' "$installed_at"
    printf '  "sourceRoot": "%s",\n' "$(json_escape "$root")"
    printf '  "agentsHome": "%s",\n' "$(json_escape "$agents_home")"
    printf '  "claudeHome": "%s",\n' "$(json_escape "$claude_home")"
    printf '  "codexHome": "%s",\n' "$(json_escape "$codex_home")"
    printf '  "operationCount": %s,\n' "${#operations[@]}"
    printf '  "operations": ['
    for i in "${!operations[@]}"; do
      IFS='|' read -r kind src dest mode <<< "${operations[$i]}"
      [[ "$i" -gt 0 ]] && printf ','
      printf '{"kind":"%s","source":"%s","destination":"%s","mode":"%s"}' \
        "$(json_escape "$kind")" "$(json_escape "$src")" "$(json_escape "$dest")" "$(json_escape "$mode")"
    done
    printf '],\n'
    printf '  "warnings": ['
    for i in "${!warnings[@]}"; do
      [[ "$i" -gt 0 ]] && printf ','
      printf '"%s"' "$(json_escape "${warnings[$i]}")"
    done
    printf ']\n'
    printf '}\n'
  } > "$root/install-state.json"
  cp "$root/install-state.json" "$agents_home/install-state.json"
fi

if [[ "$json" -eq 1 ]]; then
  printf '{"dryRun":%s,"force":%s,"agentsHome":"%s","operationCount":%s,"operations":[' \
    "$([[ "$dry_run" -eq 1 ]] && printf true || printf false)" \
    "$([[ "$force" -eq 1 ]] && printf true || printf false)" \
    "$(json_escape "$agents_home")" "${#operations[@]}"
  for i in "${!operations[@]}"; do
    IFS='|' read -r kind src dest mode <<< "${operations[$i]}"
    [[ "$i" -gt 0 ]] && printf ','
    printf '{"kind":"%s","source":"%s","destination":"%s","mode":"%s"}' \
      "$(json_escape "$kind")" "$(json_escape "$src")" "$(json_escape "$dest")" "$(json_escape "$mode")"
  done
  printf '],"warnings":['
  for i in "${!warnings[@]}"; do
    [[ "$i" -gt 0 ]] && printf ','
    printf '"%s"' "$(json_escape "${warnings[$i]}")"
  done
  printf ']}\n'
else
  printf '%s %s operations.\n' "$([[ "$dry_run" -eq 1 ]] && printf Planned || printf Installed)" "${#operations[@]}"
  printf 'Shared home: %s\n' "$agents_home"
  for op in "${operations[@]}"; do
    IFS='|' read -r kind src dest mode <<< "$op"
    printf -- '- %s [%s]: %s -> %s\n' "$kind" "$mode" "$src" "$dest"
  done
  for warning in "${warnings[@]}"; do
    printf 'Warning: %s\n' "$warning"
  done
fi
