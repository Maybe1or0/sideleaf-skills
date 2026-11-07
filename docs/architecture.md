# Architecture

SideLeaf Skills is a repository for reusable LaTeX-focused agent skills. It follows the [Agent Skills specification](https://agentskills.io/specification) without adding a separate manifest or requiring a particular agent. Agent support varies, so portability must be tested in the relevant environments.

- `skills/` contains independent skill directories. Each contains a `SKILL.md` with metadata and instructions, and may contain `scripts/`, `references/`, or `assets/` as needed.
- `docs/` explains the repository and contribution process.
- `bin/` starts the npm command; `installer/` contains its command handling, skill discovery, destination paths, and file copying.
- `.github/` contains community templates and npm checks.

Keep skills focused and self-contained, document environmental requirements, and reference resources using paths relative to the skill root. This limits coupling and makes skills easier to review and reuse.

SideLeaf Skills is the first component of the wider SideLeaf ecosystem. Possible future components include a separate SideLeaf CLI, a discovery hub, a VS Code extension, and a standalone AI-assisted editor. They are separate ideas, not implemented infrastructure or dependencies of this repository.
