import { createInterface } from 'node:readline/promises';
import { discoverSkills, validName } from './discovery.js';
import { installSkills } from './installer.js';
import { targetPath } from './paths.js';
import { readFile } from 'node:fs/promises';

const help = `Usage: sideleaf-skills <command> [options]

Commands:
  list                       List available skills
  install [names...]         Install selected skills

Options:
  --help                     Show help
  --version                  Show version`;
const installHelp = `Usage: sideleaf-skills install [names...] [--all] [--agent codex|claude | --dir PATH] [--force]

Without names or --all, select skills interactively in a terminal.
Defaults to the project-local Codex directory.
--force replaces only the selected existing skill directories.`;

async function select(skills) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error('Interactive selection requires a terminal. Specify skill names or --all.');
  if (!skills.length) throw new Error('No skills are available.');
  console.log('Available skills:');
  skills.forEach((skill, i) => console.log(`  ${i + 1}. ${skill.name} — ${skill.description}`));
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = (await rl.question('Select numbers separated by commas (or press Enter to cancel): ')).trim();
    if (!answer || answer.toLowerCase() === 'q') return [];
    const indexes = answer.split(',').map(value => value.trim());
    if (indexes.some(value => !/^[1-9]\d*$/.test(value) || Number(value) > skills.length)) throw new Error('Invalid selection. Enter listed numbers separated by commas.');
    const chosen = [...new Set(indexes.map(value => Number(value) - 1))].map(i => skills[i]);
    console.log(`Selected: ${chosen.map(s => s.name).join(', ')}`);
    const confirm = (await rl.question('Install these skills? [y/N] ')).trim().toLowerCase();
    return confirm === 'y' || confirm === 'yes' ? chosen : [];
  } finally { rl.close(); }
}

export async function run(args) {
  if (!args.length || (args.length === 1 && args[0] === '--help')) { console.log(help); return 0; }
  if (args.length === 1 && args[0] === '--version') {
    const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    console.log(pkg.version); return 0;
  }
  const [command, ...rest] = args;
  if (command === 'install' && rest.length === 1 && rest[0] === '--help') { console.log(installHelp); return 0; }
  if (command !== 'list' && command !== 'install') throw new Error(`Unknown command: ${command}. Run --help for usage.`);
  if (command === 'list' && rest.some(arg => arg !== '--strict') || command === 'list' && rest.length > 1) throw new Error('Usage: sideleaf-skills list');
  const { skills, errors } = await discoverSkills();
  if (errors.length) {
    for (const error of errors) console.error(`Invalid skill: ${error}`);
    if (command === 'install' || rest.includes('--strict')) throw new Error('Fix invalid skills before continuing.');
  }
  if (command === 'list') {
    if (!skills.length) console.log('No skills available.');
    for (const skill of skills) console.log(`${skill.name}  ${skill.description}`);
    return 0;
  }
  const options = {};
  const names = [];
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (arg === '--all' || arg === '--force') {
      const key = arg.slice(2); if (options[key]) throw new Error(`Duplicate option ${arg}`); options[key] = true;
    } else if (arg === '--agent' || arg === '--dir') {
      const key = arg.slice(2); if (options[key] || !rest[i + 1] || rest[i + 1].startsWith('--')) throw new Error(`Option ${arg} requires one value.`);
      options[key] = rest[++i];
    } else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    else names.push(arg);
  }
  if (options.all && names.length) throw new Error('Use --all or skill names, not both.');
  const invalid = names.filter(name => !validName(name) || !skills.some(skill => skill.name === name));
  if (invalid.length) throw new Error(`Unknown or invalid skills: ${invalid.join(', ')}. Available: ${skills.map(s => s.name).join(', ') || '(none)'}.`);
  if (new Set(names).size !== names.length) throw new Error('Duplicate skill names are not allowed.');
  const target = targetPath(options);
  const selected = options.all ? skills : names.length ? names.map(name => skills.find(skill => skill.name === name)) : await select(skills);
  if (!selected.length && !options.all) { console.log('Installation cancelled.'); return 0; }
  const installed = await installSkills(selected, target, options.force);
  for (const file of installed) console.log(`Installed ${file}`);
  return 0;
}
