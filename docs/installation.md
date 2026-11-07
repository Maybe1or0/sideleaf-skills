# Installing SideLeaf Skills

The installer requires Node.js 20 or newer and npm and supports macOS, Linux, and Windows. It copies bundled skills; it does not download a remote registry or execute skill scripts. Use a trusted project and review skills before using them with an agent.

## Local checkout

The npm package has not been verified as published. From a checkout, install the locked dependencies and run the CLI directly:

```sh
npm ci
node bin/sideleaf-skills.js list
node bin/sideleaf-skills.js install latex-project-init --agent codex
```

The destination is resolved from the current working directory, so run the install command from the project where the skill should be available. When running from another directory, use the absolute path to `bin/sideleaf-skills.js` in the checkout. The CLI always finds the skills packaged alongside itself.

Once the package has been published and its name verified, the equivalent commands are expected to use `npx sideleaf-skills`, for example:

```sh
npx sideleaf-skills list
npx sideleaf-skills install --all --agent codex
npx sideleaf-skills install latex-project-init --agent claude
npx sideleaf-skills install latex-project-init another-existing-skill --dir ./my-skills
npx sideleaf-skills install --agent codex
```

The last command opens an interactive numbered multi-selection prompt; choose comma-separated numbers and confirm, or press Enter to cancel. Without a terminal, specify names or `--all`. Only skills actually present in the package can be selected; `another-existing-skill` is a usage placeholder, not an available skill. The same arguments work with the local `node` command above.

## Targets and safety

The default is project-local Codex, `.agents/skills/`; choose `--agent codex` explicitly or `--agent claude` for `.claude/skills/`. These are the documented [Codex](https://developers.openai.com/codex/skills/) and [Claude Code](https://code.claude.com/docs/en/skills) project directories. Use `--dir PATH` for another agent or custom location; do not combine it with `--agent`. A global directory is used only if explicitly supplied with `--dir`.

All selected names are checked before installation. Existing skill directories are protected by default. `--force` replaces only selected skill directories, including any user changes within them; review the destination first. The installer rejects symbolic links in source skills, destination path components, and selected existing destinations. Choose a path without symbolic links, including any symlinked parent directories. Installation stages copies in the destination and attempts rollback on failure; a failed rollback reports the recovery location. Concurrent changes to the destination by other processes are not supported.

## Development

```sh
npm ci
npm run validate
npm pack --dry-run
```

The GitHub workflow checks installer behavior and package contents. `npm run validate` checks skill discovery and required metadata, not the behavior of an AI agent.
