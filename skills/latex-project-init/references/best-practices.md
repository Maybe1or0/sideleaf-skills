# Project practices

## Content and organization

Keep source names short, descriptive, lowercase and portable; avoid spaces and case-only differences. Use `\label` and `\ref` for cross-references, placing labels after captions for figures and tables. Use `graphicx` only when including figures, with explicit relative paths and formats supported by the chosen engine. Tables should use appropriate native environments; add packages only for actual needs. Keep source files readable and split them only when useful.

## Packages and bibliography

Load the smallest useful set of compatible packages, respecting class and publisher requirements. For references, prefer `biblatex` with `backend=biber` when the user has no other requirement. Provide a real, possibly empty `.bib` file and no invented citations. A direct build typically runs the engine, `biber main`, then the engine twice more; use the actual main-file basename. `latexmk` can orchestrate this when Biber is installed. Explain the engine, packages, bibliography backend, and any nonstandard fonts in the project README.

## Builds and version control

A generated `.latexmkrc` is optional; when present, set only the selected engine's `$pdf_mode` and do not enable shell escape. Give commands that work from the project root, and name the expected output PDF. Include a `.gitignore` for generated auxiliary files (for example `*.aux`, `*.log`, `*.fls`, `*.fdb_latexmk`, `*.bbl`, `*.bcf`, `*.blg`, `*.run.xml`, and `*.synctex.gz`); do not ignore `.tex`, `.bib`, or source figures. Ignore the generated PDF only if it is not intended to be versioned. Avoid blanket ignores that hide user sources.

For repeatable builds, document the TeX distribution and relevant versions when known, along with any fonts, packages, build tool, and Biber requirements. Do not claim fully reproducible binary output without verification. Compile trusted documents with shell escape disabled; avoid execution of project-supplied build hooks or commands without inspection.
