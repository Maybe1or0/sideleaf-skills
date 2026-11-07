# Project structures

Start with `main.tex`, a README, and a suitable `.gitignore`. A single file is usually enough for a short article, a letter, or a small presentation. Choose the project root based on the user's request; do not require a new parent directory if an existing root is appropriate.

For a long report or book, add `chapters/` and use `\input` or `\include` for substantial chapters. A shared `preamble/` is useful only when a separate package file improves readability. Use sections or frames for larger articles or presentations as needed. Create `figures/` only when there are figures, and add `references.bib` only when bibliography support is requested. Every file referenced by the document must exist.

The five plain templates in [assets/templates](../assets/templates/) provide single-file starts. Adapt a template to the request rather than mechanically creating every optional directory. Avoid empty folders that do not yet serve a purpose. Keep paths relative to the project root and use portable file names.
