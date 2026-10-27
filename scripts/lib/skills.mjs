import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parseDocument } from "yaml";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(here, "..", "..");
export const SKILLS_DIR = path.join(REPO_ROOT, "skills");
export const LOCK_PATH = path.join(REPO_ROOT, "skills-lock.json");

export async function listSkillDirs() {
  if (!existsSync(SKILLS_DIR)) return [];
  const entries = await readdir(SKILLS_DIR, { withFileTypes: true });
  const skills = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    const dir = path.join(SKILLS_DIR, entry.name);
    if (!(await hasAnyFile(dir))) continue;
    skills.push({
      name: entry.name,
      dir,
      skillPath: path.join(SKILLS_DIR, entry.name, "SKILL.md"),
    });
  }
  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

async function hasAnyFile(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile()) return true;
    if (entry.isDirectory() && (await hasAnyFile(path.join(dir, entry.name)))) {
      return true;
    }
  }
  return false;
}

export async function readText(file) {
  return readFile(file, "utf8");
}

export function parseYamlMapping(content) {
  const document = parseDocument(content, { uniqueKeys: true, strict: true });
  if (document.errors.length) throw new Error(document.errors.map((error) => error.message).join("; "));
  const fields = document.toJS({ maxAliasCount: 100 });
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    throw new Error("YAML must contain a mapping");
  }
  return fields;
}

export function parseFrontmatter(content) {
  const match = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(content);
  if (!match) return null;
  return { raw: match[1], fields: parseYamlMapping(match[1]) };
}

export async function sha256File(file) {
  const content = await readFile(file);
  return createHash("sha256").update(content).digest("hex");
}

export async function loadLock() {
  if (!existsSync(LOCK_PATH)) return null;
  const raw = await readText(LOCK_PATH);
  const parsed = JSON.parse(raw);
  return parsed;
}

export function normalizeSlash(value) {
  return value.replaceAll("\\", "/");
}

export function relativeToRoot(file) {
  return normalizeSlash(path.relative(REPO_ROOT, file));
}

export function printJson(value) {
  console.log(JSON.stringify(value, null, 2));
}
