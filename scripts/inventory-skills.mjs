#!/usr/bin/env node
// Print an audit-friendly inventory of local skills and their source records.

import { existsSync } from "node:fs";
import process from "node:process";
import {
  listSkillDirs,
  loadLock,
  parseFrontmatter,
  printJson,
  readText,
  sha256File,
} from "./lib/skills.mjs";

function parseArgs(argv) {
  const args = { json: false };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--json") args.json = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function help() {
  console.log("Usage: inventory-skills.mjs [--json]");
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

  const lock = await loadLock();
  const locked = lock?.skills && typeof lock.skills === "object" ? lock.skills : {};
  const rows = [];

  for (const skill of await listSkillDirs()) {
    const hasSkillMd = existsSync(skill.skillPath);
    let frontmatterName = null;
    let description = null;
    let currentHash = null;
    if (hasSkillMd) {
      const content = await readText(skill.skillPath);
      const frontmatter = parseFrontmatter(content);
      frontmatterName = frontmatter?.fields.name ?? null;
      description = frontmatter?.fields.description ?? null;
      currentHash = await sha256File(skill.skillPath);
    }

    const source = locked[skill.name] ?? null;
    const expectedHash = source?.computedHash ?? null;
    const hashStatus = expectedHash
      ? expectedHash.toLowerCase() === currentHash?.toLowerCase()
        ? "clean"
        : "modified"
      : "untracked";

    rows.push({
      name: skill.name,
      hasSkillMd,
      frontmatterName,
      description,
      sourceType: source?.sourceType ?? "untracked",
      source: source?.source ?? null,
      sourcePath: source?.skillPath ?? null,
      hashStatus,
      currentHash,
      expectedHash,
    });
  }

  if (args.json) {
    printJson({ skillCount: rows.length, skills: rows });
    return;
  }

  const nameWidth = Math.max(4, ...rows.map((row) => row.name.length));
  const typeWidth = Math.max(6, ...rows.map((row) => row.sourceType.length));
  console.log(`${"name".padEnd(nameWidth)}  ${"source".padEnd(typeWidth)}  hash       description`);
  console.log("-".repeat(nameWidth + typeWidth + 34));
  for (const row of rows) {
    console.log(
      `${row.name.padEnd(nameWidth)}  ${row.sourceType.padEnd(typeWidth)}  ${row.hashStatus.padEnd(10)} ${row.description ?? ""}`,
    );
  }
}

main().catch((err) => {
  console.error(`inventory-skills: ${err.message}`);
  process.exit(1);
});
