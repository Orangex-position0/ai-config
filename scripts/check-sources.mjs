#!/usr/bin/env node
// Validate the skill source ledger without forcing every local skill to be tracked.

import { existsSync } from "node:fs";
import process from "node:process";
import {
  loadLock,
  listSkillDirs,
  printJson,
  sha256File,
} from "./lib/skills.mjs";

const HASH_RE = /^[a-fA-F0-9]{64}$/;
const SOURCE_TYPES = new Set(["github", "local", "mine", "external"]);

function parseArgs(argv) {
  const args = { json: false, strict: false, verifyHash: false };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--json") args.json = true;
    else if (arg === "--strict") args.strict = true;
    else if (arg === "--verify-hash") args.verifyHash = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function help() {
  console.log("Usage: check-sources.mjs [--json] [--strict] [--verify-hash]");
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv);
  } catch (err) {
    console.error(err.message);
    help();
    process.exit(2);
  }
  if (args.help) return help();

  const failures = [];
  const warnings = [];
  const skills = await listSkillDirs();
  const skillMap = new Map(skills.map((skill) => [skill.name, skill]));
  const lock = await loadLock();

  if (!lock) {
    failures.push("skills-lock.json is missing");
  } else {
    if (lock.version !== 1) failures.push("skills-lock.json: version must be 1");
    if (!lock.skills || typeof lock.skills !== "object" || Array.isArray(lock.skills)) {
      failures.push("skills-lock.json: skills must be an object");
    }
  }

  const locked = lock?.skills && typeof lock.skills === "object" && !Array.isArray(lock.skills)
    ? lock.skills
    : {};
  const tracked = new Set(Object.keys(locked));

  for (const [name, meta] of Object.entries(locked)) {
    const skill = skillMap.get(name);
    if (!skill) {
      failures.push(`${name}: tracked in skills-lock.json but missing from skills/`);
      continue;
    }
    if (!meta || typeof meta !== "object" || Array.isArray(meta)) {
      failures.push(`${name}: lock entry must be an object`);
      continue;
    }
    if (!meta.sourceType) {
      failures.push(`${name}: missing sourceType`);
    } else if (!SOURCE_TYPES.has(meta.sourceType)) {
      failures.push(`${name}: unknown sourceType "${meta.sourceType}"`);
    }
    if (meta.sourceType === "github" && !meta.source) {
      failures.push(`${name}: github source entry must include source`);
    }
    if (meta.sourceType === "github" && !meta.skillPath) {
      failures.push(`${name}: github source entry must include skillPath`);
    }
    if (meta.computedHash && !HASH_RE.test(meta.computedHash)) {
      failures.push(`${name}: computedHash must be a SHA-256 hex digest`);
    }
    if (args.verifyHash && meta.computedHash && existsSync(skill.skillPath)) {
      const currentHash = await sha256File(skill.skillPath);
      if (currentHash.toLowerCase() !== meta.computedHash.toLowerCase()) {
        failures.push(`${name}: local SKILL.md hash differs from skills-lock.json`);
      }
    }
  }

  const untracked = skills
    .map((skill) => skill.name)
    .filter((name) => !tracked.has(name));

  if (args.strict) {
    for (const name of untracked) {
      failures.push(`${name}: missing from skills-lock.json`);
    }
  } else if (untracked.length > 0) {
    warnings.push(`${untracked.length} skill(s) are not tracked in skills-lock.json`);
  }

  const result = {
    ok: failures.length === 0,
    skillCount: skills.length,
    trackedCount: tracked.size,
    untrackedCount: untracked.length,
    untracked,
    warnings,
    failures,
  };

  if (args.json) {
    printJson(result);
  } else {
    if (result.ok) {
      console.log(`source check passed (${tracked.size}/${skills.length} skills tracked).`);
    } else {
      console.log("source check failed:");
      for (const failure of failures) console.log(`- ${failure}`);
    }
    for (const warning of warnings) console.log(`warning: ${warning}`);
  }

  if (!result.ok) process.exit(1);
}

main().catch((err) => {
  console.error(`check-sources: ${err.message}`);
  process.exit(1);
});
