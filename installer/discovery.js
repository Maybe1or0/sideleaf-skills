import { readdir, readFile, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

export const skillsDirectory = fileURLToPath(new URL('../skills/', import.meta.url));
export const validName = name => typeof name === 'string' && name.length <= 64 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name);

export async function discoverSkills(root = skillsDirectory) {
  const skills = [];
  const errors = [];
  for (const entry of (await readdir(root, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;
    try {
      if (!entry.isDirectory() || !validName(entry.name)) throw new Error('invalid skill directory name or symbolic link');
      const file = path.join(root, entry.name, 'SKILL.md');
      if (!(await lstat(file)).isFile()) throw new Error('SKILL.md must be a regular file');
      const content = await readFile(file, 'utf8');
      const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
      if (!match) throw new Error('missing YAML frontmatter');
      const data = parse(match[1], { uniqueKeys: true });
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('frontmatter must be a mapping');
      if (!validName(data.name) || data.name !== entry.name) throw new Error('name must be valid and match its directory');
      if (typeof data.description !== 'string' || !data.description.trim() || data.description.length > 1024) throw new Error('description must be a nonempty string of at most 1024 characters');
      if (data.compatibility !== undefined && (typeof data.compatibility !== 'string' || !data.compatibility.trim() || data.compatibility.length > 500)) throw new Error('compatibility must be a nonempty string of at most 500 characters');
      for (const key of ['license', 'allowed-tools']) {
        if (data[key] !== undefined && typeof data[key] !== 'string') throw new Error(`${key} must be a string`);
      }
      if (data.metadata !== undefined && (!data.metadata || typeof data.metadata !== 'object' || Array.isArray(data.metadata) || Object.values(data.metadata).some(value => typeof value !== 'string'))) throw new Error('metadata must be a mapping of strings to strings');
      skills.push({ name: data.name, description: data.description, directory: path.join(root, entry.name) });
    } catch (error) {
      errors.push(`${entry.name}: ${error.message}`);
    }
  }
  return { skills, errors };
}
