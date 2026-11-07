import path from 'node:path';
import { lstat, mkdir } from 'node:fs/promises';

export const agents = { codex: ['.agents', 'skills'], claude: ['.claude', 'skills'] };

export function targetPath({ agent, dir }, cwd = process.cwd()) {
  if (agent && dir) throw new Error('Choose either --agent or --dir, not both.');
  if (agent && !Object.hasOwn(agents, agent)) throw new Error(`Unknown agent "${agent}". Choose codex or claude.`);
  return path.resolve(cwd, ...(dir ? [dir] : agents[agent || 'codex']));
}

// Reject symlinks in existing path components, including the destination root.
export async function safeDirectory(target, create = false) {
  const root = path.parse(target).root;
  let current = root;
  for (const part of path.relative(root, target).split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    try {
      const stat = await lstat(current);
      if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error(`Unsafe or non-directory path: ${current}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      if (create) await mkdir(current);
    }
  }
}
