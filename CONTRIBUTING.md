# Contributing

Thank you for helping build SideLeaf Skills. For substantial changes, consider opening an issue first to discuss the problem and scope. For bugs, provide reproduction steps and relevant environment details; do not include secrets.

## Conventions

Keep changes focused, readable, and portable. Use clear names and avoid adding dependencies unless they solve a real need. Document new behavior and dependencies alongside the change. Keep scripts simple, handle failures clearly, and review their security implications.

Future skills belong in `skills/<skill-name>/SKILL.md`. Names use lowercase ASCII letters, digits, and single hyphens, are at most 64 characters, and must match the `name` metadata. Each skill needs YAML frontmatter with `name` and `description`; optional resources belong within the skill directory. Follow the [skill development guide](docs/skill-development.md) and the [Agent Skills specification](https://agentskills.io/specification).

## Validation and pull requests

For installer changes, run `npm ci` and `npm run validate`. See the [installation guide](docs/installation.md) for local usage.

Review each skill against the Agent Skills specification and exercise its instructions and any scripts in a suitable environment when practical. Document dependencies, checks performed, and any limitations. Agent behavior can vary, so describe the conditions under which a skill was tried.

Open a pull request with a clear summary, relevant issue links, and the checks performed. Respond to review feedback and keep the scope manageable. Follow the [Code of Conduct](CODE_OF_CONDUCT.md) and use the [security policy](SECURITY.md) for sensitive reports.
