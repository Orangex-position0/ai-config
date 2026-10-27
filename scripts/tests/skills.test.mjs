import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { listSkillDirs, parseFrontmatter, parseYamlMapping } from '../lib/skills.mjs';
import { validateFrontmatter } from '../check-skills.mjs';

test('skill entrypoints use the exact portable SKILL.md filename', async () => {
  for (const skill of await listSkillDirs()) {
    assert.ok(fs.readdirSync(skill.dir).includes('SKILL.md'), `${skill.name}: expected exact filename SKILL.md`);
  }
});

for (const description of ['[unterminated', '"unterminated', 'value: invalid']) {
  test(`frontmatter rejects malformed YAML: ${description}`, () => {
    assert.throws(() => parseFrontmatter(`---\nname: example\ndescription: ${description}\n---\n`));
  });
}

test('frontmatter supports folded and literal YAML with chomping modifiers', () => {
  for (const marker of ['>', '>-', '|', '|-']) {
    const parsed = parseFrontmatter(`---\nname: example\ndescription: ${marker}\n  first line\n  second line\n---\n`);
    assert.equal(parsed.fields.name, 'example');
    assert.match(parsed.fields.description, /first line/);
    assert.match(parsed.fields.description, /second line/);
  }
});

test('frontmatter rejects duplicate keys and non-mapping documents', () => {
  assert.throws(() => parseFrontmatter('---\nname: first\nname: second\n---\n'));
  assert.throws(() => parseFrontmatter('---\n- item\n---\n'));
});

test('skill schema rejects non-string or whitespace-only descriptions', () => {
  for (const description of ['true', '123', '[]', '"   "', 'null']) {
    assert.notEqual(validateFrontmatter({ name: 'example' }, `---\nname: example\ndescription: ${description}\n---\n`).length, 0);
  }
  assert.deepEqual(validateFrontmatter({ name: 'example' }, '---\nname: example\ndescription: >-\n  valid multiline\n  description\n---\n'), []);
});

test('optional agent configuration accepts nested YAML and rejects malformed YAML', () => {
  assert.deepEqual(parseYamlMapping('interface:\n  display_name: Example\n'), { interface: { display_name: 'Example' } });
  assert.throws(() => parseYamlMapping('interface: [unterminated'));
});

test('skill validator runs through a directory alias', (t) => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-config-validator-'));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
  const alias = path.join(base, 'repo-alias');
  fs.symlinkSync(root, alias, process.platform === 'win32' ? 'junction' : 'dir');
  const result = spawnSync(process.execPath, [path.join(alias, 'scripts', 'check-skills.mjs'), '--help'], { encoding: 'utf8' });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^Usage: check-skills\.mjs/m);
});

test('CLI modules remain importable from stdin without running their entrypoints', () => {
  for (const relative of ['../lib/config-cli.mjs', '../check-skills.mjs']) {
    const moduleUrl = new URL(relative, import.meta.url).href;
    const result = spawnSync(process.execPath, ['--input-type=module', '-'], {
      input: `await import(${JSON.stringify(moduleUrl)}); process.stdout.write('imported');`, encoding: 'utf8',
    });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, 'imported');
  }
});
