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
agents_home="${AGENTS_HOME:-$HOME/.agents}"
claude_home="${CLAUDE_HOME:-$HOME/.claude}"
codex_home="${CODEX_HOME:-$HOME/.codex}"
failures=()
warnings=()
modes=()
shared_dirs=(rules skills agents commands templates assets references)
helper_scripts=(scripts/inline-template.mjs scripts/export-resume-pdf.mjs)

json_escape() {
  local s="$1"
  s=${s//\\/\\\\}
  s=${s//\"/\\\"}
  s=${s//$'\n'/\\n}
  printf '%s' "$s"
}

same_dir() {
  local src="$1" dest="$2"
  [[ -d "$src" && -d "$dest" ]] || return 1
  diff -qr "$src" "$dest" >/dev/null 2>&1
}

check_pair() {
  local rel="$1" dest_root="$2" dest_rel="${3:-$1}"
  local src dest
  src="$root/$rel"
  dest="$dest_root/$dest_rel"
  [[ -d "$src" ]] || return 0
  if [[ ! -d "$dest" ]]; then
    failures+=("missing: $dest")
  elif ! same_dir "$src" "$dest"; then
    failures+=("drift: $dest")
  fi
}

check_file_pair() {
  local rel="$1" dest="$2" src
  src="$root/$rel"
  [[ -f "$src" ]] || return 0
  if [[ ! -f "$dest" ]]; then
    failures+=("missing: $dest")
  elif ! cmp -s "$src" "$dest"; then
    failures+=("drift: $dest")
  fi
}

check_shared() {
  for dir in "${shared_dirs[@]}"; do
    if [[ "$dir" == "agents" && ! -d "$root/agents" && -d "$root/agent" ]]; then
      check_pair "agent" "$agents_home" "agents"
    else
      check_pair "$dir" "$agents_home"
    fi
  done
  for helper in "${helper_scripts[@]}"; do
    check_file_pair "$helper" "$agents_home/$helper"
  done
}

check_projection_dir() {
  local rel="$1" runtime_home="$2" label="$3"
  local src dest
  src="$agents_home/$rel"
  dest="$runtime_home/$rel"
  [[ -d "$src" ]] || return 0
  if [[ -L "$dest" ]]; then
    local target
    target="$(readlink "$dest" || true)"
    if [[ "$target" == "$src" ]]; then
      modes+=("$label:$rel:symlink")
      return 0
    fi
  fi
  if [[ ! -d "$dest" ]]; then
    failures+=("missing: $dest")
  elif same_dir "$src" "$dest"; then
    modes+=("$label:$rel:copy")
    warnings+=("copy fallback projection detected: $dest")
  else
    failures+=("drift: $dest")
  fi
}

check_projection() {
  local runtime_home="$1" label="$2"
  for dir in "${shared_dirs[@]}" scripts; do
    check_projection_dir "$dir" "$runtime_home" "$label"
  done
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

check_hardcoded_runtime_paths() {
  while IFS= read -r match; do
    [[ -n "$match" ]] || continue
    warnings+=("runtime-specific path reference: $match")
  done < <(grep -RInE '~/(\.claude|\.codex)/' "$root/skills" "$root/rules" --include='*.md' 2>/dev/null || true)
}

check_skill_readme_links
check_shared
check_projection "$claude_home" "claude"
check_projection "$codex_home" "codex"
check_file_pair "CLAUDE.md" "$claude_home/CLAUDE.md"
check_file_pair "AGENTS.md" "$codex_home/AGENTS.md"
check_hardcoded_runtime_paths

if [[ "$json" -eq 1 ]]; then
  printf '{"ok":%s,"agentsHome":"%s","failures":[' "$([[ "${#failures[@]}" -eq 0 ]] && printf true || printf false)" "$(json_escape "$agents_home")"
  for i in "${!failures[@]}"; do
    [[ "$i" -gt 0 ]] && printf ','
    printf '"%s"' "$(json_escape "${failures[$i]}")"
  done
  printf '],"warnings":['
  for i in "${!warnings[@]}"; do
    [[ "$i" -gt 0 ]] && printf ','
    printf '"%s"' "$(json_escape "${warnings[$i]}")"
  done
  printf '],"modes":['
  for i in "${!modes[@]}"; do
    [[ "$i" -gt 0 ]] && printf ','
    printf '"%s"' "$(json_escape "${modes[$i]}")"
  done
  printf ']}\n'
elif [[ "${#failures[@]}" -eq 0 ]]; then
  printf 'ai-config check passed.\n'
  for warning in "${warnings[@]}"; do
    printf 'Warning: %s\n' "$warning"
  done
else
  printf 'ai-config check failed:\n'
  for failure in "${failures[@]}"; do
    printf -- '- %s\n' "$failure"
  done
  for warning in "${warnings[@]}"; do
    printf 'Warning: %s\n' "$warning"
  done
fi

[[ "${#failures[@]}" -eq 0 ]]
