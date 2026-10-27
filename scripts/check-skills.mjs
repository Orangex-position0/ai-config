#!/usr/bin/env node
// Validate local skill structure and skills/README.md links.

import { existsSync, realpathSync } from "node:fs";
import process from "node:process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  REPO_ROOT,
  SKILLS_DIR,
  listSkillDirs,
  parseFrontmatter,
  parseYamlMapping,
  printJson,
  readText,
  relativeToRoot,
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
  console.log("Usage: check-skills.mjs [--json]");
}

export function validateFrontmatter(skill, content) {
  const failures = [];
  let frontmatter;
  try {
    frontmatter = parseFrontmatter(content);
  } catch (err) {
    return [`${skill.name}: invalid YAML frontmatter: ${err.message}`];
  }
  if (!frontmatter) {
    failures.push(`${skill.name}: SKILL.md is missing YAML frontmatter`);
    return failures;
  }

  const { fields } = frontmatter;
  if (typeof fields.name !== "string" || !fields.name.trim()) {
    failures.push(`${skill.name}: frontmatter missing name`);
  } else if (fields.name !== skill.name) {
    failures.push(`${skill.name}: frontmatter name "${fields.name}" does not match folder name`);
  }

  if (typeof fields.description !== "string" || !fields.description.trim()) {
    failures.push(`${skill.name}: frontmatter missing description`);
  }

  return failures;
}

async function validateReadmeLinks() {
  const failures = [];
  const readme = path.join(SKILLS_DIR, "README.md");
  if (!existsSync(readme)) return failures;

  const content = await readText(readme);
  const linkRe = /\]\(\.\/([^/)]+)\/([^)]*skill\.md)\)/gi;
  const seen = new Set();
  for (const match of content.matchAll(linkRe)) {
    const skillName = match[1];
    const target = match[2];
    const key = `${skillName}/${target}`;
    if (seen.has(key)) continue;
    seen.add(key);

    if (target !== "SKILL.md") {
      failures.push(`skills/README.md: ${skillName} link must target SKILL.md exactly, got ${target}`);
      continue;
    }

    const skillFile = path.join(SKILLS_DIR, skillName, "SKILL.md");
    if (!existsSync(skillFile)) {
      failures.push(`skills/README.md: missing linked skill ${skillName}/SKILL.md`);
    }
  }
  return failures;
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
  const skills = await listSkillDirs();

  for (const skill of skills) {
    if (!existsSync(skill.skillPath)) {
      failures.push(`${skill.name}: missing SKILL.md`);
      continue;
    }
    const content = await readText(skill.skillPath);
    failures.push(...validateFrontmatter(skill, content));
    const agentsYaml = path.join(skill.dir, "agents", "openai.yaml");
    if (existsSync(agentsYaml)) {
      try {
        parseYamlMapping(await readText(agentsYaml));
      } catch (err) {
        failures.push(`${skill.name}: invalid agents/openai.yaml: ${err.message}`);
      }
    }
  }
  failures.push(...(await validateReadmeLinks()));

  const result = {
    ok: failures.length === 0,
    skillCount: skills.length,
    root: relativeToRoot(REPO_ROOT),
    failures,
  };

  if (args.json) {
    printJson(result);
  } else if (result.ok) {
    console.log(`skill check passed (${skills.length} skills).`);
  } else {
    console.log("skill check failed:");
    for (const failure of failures) console.log(`- ${failure}`);
  }

  if (!result.ok) process.exit(1);
}

// 入口路径可能包含目录链接；不存在的 argv（例如 stdin 的 -）不能触发 CLI。
if (process.argv[1] && existsSync(process.argv[1]) &&
    realpathSync.native(fileURLToPath(import.meta.url)) === realpathSync.native(process.argv[1])) {
  main().catch((err) => {
    console.error(`check-skills: ${err.message}`);
    process.exitCode = 1;
  });
}
