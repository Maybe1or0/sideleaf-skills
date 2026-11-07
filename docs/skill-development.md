# Skill development

This guide describes how to propose a skill; the [Agent Skills specification](https://agentskills.io/specification) is the source of truth for the format.

## Structure and metadata

Create a directory under `skills/` named with 1–64 lowercase ASCII letters, digits, and single hyphens. Do not begin or end with a hyphen or use consecutive hyphens. Its `SKILL.md` begins with YAML frontmatter containing `name` and `description`, followed by Markdown instructions. The name must match the directory. The description must be non-empty and at most 1024 characters; explain what the skill does and when it applies.

A skill may contain optional `scripts/`, `references/`, and `assets/` directories. Include only resources needed by that skill and link to them with paths relative to the skill root. The specification describes optional metadata such as `license`, `compatibility`, and `metadata`; use them when appropriate and follow their constraints.

## Instructions and resources

Write clear, focused instructions for the agent, including applicable steps, inputs, outputs, and important edge cases. Keep the main instructions concise and move detailed reference material into separate files. State required tools, versions, and environment assumptions. Scripts should be portable where practical, have clear errors, and document dependencies and safe usage.

Treat instructions, external content, and scripts as execution surfaces. Review commands and dependencies, avoid embedding secrets, minimize permissions and network access, and make potentially destructive operations explicit. Do not assume an agent will enforce a skill's safety instructions.

## Validation and testing

Review the complete skill against the specification, exercise relevant scripts and representative workflows when practical, and record the environments and results in the pull request. Check compatibility with each agent you claim to support; do not infer universal support from the shared format.
