import { cp, lstat, mkdir, mkdtemp, readdir, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import { safeDirectory } from './paths.js';
import { validName } from './discovery.js';

async function exists(file) {
  try { return await lstat(file); } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

async function checkTree(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const item = path.join(directory, entry.name);
    const stat = await lstat(item);
    if (stat.isSymbolicLink()) throw new Error(`Symbolic links are not allowed in skills: ${item}`);
    if (stat.isDirectory()) await checkTree(item);
    else if (!stat.isFile()) throw new Error(`Unsupported file type in skill: ${item}`);
  }
}

export async function installSkills(skills, target, force = false) {
  if (!skills.length) throw new Error('No skills selected.');
  if (new Set(skills.map(s => s.name)).size !== skills.length || skills.some(s => !validName(s.name))) throw new Error('Invalid or duplicate skill selection.');
  await safeDirectory(target);
  for (const skill of skills) {
    const source = await lstat(skill.directory);
    if (!source.isDirectory() || source.isSymbolicLink()) throw new Error(`Unsafe skill source: ${skill.directory}`);
    await checkTree(skill.directory);
    const existing = await exists(path.join(target, skill.name));
    if (existing && (!force || existing.isSymbolicLink() || !existing.isDirectory())) {
      throw new Error(`Destination exists or is unsafe: ${path.join(target, skill.name)}${!force ? ' (use --force to replace a skill directory)' : ''}`);
    }
  }
  await safeDirectory(target, true);
  const stage = await mkdtemp(path.join(target, '.sideleaf-install-'));
  const moved = [];
  const installed = [];
  try {
    const incoming = path.join(stage, 'incoming');
    await mkdir(incoming);
    for (const skill of skills) {
      await cp(skill.directory, path.join(incoming, skill.name), { recursive: true, dereference: false, errorOnExist: true, force: false });
      await checkTree(path.join(incoming, skill.name));
    }
    const backup = path.join(stage, 'backup');
    await mkdir(backup);
    for (const skill of skills) {
      const dest = path.join(target, skill.name);
      const existing = await exists(dest);
      if (existing) {
        if (!force || existing.isSymbolicLink() || !existing.isDirectory()) throw new Error(`Destination changed or is unsafe: ${dest}`);
        await rename(dest, path.join(backup, skill.name));
        moved.push(skill.name);
      }
      await rename(path.join(incoming, skill.name), dest);
      installed.push(skill.name);
    }
  } catch (error) {
    try {
      for (const name of installed.reverse()) await rm(path.join(target, name), { recursive: true, force: true });
      for (const name of moved.reverse()) await rename(path.join(stage, 'backup', name), path.join(target, name));
    } catch (rollbackError) {
      throw new Error(`${error.message}. Rollback failed: ${rollbackError.message}. Recovery files retained at ${stage}`);
    }
    await rm(stage, { recursive: true, force: true });
    throw error;
  }
  await rm(stage, { recursive: true, force: true });
  return skills.map(skill => path.join(target, skill.name));
}
