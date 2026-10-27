import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseFrontmatter, parseYamlMapping } from '../lib/skills.mjs';
import { validateFrontmatter } from '../check-skills.mjs';

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
