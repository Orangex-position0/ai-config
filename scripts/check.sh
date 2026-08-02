#!/usr/bin/env bash
set -euo pipefail

json=0

for arg in "$@"; do
  case "$arg" in
    --json) json=1 ;;
    --help|-h)
      printf 'Usage: check.sh [--json]\n'
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
failures=()

check_pair() {
  local rel="$1"
  local dest_root="$2"
  local dest_rel="${3:-$rel}"
  local src="$root/$rel"
  local dest="$dest_root/$dest_rel"

  [[ -d "$src" ]] || return 0

  if [[ ! -d "$dest" ]]; then
    failures+=("missing: $dest")
    return 0
  fi

  while IFS= read -r -d '' file; do
    local relative="${file#$src/}"
    local target="$dest/$relative"

    if [[ ! -f "$target" ]]; then
      failures+=("missing: $target")
      continue
    fi

    if ! cmp -s "$file" "$target"; then
      failures+=("drift: $target")
    fi
  done < <(find "$src" -type f -print0)
}

check_agents() {
  local dest_root="$1"

  if [[ -d "$root/agents" ]]; then
    check_pair "agents" "$dest_root" "agents"
  elif [[ -d "$root/agent" ]]; then
    check_pair "agent" "$dest_root" "agents"
  fi
}

check_file() {
  local rel="$1"
  local dest="$2"
  local src="$root/$rel"

  [[ -f "$src" ]] || return 0

  if [[ ! -f "$dest" ]]; then
    failures+=("missing: $dest")
  elif ! cmp -s "$src" "$dest"; then
    failures+=("drift: $dest")
  fi
}

check_skill_readme_links() {
  local readme="$root/skills/README.md"

  [[ -f "$readme" ]] || return 0

  while IFS= read -r skill; do
    [[ -n "$skill" ]] || continue
    if [[ ! -f "$root/skills/$skill/SKILL.md" ]]; then
      failures+=("missing skill: skills/$skill/SKILL.md referenced by skills/README.md")
    fi
  done < <(grep -oE '\]\(\./[^/)]+/SKILL\.md\)' "$readme" | sed -E 's#.*\./([^/]+)/SKILL\.md\)#\1#' | sort -u || true)
}

check_skill_readme_links

check_pair "rules" "$claude_home"
check_pair "skills" "$claude_home"
check_agents "$claude_home"
check_pair "commands" "$claude_home"
check_pair "templates" "$claude_home"
check_file "CLAUDE.md" "$claude_home/CLAUDE.md"

check_pair "rules" "$codex_home"
check_pair "skills" "$codex_home"
check_agents "$codex_home"
check_pair "commands" "$codex_home"
check_pair "templates" "$codex_home"
check_file "AGENTS.md" "$codex_home/AGENTS.md"

if [[ "$json" -eq 1 ]]; then
  if [[ "${#failures[@]}" -eq 0 ]]; then
    printf '{"ok":true,"failures":[]}\n'
  else
    printf '{"ok":false,"failures":['
    for i in "${!failures[@]}"; do
      [[ "$i" -gt 0 ]] && printf ','
      printf '"%s"' "${failures[$i]//\"/\\\"}"
    done
    printf ']}\n'
  fi
elif [[ "${#failures[@]}" -eq 0 ]]; then
  printf 'ai-config check passed.\n'
else
  printf 'ai-config check failed:\n'
  for failure in "${failures[@]}"; do
    printf -- '- %s\n' "$failure"
  done
fi

[[ "${#failures[@]}" -eq 0 ]]
