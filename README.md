# SideLeaf Skills

Reusable AI agent skills for LaTeX workflows.

SideLeaf Skills is an early-stage, open-source collection intended to help developers, researchers, students, and technical writers write, edit, compile, maintain, and share LaTeX documents. Skills are focused, independently understandable, portable across compatible agents, and easy to maintain.

The repository follows the open [Agent Skills specification](https://agentskills.io/specification). Each skill lives in `skills/<skill-name>/SKILL.md` and may include supporting scripts, references, and assets. Agent compatibility depends on each implementation.

## Available skills

- [latex-project-init](skills/latex-project-init/): initialize a LaTeX project suited to the requested document type, build environment, and requirements.

## Installation

Node.js 20 or newer and npm are required. The package has not been verified as published. In a local checkout, run:

```sh
npm ci
node bin/sideleaf-skills.js list
node bin/sideleaf-skills.js install latex-project-init --agent codex
```

The installer defaults to the current project's Codex skills directory; use `--agent claude` or `--dir PATH` for another destination. See the [installation guide](docs/installation.md) for installing all or multiple skills, interactive selection, overwrite behavior, supported platforms, and future `npx` usage.

## Repository structure

```text
bin/           CLI entry point
installer/     Installer commands, skill discovery, and file copying
docs/          Guides and development documentation
skills/        Reusable agent skills
.github/       Community templates and npm checks
```

## Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md), the [Code of Conduct](CODE_OF_CONDUCT.md), and the [security policy](SECURITY.md). See [getting started](docs/getting-started.md) and [skill development](docs/skill-development.md) for more detail.

## Project and license

SideLeaf Skills is the first component of the broader SideLeaf ecosystem; see the [architecture guide](docs/architecture.md) and [sideleaf.endium.fr](https://sideleaf.endium.fr).

This repository is licensed under the [MIT License](LICENSE).
