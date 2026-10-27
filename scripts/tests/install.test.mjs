import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { applyPlan, snapshot } from '../lib/config-cli.mjs';

const scripts = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const runners = process.env.TEST_RUNNERS?.split(',') ?? ['node'];

function fixture(t) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-config-test-'));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  const root = path.join(base, 'repo');
  fs.mkdirSync(root);
  fs.cpSync(scripts, path.join(root, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(root, 'rules'));
  fs.writeFileSync(path.join(root, 'rules', 'rule.md'), 'v1');
  fs.mkdirSync(path.join(root, 'skills', 'example'), { recursive: true });
  fs.writeFileSync(path.join(root, 'skills', 'example', 'SKILL.md'), 'example v1');
  fs.writeFileSync(path.join(root, 'CLAUDE.md'), 'v1');
  fs.writeFileSync(path.join(root, 'AGENTS.md'), 'v1');
  const env = {
    ...process.env,
    AGENTS_HOME: path.join(base, 'shared'),
    CLAUDE_HOME: path.join(base, 'claude'),
    CODEX_HOME: path.join(base, 'codex'),
  };
  return { base, root, env };
}

function run(f, runner, command, args = [], overrides = {}) {
  const env = { ...f.env, ...overrides };
  let executable, argv;
  if (runner === 'node') {
    executable = process.execPath;
    argv = [path.join(f.root, 'scripts', 'lib', 'config-cli.mjs'), command];
  } else if (runner === 'bash') {
    executable = process.env.TEST_BASH ?? 'bash';
    argv = [path.join(f.root, 'scripts', `${command}.sh`).replaceAll('\\', '/')];
  } else {
    executable = runner;
    argv = ['-NoProfile', '-File', path.join(f.root, 'scripts', `${command}.ps1`)];
  }
  const result = spawnSync(executable, [...argv, ...args], { env, encoding: 'utf8' });
  assert.ifError(result.error);
  return result;
}

function succeeds(result) {
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

for (const runner of runners) {
  test(`${runner}: fresh install, check and unchanged reinstall`, (t) => {
    const f = fixture(t);
    succeeds(run(f, runner, 'install', ['--json']));
    succeeds(run(f, runner, 'check', ['--json']));
    succeeds(run(f, runner, 'install'));
  });

  test(`${runner}: managed extra files block dry-run and execution without deletion`, (t) => {
    const f = fixture(t);
    succeeds(run(f, runner, 'install'));
    const extra = path.join(f.env.AGENTS_HOME, 'skills', 'example', 'user.md');
    fs.writeFileSync(extra, 'private rule');
    for (const args of [['--dry-run', '--json'], ['--json']]) {
      const result = run(f, runner, 'install', args);
      assert.equal(result.status, 1, result.stdout);
      assert.equal(JSON.parse(result.stdout).ok, false);
      assert.equal(fs.readFileSync(extra, 'utf8'), 'private rule');
    }
    succeeds(run(f, runner, 'install', ['--force']));
    assert.equal(fs.existsSync(extra), false);
  });

  test(`${runner}: source and destination overlap is refused even with force`, (t) => {
    const f = fixture(t);
    const result = run(f, runner, 'install', ['--force'], { AGENTS_HOME: f.root });
    assert.equal(result.status, 1, `${result.stdout}\n${result.stderr}`);
    assert.equal(fs.readFileSync(path.join(f.root, 'rules', 'rule.md'), 'utf8'), 'v1');
  });

  test(`${runner}: upgrades unchanged runtime files and copy projections`, (t) => {
    const f = fixture(t);
    succeeds(run(f, runner, 'install'));
    // 保留内容，把链接替换成复制投影，覆盖无链接权限的运行环境。
    const projection = path.join(f.env.CLAUDE_HOME, 'rules');
    if (fs.lstatSync(projection).isSymbolicLink()) {
      fs.unlinkSync(projection);
      fs.cpSync(path.join(f.root, 'rules'), projection, { recursive: true });
    }
    fs.writeFileSync(path.join(f.root, 'rules', 'rule.md'), 'v2');
    fs.writeFileSync(path.join(f.root, 'CLAUDE.md'), 'v2');
    succeeds(run(f, runner, 'install'));
    assert.equal(fs.readFileSync(path.join(projection, 'rule.md'), 'utf8'), 'v2');
    assert.equal(fs.readFileSync(path.join(f.env.CLAUDE_HOME, 'CLAUDE.md'), 'utf8'), 'v2');
    succeeds(run(f, runner, 'check'));
  });

  test(`${runner}: late conflict leaves earlier destinations untouched`, (t) => {
    const f = fixture(t);
    succeeds(run(f, runner, 'install'));
    fs.writeFileSync(path.join(f.env.CODEX_HOME, 'AGENTS.md'), 'user edit');
    fs.writeFileSync(path.join(f.root, 'rules', 'rule.md'), 'v2');
    assert.equal(run(f, runner, 'install').status, 1);
    assert.equal(fs.readFileSync(path.join(f.env.AGENTS_HOME, 'rules', 'rule.md'), 'utf8'), 'v1');
  });

  test(`${runner}: removed source is reported then safely pruned`, (t) => {
    const f = fixture(t);
    succeeds(run(f, runner, 'install'));
    fs.rmSync(path.join(f.root, 'rules'), { recursive: true });
    assert.equal(run(f, runner, 'check').status, 1);
    succeeds(run(f, runner, 'install'));
    assert.equal(fs.existsSync(path.join(f.env.AGENTS_HOME, 'rules', 'rule.md')), false);
    assert.equal(fs.existsSync(path.join(f.env.CLAUDE_HOME, 'rules', 'rule.md')), false);
    succeeds(run(f, runner, 'check'));
  });

  test(`${runner}: changing runtime home preserves the old home`, (t) => {
    const f = fixture(t);
    succeeds(run(f, runner, 'install'));
    const oldFile = path.join(f.env.CLAUDE_HOME, 'CLAUDE.md');
    fs.writeFileSync(oldFile, 'old home user edit');
    f.env.CLAUDE_HOME = path.join(f.base, 'new-claude');
    succeeds(run(f, runner, 'install'));
    assert.equal(fs.readFileSync(oldFile, 'utf8'), 'old home user edit');
    assert.equal(fs.readFileSync(path.join(f.env.CLAUDE_HOME, 'CLAUDE.md'), 'utf8'), 'v1');
    succeeds(run(f, runner, 'check'));
  });

  test(`${runner}: dry-run never creates destinations or state`, (t) => {
    const f = fixture(t);
    succeeds(run(f, runner, 'install', ['--dry-run', '--json']));
    assert.equal(fs.existsSync(f.env.AGENTS_HOME), false);
    assert.equal(fs.existsSync(f.env.CLAUDE_HOME), false);
    assert.equal(fs.existsSync(path.join(f.root, 'install-state.json')), false);
  });

  test(`${runner}: removed source with user changes is not pruned`, (t) => {
    const f = fixture(t);
    succeeds(run(f, runner, 'install'));
    fs.rmSync(path.join(f.root, 'rules'), { recursive: true });
    const userFile = path.join(f.env.AGENTS_HOME, 'rules', 'rule.md');
    fs.writeFileSync(userFile, 'keep');
    assert.equal(run(f, runner, 'install').status, 1);
    assert.equal(fs.readFileSync(userFile, 'utf8'), 'keep');
  });

  test(`${runner}: legacy migration preserves unrelated user content`, (t) => {
    const f = fixture(t);
    fs.mkdirSync(path.join(f.env.AGENTS_HOME, 'rules'), { recursive: true });
    const userFile = path.join(f.env.AGENTS_HOME, 'rules', 'user.md');
    fs.writeFileSync(userFile, 'keep');
    fs.writeFileSync(path.join(f.env.AGENTS_HOME, 'install-state.json'), JSON.stringify({
      generated: 'Generated from ai-config. Do not edit generated copies directly.', operations: [],
    }));
    succeeds(run(f, runner, 'install'));
    assert.equal(fs.readFileSync(userFile, 'utf8'), 'keep');
  });

  test(`${runner}: invalid arguments preserve exit code 2 and valid JSON`, (t) => {
    const f = fixture(t);
    const result = run(f, runner, 'install', ['--json', '--invalid']);
    assert.equal(result.status, 2);
    assert.equal(JSON.parse(result.stdout).ok, false);
  });

  test(`${runner}: hidden files and empty directories participate in drift checks`, (t) => {
    const f = fixture(t);
    succeeds(run(f, runner, 'install'));
    const hidden = path.join(f.env.AGENTS_HOME, 'skills', 'example', '.hidden');
    fs.writeFileSync(hidden, 'hidden data');
    if (process.platform === 'win32') {
      succeeds(spawnSync('attrib', ['+H', hidden], { encoding: 'utf8' }));
    }
    assert.equal(run(f, runner, 'check').status, 1);
    assert.equal(run(f, runner, 'install').status, 1);
    fs.rmSync(hidden);
    fs.mkdirSync(path.join(f.env.AGENTS_HOME, 'skills', 'example', 'empty'));
    assert.equal(run(f, runner, 'check').status, 1);
  });
}

test('transaction restores all replaced files and state after commit failure', (t) => {
  const f = fixture(t);
  const destinations = [path.join(f.base, 'first'), path.join(f.base, 'second')];
  for (const dest of destinations) fs.writeFileSync(dest, 'old');
  const source = path.join(f.base, 'source');
  fs.writeFileSync(source, 'new');
  const state = path.join(f.base, 'state.json');
  fs.writeFileSync(state, 'old state');
  const rename = fs.renameSync;
  let calls = 0;
  const injected = t.mock.method(fs, 'renameSync', (...args) => {
    if (++calls === 4) throw new Error('injected rename failure');
    return rename(...args);
  });
  assert.throws(() => applyPlan(
    destinations.map((destination) => ({ source, destination, mode: 'copy', kind: 'install-runtime-file' })),
    [state], () => ({ version: 2 }),
  ), /injected rename failure/);
  injected.mock.restore();
  for (const dest of destinations) assert.equal(fs.readFileSync(dest, 'utf8'), 'old');
  assert.equal(fs.readFileSync(state, 'utf8'), 'old state');
  assert.equal(fs.readdirSync(f.base).some((name) => name.startsWith('.ai-config-')), false);
});

test('snapshot handles tabs, unicode and delimiter characters without ambiguous serialization', (t) => {
  const f = fixture(t);
  const unusual = path.join(f.root, 'rules', process.platform === 'win32' ? '中文-name.md' : '中文|name\t.md');
  fs.writeFileSync(unusual, 'unique');
  const before = snapshot(path.join(f.root, 'rules'));
  fs.writeFileSync(unusual, 'changed');
  assert.notDeepEqual(snapshot(path.join(f.root, 'rules')), before);
});

test('legacy state without hashes preserves resources absent from source', (t) => {
  const f = fixture(t);
  fs.mkdirSync(f.env.AGENTS_HOME);
  const oldRules = path.join(f.env.AGENTS_HOME, 'rules');
  fs.mkdirSync(oldRules);
  fs.writeFileSync(path.join(oldRules, 'rule.md'), 'old data');
  fs.writeFileSync(path.join(f.env.AGENTS_HOME, 'install-state.json'), JSON.stringify({
    generated: 'Generated from ai-config. Do not edit generated copies directly.',
    operations: [{ kind: 'install-shared-dir', destination: oldRules }],
  }));
  fs.rmSync(path.join(f.root, 'rules'), { recursive: true });
  const checked = run(f, 'node', 'check', ['--json']);
  assert.equal(checked.status, 1);
  assert.equal(JSON.parse(checked.stdout).failures.some((failure) => failure.startsWith('stale:')), false);
  succeeds(run(f, 'node', 'install'));
  assert.equal(fs.readFileSync(path.join(oldRules, 'rule.md'), 'utf8'), 'old data');
});

test('snapshot includes filenames that coincide with object prototype properties', (t) => {
  const f = fixture(t);
  const file = path.join(f.root, 'rules', '__proto__');
  fs.writeFileSync(file, 'tracked');
  assert.equal(snapshot(path.join(f.root, 'rules'))['__proto__'].type, 'file');
});

test('canonical paths reject source aliases and nested runtime homes', (t) => {
  const f = fixture(t);
  const alias = path.join(f.base, 'source-alias');
  fs.symlinkSync(f.root, alias, process.platform === 'win32' ? 'junction' : 'dir');
  assert.equal(run(f, 'node', 'install', ['--force'], { AGENTS_HOME: alias }).status, 1);
  assert.equal(run(f, 'node', 'install', ['--force'], { CODEX_HOME: path.join(f.env.AGENTS_HOME, 'nested') }).status, 1);
  assert.equal(fs.readFileSync(path.join(f.root, 'rules', 'rule.md'), 'utf8'), 'v1');
});

test('state cannot authorize writes outside known resource destinations', (t) => {
  const f = fixture(t);
  succeeds(run(f, 'node', 'install'));
  const outside = path.join(f.base, 'keep.md');
  fs.writeFileSync(outside, 'user data');
  const stateFile = path.join(f.env.AGENTS_HOME, 'install-state.json');
  const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  state.entries.push({ destination: outside, snapshot: snapshot(outside) });
  fs.writeFileSync(stateFile, JSON.stringify(state));
  assert.equal(run(f, 'node', 'install', ['--force']).status, 1);
  assert.equal(fs.readFileSync(outside, 'utf8'), 'user data');
});

test('link permission failure falls back to an actual copy with matching content', (t) => {
  const f = fixture(t);
  const copySource = path.join(f.root, 'rules');
  const destination = path.join(f.base, 'projection');
  const op = {
    kind: 'project-unit', mode: 'link', source: path.join(f.base, 'future-shared'),
    copySource, destination, snapshot: snapshot(copySource),
  };
  const injected = t.mock.method(fs, 'symlinkSync', () => {
    throw Object.assign(new Error('link permission denied'), { code: 'EPERM' });
  });
  applyPlan([op], [], () => ({}));
  injected.mock.restore();
  assert.equal(op.mode, 'copy-fallback');
  assert.equal(fs.lstatSync(destination).isSymbolicLink(), false);
  assert.deepEqual(snapshot(destination), snapshot(copySource));
});

for (const runner of runners) {
  test(`${runner}: legacy migration preserves system and independent skills without force`, (t) => {
    const f = fixture(t);
    fs.mkdirSync(path.join(f.root, 'skills', 'example'), { recursive: true });
    fs.writeFileSync(path.join(f.root, 'skills', 'example', 'SKILL.md'), 'example');
    fs.mkdirSync(f.env.AGENTS_HOME, { recursive: true });
    fs.cpSync(path.join(f.root, 'skills'), path.join(f.env.AGENTS_HOME, 'skills'), { recursive: true });
    for (const name of ['.system', 'independent']) {
      fs.mkdirSync(path.join(f.env.AGENTS_HOME, 'skills', name));
      fs.writeFileSync(path.join(f.env.AGENTS_HOME, 'skills', name, 'keep.md'), 'keep');
    }
    fs.writeFileSync(path.join(f.env.AGENTS_HOME, 'install-state.json'), JSON.stringify({
      generated: 'Generated from ai-config. Do not edit generated copies directly.', operations: [],
    }));
    succeeds(run(f, runner, 'install', ['--dry-run']));
    succeeds(run(f, runner, 'install'));
    succeeds(run(f, runner, 'check'));
    fs.writeFileSync(path.join(f.env.AGENTS_HOME, 'rules', 'foreign.md'), 'keep');
    fs.writeFileSync(path.join(f.env.AGENTS_HOME, 'rules', 'rule.md'), 'user edit');
    succeeds(run(f, runner, 'install', ['--force']));
    assert.equal(fs.readFileSync(path.join(f.env.AGENTS_HOME, 'rules', 'foreign.md'), 'utf8'), 'keep');
    for (const name of ['.system', 'independent']) {
      assert.equal(fs.readFileSync(path.join(f.env.AGENTS_HOME, 'skills', name, 'keep.md'), 'utf8'), 'keep');
    }
    fs.rmSync(path.join(f.root, 'skills', 'example'), { recursive: true });
    assert.equal(run(f, runner, 'check').status, 1);
    succeeds(run(f, runner, 'install'));
    assert.equal(fs.existsSync(path.join(f.env.AGENTS_HOME, 'skills', 'example')), false);
    assert.equal(fs.existsSync(path.join(f.env.AGENTS_HOME, 'skills', '.system', 'keep.md')), true);
    succeeds(run(f, runner, 'check'));
  });

  test(`${runner}: conflicting legacy resource names the actual resource`, (t) => {
    const f = fixture(t);
    fs.mkdirSync(path.join(f.env.AGENTS_HOME, 'rules'), { recursive: true });
    fs.writeFileSync(path.join(f.env.AGENTS_HOME, 'rules', 'rule.md'), 'user edit');
    const result = run(f, runner, 'install', ['--json']);
    assert.equal(result.status, 1);
    assert.ok(JSON.parse(result.stdout).failures.some((s) => s.includes('rule.md')));
    assert.equal(fs.readFileSync(path.join(f.env.AGENTS_HOME, 'rules', 'rule.md'), 'utf8'), 'user edit');
  });
}

test('target edits after preflight are preserved instead of overwritten', (t) => {
  const f = fixture(t);
  const source = path.join(f.base, 'source'), destination = path.join(f.base, 'target');
  fs.writeFileSync(source, 'new'); fs.writeFileSync(destination, 'old');
  const op = { source, destination, kind: 'install-runtime-file', mode: 'copy', snapshot: snapshot(source), expected: snapshot(destination) };
  assert.throws(() => applyPlan([op], [], () => {
    fs.writeFileSync(destination, 'concurrent user edit');
    return {};
  }), /changed|preflight/i);
  assert.equal(fs.readFileSync(destination, 'utf8'), 'concurrent user edit');
});

test('changed source cannot install contents inconsistent with the recorded snapshot', (t) => {
  const f = fixture(t);
  const source = path.join(f.base, 'source'), destination = path.join(f.base, 'target');
  fs.writeFileSync(source, 'planned'); fs.writeFileSync(destination, 'old');
  const op = { source, destination, kind: 'install-runtime-file', mode: 'copy', snapshot: snapshot(source) };
  fs.writeFileSync(source, 'changed before staging');
  assert.throws(() => applyPlan([op], [], () => ({})), /changed|snapshot/i);
  assert.equal(fs.readFileSync(destination, 'utf8'), 'old');
});

test('successful commit reports cleanup failure as a warning', (t) => {
  const f = fixture(t);
  const source = path.join(f.base, 'source'), destination = path.join(f.base, 'target');
  fs.writeFileSync(source, 'new'); fs.writeFileSync(destination, 'old');
  const remove = fs.rmSync;
  const injected = t.mock.method(fs, 'rmSync', (file, options) => {
    if (path.basename(file).startsWith('.ai-config-')) throw new Error('injected cleanup failure');
    return remove(file, options);
  });
  const result = applyPlan([{ source, destination, kind: 'install-runtime-file', mode: 'copy', snapshot: snapshot(source) }], [], () => ({}));
  injected.mock.restore();
  assert.equal(fs.readFileSync(destination, 'utf8'), 'new');
  assert.ok(result.warnings.some((warning) => warning.includes('cleanup') && warning.includes('.ai-config-')));
});

test('an existing installation lock blocks mutation and is not removed', (t) => {
  const f = fixture(t);
  fs.mkdirSync(f.env.AGENTS_HOME);
  const lock = path.join(f.env.AGENTS_HOME, '.ai-config-install.lock');
  fs.writeFileSync(lock, 'other installer');
  const result = run(f, 'node', 'install', ['--json']);
  assert.equal(result.status, 1);
  assert.match(JSON.parse(result.stdout).failures.join(' '), /lock/i);
  assert.equal(fs.readFileSync(lock, 'utf8'), 'other installer');
  assert.equal(fs.existsSync(path.join(f.env.AGENTS_HOME, 'rules', 'rule.md')), false);
  assert.equal(fs.existsSync(path.join(f.root, '.ai-config-install.lock')), false);
});

function oldV2(f, copyRuntime) {
  const homes = {};
  for (const [label, key] of [['agents', 'AGENTS_HOME'], ['claude', 'CLAUDE_HOME'], ['codex', 'CODEX_HOME']]) {
    fs.mkdirSync(f.env[key], { recursive: true }); homes[label] = fs.realpathSync.native(f.env[key]);
  }
  const entries = [];
  for (const rel of ['rules', 'skills']) {
    const source = path.join(f.root, rel), shared = path.join(homes.agents, rel);
    fs.cpSync(source, shared, { recursive: true });
    entries.push({ kind: 'install-shared-dir', destination: shared, snapshot: snapshot(shared) });
    for (const label of ['claude', 'codex']) {
      const destination = path.join(homes[label], rel);
      if (copyRuntime) fs.cpSync(source, destination, { recursive: true });
      else fs.symlinkSync(shared, destination, process.platform === 'win32' ? 'junction' : 'dir');
      entries.push({ kind: 'project-dir', destination, snapshot: snapshot(destination), contentSnapshot: snapshot(source) });
    }
  }
  fs.writeFileSync(path.join(homes.agents, 'install-state.json'), JSON.stringify({ version: 2,
    agentsHome: homes.agents, claudeHome: homes.claude, codexHome: homes.codex, entries }));
}

for (const copyRuntime of [false, true]) {
  test(`v2 directory snapshots migrate with ${copyRuntime ? 'copied' : 'linked'} runtime containers`, (t) => {
    const f = fixture(t); oldV2(f, copyRuntime);
    for (const home of [f.env.AGENTS_HOME, ...(copyRuntime ? [f.env.CLAUDE_HOME, f.env.CODEX_HOME] : [])]) {
      fs.mkdirSync(path.join(home, 'skills', '.system'));
      fs.writeFileSync(path.join(home, 'skills', '.system', 'keep'), 'system');
    }
    fs.writeFileSync(path.join(f.root, 'rules', 'rule.md'), 'v2');
    succeeds(run(f, 'node', 'install'));
    const state = JSON.parse(fs.readFileSync(path.join(f.env.AGENTS_HOME, 'install-state.json'), 'utf8'));
    assert.equal(state.version, 3);
    assert.equal(state.entries.some((entry) => entry.destination.includes(`${path.sep}.system`)), false);
    assert.equal(fs.readFileSync(path.join(f.env.CLAUDE_HOME, 'rules', 'rule.md'), 'utf8'), 'v2');
    succeeds(run(f, 'node', 'check'));
    fs.rmSync(path.join(f.root, 'skills', 'example'), { recursive: true });
    succeeds(run(f, 'node', 'install'));
    for (const home of [f.env.AGENTS_HOME, f.env.CLAUDE_HOME, f.env.CODEX_HOME]) {
      assert.equal(fs.existsSync(path.join(home, 'skills', 'example')), false);
      assert.equal(fs.readFileSync(path.join(home, 'skills', '.system', 'keep'), 'utf8'), 'system');
    }
    succeeds(run(f, 'node', 'check'));
  });
}

test('mid-commit target edits trigger rollback without deleting the external edit', (t) => {
  const f = fixture(t), source = path.join(f.base, 'source'); fs.writeFileSync(source, 'new');
  const destinations = ['first', 'second'].map((name) => path.join(f.base, name));
  for (const dest of destinations) fs.writeFileSync(dest, 'old');
  const ops = destinations.map((destination) => ({ source, destination, snapshot: snapshot(source), expected: snapshot(destination), mode: 'copy', kind: 'install-runtime-file' }));
  const rename = fs.renameSync;
  const injected = t.mock.method(fs, 'renameSync', (from, to) => {
    rename(from, to);
    if (to === destinations[0]) fs.writeFileSync(destinations[1], 'external edit');
  });
  assert.throws(() => applyPlan(ops, [], () => ({})), /changed after preflight/);
  injected.mock.restore();
  assert.equal(fs.readFileSync(destinations[0], 'utf8'), 'old');
  assert.equal(fs.readFileSync(destinations[1], 'utf8'), 'external edit');
});

test('rollback refuses to discard an edit to an already-installed target', (t) => {
  const f = fixture(t), source = path.join(f.base, 'source'); fs.writeFileSync(source, 'new');
  const destinations = ['first', 'second'].map((name) => path.join(f.base, name));
  for (const dest of destinations) fs.writeFileSync(dest, 'old');
  const rename = fs.renameSync;
  const injected = t.mock.method(fs, 'renameSync', (from, to) => {
    if (to === destinations[1]) {
      fs.writeFileSync(destinations[0], 'external edit'); throw new Error('injected failure');
    }
    rename(from, to);
  });
  assert.throws(() => applyPlan(destinations.map((destination) => ({ source, destination, mode: 'copy', kind: 'install-runtime-file' })), [], () => ({})), /rollback backups retained/);
  injected.mock.restore();
  assert.equal(fs.readFileSync(destinations[0], 'utf8'), 'external edit');
  const backups = fs.readdirSync(f.base).filter((name) => name.startsWith('.ai-config-'));
  assert.ok(backups.some((name) => fs.existsSync(path.join(f.base, name, 'backup'))));
});

test('concurrent installers sharing either source or runtime homes are serialized', { timeout: 20000 }, async (t) => {
  const f = fixture(t), other = fixture(t);
  const ready = path.join(f.base, 'ready'), release = path.join(f.base, 'release');
  const childFile = path.join(f.base, 'hold.mjs');
  fs.writeFileSync(childFile, `
    import fs from 'node:fs';
    import { main } from ${JSON.stringify(pathToFileURL(path.join(f.root, 'scripts', 'lib', 'config-cli.mjs')).href)};
    const copy = fs.cpSync;
    let waiting = false;
    fs.cpSync = (...args) => {
      if (!waiting) {
        waiting = true;
        fs.writeFileSync(${JSON.stringify(ready)}, 'locked');
        const deadline = Date.now() + 15000;
        while (!fs.existsSync(${JSON.stringify(release)})) {
          if (Date.now() > deadline) throw new Error('barrier timeout');
          Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 20);
        }
      }
      return copy(...args);
    };
    process.exitCode = main(['install', '--json'], ${JSON.stringify(f.root)});
  `);
  const child = spawn(process.execPath, [childFile], { env: f.env, stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  child.stdout.on('data', (data) => { output += data; }); child.stderr.on('data', (data) => { output += data; });
  const finished = new Promise((resolve, reject) => { child.on('exit', resolve); child.on('error', reject); });
  t.after(() => { if (child.exitCode === null) child.kill(); });
  const deadline = Date.now() + 10000;
  while (!fs.existsSync(ready)) {
    assert.equal(child.exitCode, null, output);
    assert.ok(Date.now() < deadline, `lock barrier not reached: ${output}`);
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  try {
    for (const [target, overrides] of [[f, {}], [other, { CLAUDE_HOME: f.env.CLAUDE_HOME, CODEX_HOME: f.env.CODEX_HOME }]]) {
      const result = run(target, 'node', 'install', ['--json'], overrides);
      assert.equal(result.status, 1, result.stdout);
      assert.match(JSON.parse(result.stdout).failures.join(' '), /lock/i);
    }
  } finally { fs.writeFileSync(release, 'continue'); }
  assert.equal(await finished, 0, output);
  succeeds(run(f, 'node', 'check'));
  for (const home of [f.root, ...['AGENTS_HOME', 'CLAUDE_HOME', 'CODEX_HOME'].map((key) => f.env[key])]) {
    assert.equal(fs.existsSync(path.join(home, '.ai-config-install.lock')), false);
  }
});

test('replacing an old container link with a directory never authorizes removing that directory', (t) => {
  const f = fixture(t); oldV2(f, false);
  succeeds(run(f, 'node', 'install'));
  const container = path.join(f.env.CLAUDE_HOME, 'skills');
  fs.unlinkSync(container);
  fs.cpSync(path.join(f.root, 'skills'), container, { recursive: true });
  fs.mkdirSync(path.join(container, '.system')); fs.writeFileSync(path.join(container, '.system', 'keep'), 'system');
  fs.writeFileSync(path.join(f.root, 'skills', 'example', 'SKILL.md'), 'updated');
  succeeds(run(f, 'node', 'install', ['--force']));
  assert.equal(fs.readFileSync(path.join(container, '.system', 'keep'), 'utf8'), 'system');
  assert.equal(fs.readFileSync(path.join(container, 'example', 'SKILL.md'), 'utf8'), 'updated');
  succeeds(run(f, 'node', 'check'));
});

test('nested rule files are managed individually and local tool settings are not exported', (t) => {
  const f = fixture(t);
  fs.mkdirSync(path.join(f.root, 'rules', 'common'));
  fs.writeFileSync(path.join(f.root, 'rules', 'common', 'managed.md'), 'rule');
  fs.mkdirSync(path.join(f.root, 'rules', '.claude'));
  fs.writeFileSync(path.join(f.root, 'rules', '.claude', 'settings.local.json'), 'local only');
  oldV2(f, true);
  const foreign = path.join(f.env.AGENTS_HOME, 'rules', 'common', 'foreign.md');
  fs.writeFileSync(foreign, 'keep');
  succeeds(run(f, 'node', 'install', ['--force']));
  assert.equal(fs.readFileSync(foreign, 'utf8'), 'keep');
  // 旧安装已经存在的本地配置保留，但不登记为本仓库所有。
  let state = JSON.parse(fs.readFileSync(path.join(f.env.AGENTS_HOME, 'install-state.json'), 'utf8'));
  assert.equal(state.entries.some((entry) => entry.destination.includes('settings.local.json')), false);
  fs.rmSync(path.join(f.root, 'rules', 'common', 'managed.md'));
  succeeds(run(f, 'node', 'install'));
  assert.equal(fs.existsSync(path.join(f.env.AGENTS_HOME, 'rules', 'common', 'managed.md')), false);
  assert.equal(fs.readFileSync(foreign, 'utf8'), 'keep');
  const fresh = fixture(t);
  fs.mkdirSync(path.join(fresh.root, 'rules', '.claude'));
  fs.writeFileSync(path.join(fresh.root, 'rules', '.claude', 'settings.local.json'), 'local only');
  succeeds(run(fresh, 'node', 'install'));
  assert.equal(fs.existsSync(path.join(fresh.env.AGENTS_HOME, 'rules', '.claude')), false);
});

test('changed destination parents cannot redirect commit or cleanup into unrelated directories', (t) => {
  const f = fixture(t), parent = path.join(f.base, 'parent'), moved = path.join(f.base, 'moved'), outside = path.join(f.base, 'outside');
  fs.mkdirSync(parent); fs.mkdirSync(outside);
  const source = path.join(f.base, 'source'), destination = path.join(parent, 'target');
  fs.writeFileSync(source, 'new'); fs.writeFileSync(destination, 'old');
  let trap;
  assert.throws(() => applyPlan([{ source, destination, mode: 'copy', kind: 'install-runtime-file', snapshot: snapshot(source) }], [], () => {
    const temp = fs.readdirSync(parent).find((name) => name.startsWith('.ai-config-'));
    fs.renameSync(parent, moved);
    fs.symlinkSync(outside, parent, process.platform === 'win32' ? 'junction' : 'dir');
    trap = path.join(outside, temp); fs.mkdirSync(trap); fs.writeFileSync(path.join(trap, 'keep'), 'keep');
    return {};
  }), /changed after preflight/);
  assert.equal(fs.readFileSync(path.join(trap, 'keep'), 'utf8'), 'keep');
  assert.equal(fs.readFileSync(path.join(moved, 'target'), 'utf8'), 'old');
  assert.equal(fs.existsSync(path.join(outside, 'target')), false);
});

for (const runner of runners) {
  test(`${runner}: directory aliases execute CLI commands instead of silently succeeding`, (t) => {
    const f = fixture(t), alias = path.join(f.base, 'repo-alias');
    fs.symlinkSync(f.root, alias, process.platform === 'win32' ? 'junction' : 'dir');
    const aliased = { ...f, root: alias };
    const installed = run(aliased, runner, 'install', ['--json']);
    succeeds(installed);
    assert.notEqual(installed.stdout.trim(), '', 'CLI returned success without executing main through a directory alias');
    assert.equal(JSON.parse(installed.stdout).ok, true);
    assert.equal(fs.readFileSync(path.join(f.env.AGENTS_HOME, 'rules', 'rule.md'), 'utf8'), 'v1');
    assert.equal(fs.readFileSync(path.join(f.env.CLAUDE_HOME, 'skills', 'example', 'SKILL.md'), 'utf8'), 'example v1');
    const checked = run(aliased, runner, 'check', ['--json']);
    succeeds(checked);
    assert.equal(JSON.parse(checked.stdout).ok, true);
    fs.writeFileSync(path.join(f.env.AGENTS_HOME, 'rules', 'rule.md'), 'external edit');
    const conflict = run(aliased, runner, 'install', ['--dry-run', '--json']);
    assert.equal(conflict.status, 1, conflict.stdout);
    assert.equal(JSON.parse(conflict.stdout).ok, false);
    assert.equal(fs.readFileSync(path.join(f.env.AGENTS_HOME, 'rules', 'rule.md'), 'utf8'), 'external edit');
  });
}
