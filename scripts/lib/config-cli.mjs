#!/usr/bin/env node
// 安装和检查共享同一份资源清单、路径防护与内容快照。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const sharedDirs = ['rules', 'skills', 'agents', 'commands', 'templates', 'assets', 'references', 'scripts'];
const fileScopes = new Set(['rules', 'agents', 'commands', 'scripts']);
const localDirs = new Set(['.git', '.claude', '.codex', '.pi', 'node_modules', '__pycache__']);
const helpers = ['inline-template.mjs', 'export-resume-pdf.mjs'];
const exists = (p) => { try { fs.lstatSync(p); return true; } catch (e) { if (e.code === 'ENOENT') return false; throw e; } };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const inside = (parent, child) => {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
};

function physical(p) {
  if (exists(p)) return fs.realpathSync.native(p);
  const parent = path.dirname(p);
  if (parent === p) return p;
  return path.join(physical(parent), path.basename(p));
}

export function snapshot(p) {
  if (!exists(p)) return null;
  const result = Object.create(null);
  function visit(file, relative) {
    const stat = fs.lstatSync(file);
    if (stat.isSymbolicLink()) {
      result[relative] = { type: 'link', target: path.resolve(path.dirname(file), fs.readlinkSync(file)) };
    } else if (stat.isDirectory()) {
      result[relative] = { type: 'directory' };
      for (const name of fs.readdirSync(file).sort()) visit(path.join(file, name), relative === '.' ? name : `${relative}/${name}`);
    } else if (stat.isFile()) {
      result[relative] = { type: 'file', hash: createHash('sha256').update(fs.readFileSync(file)).digest('hex') };
    } else {
      throw new Error(`Unsupported filesystem entry: ${file}`);
    }
  }
  visit(p, '.');
  return result;
}

function config(root, env) {
  root = physical(root);
  const homes = {
    agents: physical(path.resolve(env.AGENTS_HOME || path.join(os.homedir(), '.agents'))),
    claude: physical(path.resolve(env.CLAUDE_HOME || path.join(os.homedir(), '.claude'))),
    codex: physical(path.resolve(env.CODEX_HOME || path.join(os.homedir(), '.codex'))),
  };
  const paths = [root, ...Object.values(homes)].map(physical);
  for (let i = 1; i < paths.length; i++) {
    if (paths[i] === path.parse(paths[i]).root || paths[i] === physical(os.homedir())) {
      throw new Error(`Unsafe configuration home: ${paths[i]}`);
    }
    for (let j = 0; j < i; j++) {
      if (inside(paths[j], paths[i]) || inside(paths[i], paths[j])) {
        throw new Error(`Overlapping source/configuration paths: ${paths[j]} and ${paths[i]}`);
      }
    }
  }
  return { root, homes, statePath: path.join(homes.agents, 'install-state.json') };
}

// 所有权只落在资源单元，不包含共享容器本身。
function unitPath(home, destination) {
  const parts = path.relative(home, destination).split(path.sep);
  if (parts.length < 2 || !sharedDirs.includes(parts[0]) || parts.some((part) => !part || ['.', '..'].includes(part))) return false;
  if (!fileScopes.has(parts[0]) && parts.length !== 2) return false;
  if ((fileScopes.has(parts[0]) && parts.slice(1).some((part) => localDirs.has(part))) || (parts[0] === 'skills' && (parts[1] === '.system' || localDirs.has(parts[1])))) return false;
  return parts[0] !== 'scripts' || (parts.length === 2 && helpers.includes(parts[1]));
}

function sourceUnits(source, rel) {
  if (rel === 'scripts') return helpers.filter((name) => exists(path.join(source, name)));
  if (!fileScopes.has(rel)) return fs.readdirSync(source).sort().filter((name) => rel !== 'skills' || !localDirs.has(name));
  const units = [];
  function walk(dir, prefix) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
      if (localDirs.has(entry.name)) continue;
      const name = prefix ? path.join(prefix, entry.name) : entry.name;
      if (entry.isDirectory()) walk(path.join(dir, entry.name), name); else units.push(name);
    }
  }
  walk(source, '');
  return units;
}

function validEntry(entry, homes) {
  if (typeof entry.destination !== 'string' || !path.isAbsolute(entry.destination) || path.resolve(entry.destination) !== entry.destination || !entry.snapshot || typeof entry.snapshot !== 'object') return false;
  if (entry.kind === 'project-container') {
    return ['claude', 'codex'].some((label) => sharedDirs.some((rel) =>
      entry.destination === path.join(homes[label], rel) &&
      same(entry.snapshot, { '.': { type: 'link', target: path.join(homes.agents, rel) } })));
  }
  if (entry.kind === 'install-shared-unit') return unitPath(homes.agents, entry.destination);
  if (entry.kind === 'project-unit') return ['claude', 'codex'].some((label) => unitPath(homes[label], entry.destination));
  return entry.kind === 'install-runtime-file' && (entry.destination === path.join(homes.claude, 'CLAUDE.md') || entry.destination === path.join(homes.codex, 'AGENTS.md'));
}

function legacyDestinations(homes) {
  return [...Object.values(homes).flatMap((home) => sharedDirs.map((rel) => path.join(home, rel))),
    path.join(homes.claude, 'CLAUDE.md'), path.join(homes.codex, 'AGENTS.md')];
}

function childSnapshots(tree) {
  const children = new Map();
  for (const [key, value] of Object.entries(tree ?? {})) {
    if (key === '.') continue;
    const [name, ...rest] = key.split('/');
    if (!name || ['.', '..'].includes(name) || name.includes(String.fromCharCode(92))) throw new Error('Invalid snapshot path');
    if (!children.has(name)) children.set(name, Object.create(null));
    children.get(name)[rest.join('/') || '.'] = value;
  }
  return children;
}

function loadState(c) {
  if (!exists(c.statePath)) return { entries: [], legacy: false, preserved: [] };
  if (!fs.lstatSync(c.statePath).isFile()) throw new Error(`State must be a regular file: ${c.statePath}`);
  const state = JSON.parse(fs.readFileSync(c.statePath, 'utf8').replace(/^\uFEFF/, ''));
  if (state.version === undefined && Array.isArray(state.operations) && typeof state.generated === 'string' && state.generated.startsWith('Generated from ai-config.')) {
    // 无 hash 的旧记录不提供删除授权；逐项按当前源内容接管。
    return { entries: [], legacy: true, preserved: [] };
  }
  if (![2, 3].includes(state.version) || !Array.isArray(state.entries)) throw new Error(`Unsupported install state: ${c.statePath}`);
  const storedHomes = { agents: state.agentsHome, claude: state.claudeHome, codex: state.codexHome };
  if (!Object.values(storedHomes).every((home) => typeof home === 'string' && path.isAbsolute(home))) {
    throw new Error(`Invalid configuration homes in state: ${c.statePath}`);
  }
  const allowedOld = new Set(legacyDestinations(storedHomes));
  const seen = new Set();
  const entries = [], preserved = [];
  let detached = false;
  for (const entry of state.entries) {
    if (seen.has(entry.destination) || (state.version === 2 ?
      !allowedOld.has(entry.destination) || !entry.snapshot || typeof entry.snapshot !== 'object' : !validEntry(entry, storedHomes))) {
      throw new Error(`Invalid install-state entry: ${entry.destination}`);
    }
    seen.add(entry.destination);
    if (state.version === 3) {
      if (validEntry(entry, c.homes)) entries.push(entry); else detached = true;
      continue;
    }
    const rel = Object.values(storedHomes).flatMap((home) => sharedDirs.map((name) => ({ home, name })))
      .find(({ home, name }) => entry.destination === path.join(home, name));
    if (!rel) {
      if (validEntry(entry, c.homes)) entries.push(entry); else detached = true;
      continue;
    }
    if (!Object.values(c.homes).includes(rel.home)) { detached = true; continue; }
    const container = { kind: 'project-container', source: path.join(c.homes.agents, rel.name), destination: entry.destination,
      snapshot: { '.': { type: 'link', target: path.join(c.homes.agents, rel.name) } } };
    if (validEntry(container, c.homes) && same(snapshot(entry.destination), container.snapshot)) {
      entries.push(container);
      continue;
    }
    const tree = entry.snapshot['.']?.type === 'link' ? entry.contentSnapshot : entry.snapshot;
    const units = fileScopes.has(rel.name) ? Object.entries(tree ?? {}).filter(([key, value]) => key !== '.' && value.type !== 'directory').map(([key, value]) => [key.split('/').join(path.sep), { '.': value }]) : childSnapshots(tree);
    for (const [name, child] of units) {
      const converted = { ...entry, kind: rel.home === c.homes.agents ? 'install-shared-unit' : 'project-unit', destination: path.join(entry.destination, name), snapshot: child, contentSnapshot: child };
      if (validEntry(converted, c.homes)) entries.push(converted); else preserved.push(converted.destination);
    }
  }
  return { entries, legacy: false, migrated: state.version === 2, detached, preserved };
}

function resources(c) {
  const result = [];
  for (const rel of sharedDirs) {
    const sourceRel = rel === 'agents' && !exists(path.join(c.root, rel)) ? 'agent' : rel;
    const source = path.join(c.root, sourceRel);
    const shared = path.join(c.homes.agents, rel);
    const containers = new Set();
    // 已有正确的整目录投影只保留链接，不通过它写入或删除资源。
    for (const label of ['claude', 'codex']) {
      const destination = path.join(c.homes[label], rel);
      if (exists(destination) && fs.lstatSync(destination).isSymbolicLink()) {
        const actual = snapshot(destination);
        if (same(actual, { '.': { type: 'link', target: shared } })) {
          result.push({ kind: 'project-container', source: shared, destination, snapshot: actual, mode: 'link' });
          containers.add(label);
        } else if (exists(source)) throw new Error(`Unexpected container link: ${destination}; reconcile it before installing`);
      }
    }
    if (!exists(source)) continue;
    if (!fs.lstatSync(source).isDirectory()) throw new Error(`Source must be a real directory: ${source}`);
    const names = sourceUnits(source, rel);
    for (const name of names) {
      if (rel === 'skills' && name === '.system') throw new Error('skills/.system is reserved for system-managed skills');
      const unit = path.join(source, name), content = snapshot(unit);
      if (rel === 'scripts' && content['.'].type !== 'file') throw new Error(`Helper must be a regular file: ${unit}`);
      const destination = path.join(shared, name);
      result.push({ kind: 'install-shared-unit', source: unit, destination, snapshot: content });
      for (const label of ['claude', 'codex']) {
        if (!containers.has(label)) result.push({ kind: 'project-unit', source: destination, copySource: unit,
          destination: path.join(c.homes[label], rel, name), snapshot: content });
      }
    }
  }
  for (const [rel, label] of [['CLAUDE.md', 'claude'], ['AGENTS.md', 'codex']]) {
    const source = path.join(c.root, rel);
    if (!exists(source)) continue;
    const content = snapshot(source);
    if (content['.'].type !== 'file') throw new Error(`Runtime source must be a regular file: ${source}`);
    result.push({ kind: 'install-runtime-file', source, destination: path.join(c.homes[label], rel), snapshot: content });
  }
  if (!result.length) throw new Error('No installable resources found');
  return result;
}

function projected(op) { return op.kind === 'project-unit'; }

function linkMatches(actual, op) {
  if (!projected(op) || actual?.['.']?.type !== 'link') return false;
  return path.resolve(actual['.'].target) === path.resolve(op.source);
}

function protectParents(c, destination) {
  const home = Object.values(c.homes).find((p) => inside(p, destination));
  if (!home) throw new Error(`Destination outside configuration homes: ${destination}`);
  // 不能让嵌套父目录的链接把写操作导向配置 home 之外。
  let parent = path.dirname(destination);
  while (parent !== home) {
    if (exists(parent) && fs.lstatSync(parent).isSymbolicLink()) throw new Error(`Linked destination parent: ${parent}`);
    parent = path.dirname(parent);
  }
}

function planInstall(c, state, desired, force) {
  const previous = new Map(state.entries.map((entry) => [entry.destination, entry]));
  const desiredPaths = new Set(desired.map((op) => op.destination));
  const plan = [...desired, ...state.entries.filter((entry) => entry.kind !== 'project-container' && !desiredPaths.has(entry.destination)).map((entry) => ({ ...entry, kind: 'remove-stale', snapshot: null }))];
  const failures = [];
  for (const op of plan) {
    protectParents(c, op.destination);
    const actual = snapshot(op.destination);
    const prior = previous.get(op.destination);
    const matches = same(actual, op.snapshot) || linkMatches(actual, op);
    // 复制投影可以接替旧链接，反之亦然，但内容必须仍等于上次安装版本。
    const baseline = prior && (same(actual, prior.snapshot) || (projected(op) && same(actual, prior.contentSnapshot)));
    if (actual && !matches && !baseline && !force) failures.push(`Refusing to replace modified or unmanaged content: ${op.destination} (use --force)`);
    op.action = op.kind === 'remove-stale' ? (actual ? 'remove' : 'unchanged') : !actual ? 'create' : !matches ? 'update' : prior ? 'unchanged' : 'adopt';
    op.expected = actual;
    op.parentPhysical = physical(path.dirname(op.destination));
    op.unchanged = matches;
    if (projected(op)) {
      op.mode = actual?.['.']?.type === 'directory' || op.snapshot?.['.']?.type !== 'directory' ? 'copy' : 'link';
      if (linkMatches(actual, op)) op.snapshot = actual;
    } else {
      op.mode = op.kind === 'remove-stale' ? 'remove' : op.kind === 'project-container' ? 'link' : 'copy';
    }
  }
  return { plan, failures };
}

function copyResource(op, target) {
  fs.cpSync(op.copySource || op.source, target, { recursive: true, verbatimSymlinks: true });
}

// 每个实际写入位置都加锁，覆盖共享 home、runtime home 和仓库状态副本。
function installLocks(c, write) {
  const acquired = [], created = [], warnings = [];
  const locations = [c.root, ...Object.values(c.homes)].sort();
  function release() {
    for (const item of acquired.reverse()) {
      try {
        if (fs.readFileSync(item.file, 'utf8') !== item.token) throw new Error('lock ownership changed');
        fs.unlinkSync(item.file);
      } catch (e) { warnings.push(`Lock cleanup failed; inspect ${item.file}: ${e.message}`); }
    }
    for (const dir of created.reverse()) {
      try { fs.rmdirSync(dir); } catch {
        // 保留非空目录。
      }
    }
    return warnings;
  }
  try {
    for (const location of locations) {
      const file = path.join(location, '.ai-config-install.lock');
      if (!write) {
        if (exists(file)) throw new Error(`Install lock exists: ${file}; inspect the active installer before removing a stale lock`);
        continue;
      }
      const missing = [];
      let parent = location;
      while (!exists(parent)) { missing.push(parent); parent = path.dirname(parent); }
      for (const dir of missing.reverse()) { fs.mkdirSync(dir); created.push(dir); }
      let fd;
      try { fd = fs.openSync(file, 'wx'); } catch (e) {
        if (e.code === 'EEXIST') throw new Error(`Install lock exists: ${file}; inspect the active installer before removing a stale lock`);
        throw e;
      }
      const token = JSON.stringify({ id: randomUUID(), pid: process.pid, startedAt: new Date().toISOString(), sourceRoot: c.root });
      try { fs.writeFileSync(fd, token); } catch (e) {
        fs.closeSync(fd); fs.unlinkSync(file); throw e;
      }
      fs.closeSync(fd);
      acquired.push({ file, token });
    }
    return release;
  } catch (e) {
    const cleanup = release();
    throw new Error([e.message, ...cleanup].join('; '));
  }
}

// 所有替换先暂存并验证快照；提交前再次检查目标，失败时逆序恢复。
export function applyPlan(plan, stateFiles, makeState) {
  const staged = [], createdParents = [], warnings = [];
  function stage(destination, expected = snapshot(destination), parentPhysical = physical(path.dirname(destination))) {
    const missing = [];
    let parent = path.dirname(destination);
    while (!exists(parent)) { missing.push(parent); parent = path.dirname(parent); }
    for (const dir of missing.reverse()) { fs.mkdirSync(dir); createdParents.push(dir); }
    const temp = fs.mkdtempSync(path.join(path.dirname(destination), '.ai-config-'));
    const item = { destination, expected, parentPhysical, temp, value: path.join(temp, 'value'), backup: path.join(temp, 'backup'), installed: false, backedUp: false };
    staged.push(item);
    return item;
  }
  function verify(item) {
    if (physical(path.dirname(item.destination)) !== item.parentPhysical || !same(snapshot(item.destination), item.expected)) {
      throw new Error(`Destination changed after preflight: ${item.destination}; no overwrite authorized`);
    }
  }
  let committed = false, rollbackFailed = false, failure;
  // 状态文件同样参与预检，不能覆盖暂存期间出现的修改。
  const states = stateFiles.map((destination) => ({ destination, expected: snapshot(destination) }));
  try {
    const guards = plan.map((op) => ({ destination: op.destination,
      expected: Object.hasOwn(op, 'expected') ? op.expected : snapshot(op.destination),
      parentPhysical: op.parentPhysical ?? physical(path.dirname(op.destination)) }));
    for (const guard of guards) verify(guard);
    for (const [index, op] of plan.entries()) {
      if (op.unchanged) continue;
      const item = stage(op.destination, guards[index].expected, guards[index].parentPhysical);
      if (op.kind === 'remove-stale') continue;
      if (projected(op) && op.mode === 'link') {
        try {
          fs.symlinkSync(op.source, item.value, process.platform === 'win32' ? 'junction' : 'dir');
          op.snapshot = snapshot(item.value);
        } catch (e) {
          if (!['EPERM', 'EACCES', 'ENOSYS', 'ENOTSUP', 'EINVAL'].includes(e.code)) throw e;
          if (exists(item.value)) fs.rmSync(item.value, { recursive: true, force: true });
          op.mode = 'copy-fallback';
          copyResource(op, item.value);
        }
      } else copyResource(op, item.value);
      item.installedSnapshot = snapshot(item.value);
      if (op.snapshot && !same(item.installedSnapshot, op.snapshot)) throw new Error(`Source changed or staged snapshot mismatch: ${op.source}`);
    }
    const state = makeState();
    for (const { destination, expected } of states) {
      const item = stage(destination, expected);
      fs.writeFileSync(item.value, `${JSON.stringify(state, null, 2)}\n`);
      item.installedSnapshot = snapshot(item.value);
    }
    for (const guard of guards) verify(guard);
    for (const item of staged) verify(item);
    for (const item of staged) {
      verify(item);
      if (exists(item.destination)) { fs.renameSync(item.destination, item.backup); item.backedUp = true; }
      if (exists(item.value)) { fs.renameSync(item.value, item.destination); item.installed = true; }
    }
    committed = true;
  } catch (error) {
    const rollbackErrors = [];
    for (const item of [...staged].reverse()) {
      try {
        if ((item.installed || item.backedUp) && physical(path.dirname(item.destination)) !== item.parentPhysical) {
          throw new Error('destination parent changed externally; preserving backups');
        }
        if (item.installed) {
          if (!same(snapshot(item.destination), item.installedSnapshot)) throw new Error('installed target changed externally; preserving target and backup');
          fs.rmSync(item.destination, { recursive: true, force: true });
        }
        if (item.backedUp) {
          if (exists(item.destination)) throw new Error('new target appeared; preserving target and backup');
          fs.renameSync(item.backup, item.destination);
        }
      } catch (e) { rollbackFailed = true; rollbackErrors.push(`${item.temp}: ${e.message}`); }
    }
    failure = new Error(`${error.message}${rollbackErrors.length ? `; rollback backups retained: ${rollbackErrors.join('; ')}` : ''}`);
  } finally {
    if (!rollbackFailed) {
      for (const item of staged) {
        try {
          if (physical(path.dirname(item.destination)) !== item.parentPhysical) throw new Error('destination parent changed; refusing cleanup through it');
          fs.rmSync(item.temp, { recursive: true, force: true });
        } catch (e) {
          warnings.push(`Staging/backup cleanup failed; retained ${item.temp}: ${e.message}`);
        }
      }
      if (!committed) {
        for (const dir of createdParents.reverse()) {
          try { fs.rmdirSync(dir); } catch {
            // 非空目录保留。
          }
        }
      }
    }
  }
  if (failure) throw new Error([failure.message, ...warnings].join('; '));
  return { warnings };
}

function unmanagedResources(c, state, desired) {
  const known = new Set([...state.entries, ...desired].map((entry) => entry.destination));
  const preserved = new Set(state.preserved);
  for (const home of Object.values(c.homes)) {
    for (const rel of sharedDirs) {
      const container = path.join(home, rel);
      if (!exists(container) || !fs.lstatSync(container).isDirectory()) continue;
      function walk(dir) {
        for (const name of fs.readdirSync(dir).sort()) {
          const destination = path.join(dir, name);
          if (known.has(destination)) continue;
          if ([...known].some((file) => inside(destination, file)) && fs.lstatSync(destination).isDirectory()) walk(destination);
          else preserved.add(destination);
        }
      }
      walk(container);
    }
  }
  return [...preserved].sort();
}

function inspect(c, state, desired) {
  const failures = [], warnings = [], modes = [];
  const wanted = new Set(desired.map((op) => op.destination));
  for (const op of desired) {
    protectParents(c, op.destination);
    const actual = snapshot(op.destination);
    if (linkMatches(actual, op)) modes.push(`${op.destination}:link`);
    else if (!actual) failures.push(`missing: ${op.destination}`);
    else if (!same(actual, op.snapshot)) failures.push(`drift: ${op.destination}`);
    else if (projected(op)) {
      modes.push(`${op.destination}:copy`);
      if (op.snapshot['.'].type === 'directory') warnings.push(`directory copy projection detected: ${op.destination}`);
    }
  }
  for (const entry of state.entries) if (entry.kind !== 'project-container' && !wanted.has(entry.destination) && exists(entry.destination)) failures.push(`stale: ${entry.destination}`);
  if (state.legacy) warnings.push('Legacy state: adopting identical resources individually; unrelated resources are preserved.');
  if (state.detached) warnings.push('Configuration homes changed; previous destinations are preserved and no longer managed.');
  const readme = path.join(c.root, 'skills', 'README.md');
  if (exists(readme)) {
    for (const match of fs.readFileSync(readme, 'utf8').matchAll(/\]\(\.\/([^/)]+)\/SKILL\.md\)/g)) {
      if (!exists(path.join(c.root, 'skills', match[1], 'SKILL.md'))) failures.push(`missing skill: ${match[1]}/SKILL.md referenced by skills/README.md`);
    }
  }
  for (const rel of ['skills', 'rules']) {
    const base = path.join(c.root, rel);
    if (!exists(base)) continue;
    function walk(dir) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(file);
        else if (entry.isFile() && entry.name.endsWith('.md')) {
          fs.readFileSync(file, 'utf8').split(/\r?\n/).forEach((line, i) => {
            if (/~\/\.(claude|codex)\//.test(line)) warnings.push(`runtime-specific path reference: ${file}:${i + 1}:${line.trim()}`);
          });
        }
      }
    }
    walk(base);
  }
  return { ok: failures.length === 0, agentsHome: c.homes.agents, failures, warnings, modes, preserved: unmanagedResources(c, state, desired) };
}

export function main(argv = process.argv.slice(2), root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..'), env = process.env) {
  const [command, ...args] = argv;
  const json = args.includes('--json');
  let result, exitCode = 0;
  const maintenanceWarnings = [];
  try {
    if (!['install', 'check'].includes(command)) throw new Error(`Unknown command: ${command}`);
    const allowed = command === 'install' ? ['--json', '--dry-run', '--force', '--help', '-h'] : ['--json', '--help', '-h'];
    for (const arg of args) if (!allowed.includes(arg)) {
      exitCode = 2;
      throw new Error(`Unknown argument: ${arg}`);
    }
    if (args.includes('--help') || args.includes('-h')) {
      console.log(`Usage: ${command} [--json]${command === 'install' ? ' [--dry-run] [--force]' : ''}`);
      return 0;
    }
    const c = config(root, env);
    const release = installLocks(c, command === 'install' && !args.includes('--dry-run'));
    try {
      const state = loadState(c);
      const desired = resources(c);
      if (command === 'check') result = inspect(c, state, desired);
      else {
        const dryRun = args.includes('--dry-run'), force = args.includes('--force');
        const { plan, failures } = planInstall(c, state, desired, force);
        const preserved = unmanagedResources(c, state, desired);
        if (!failures.length && !dryRun) {
          const applied = applyPlan(plan, [path.join(root, 'install-state.json'), c.statePath], () => ({
            version: 3,
            generated: 'Generated from ai-config. Do not edit generated copies directly.',
            installedAt: new Date().toISOString(), sourceRoot: root,
            agentsHome: c.homes.agents, claudeHome: c.homes.claude, codexHome: c.homes.codex,
            entries: plan.filter((op) => op.kind !== 'remove-stale').map((op) => ({
              kind: op.kind, source: op.source, destination: op.destination, mode: op.mode,
              snapshot: op.snapshot,
              ...(projected(op) ? { contentSnapshot: desired.find((entry) => entry.destination === op.source)?.snapshot } : {}),
            })),
          }));
          maintenanceWarnings.push(...applied.warnings);
        }
        result = {
          ok: failures.length === 0, dryRun, force, agentsHome: c.homes.agents,
          operationCount: plan.length, preserved,
          summary: Object.fromEntries(['create', 'adopt', 'update', 'remove', 'unchanged'].map((action) => [action, plan.filter((op) => op.action === action).length])),
          operations: plan.map(({ kind, source, destination, mode, unchanged, action }) => ({ kind, source, destination, action, mode: unchanged ? 'unchanged' : mode })),
          failures,
          warnings: [
            ...(state.legacy ? ['Migrating legacy state per resource: identical content is adopted; unrelated content is preserved.'] : []),
            ...(state.migrated ? ['Migrating directory snapshots to per-resource ownership.'] : []),
            ...state.preserved.map((file) => `Reserved or unmanaged resource preserved: ${file}`),
            ...(state.detached ? ['Configuration homes changed; previous destinations are preserved and no longer managed.'] : []),
            ...plan.filter((op) => projected(op) && op.mode.startsWith('copy') && op.snapshot?.['.']?.type === 'directory').map((op) => `directory copy projection detected: ${op.destination}`),
          ],
        };
      }
      if (!result.ok) exitCode = 1;
    } finally { maintenanceWarnings.push(...release()); }
  } catch (e) {
    exitCode ||= 1;
    result = { ok: false, failures: [e.message], warnings: [] };
  }
  result.warnings.push(...maintenanceWarnings);
  if (json) console.log(JSON.stringify(result, null, 2));
  else {
    console.log(result.ok ? `ai-config ${command} ${result.dryRun ? 'preflight passed' : 'passed'}.` : `ai-config ${command} failed:`);
    for (const failure of result.failures) console.error(`- ${failure}`);
    for (const warning of result.warnings) console.log(`Warning: ${warning}`);
    if (result.summary) console.log(`Plan: ${Object.entries(result.summary).map(([action, count]) => `${action}=${count}`).join(', ')}`);
    for (const file of (result.preserved ?? []).slice(0, 10)) console.log(`Preserved unmanaged resource: ${file}`);
    if (result.preserved?.length > 10) console.log(`... ${result.preserved.length - 10} more preserved resources (use --json for the full list)`);
    for (const op of result.operations ?? []) console.log(`- ${op.kind} [${op.mode}]: ${op.destination}`);
  }
  return exitCode;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) process.exitCode = main();
