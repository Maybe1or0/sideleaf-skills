# LaTeX engines

- **pdfLaTeX** is a widely available default for common Latin-script documents. Modern LaTeX assumes UTF-8 input; `fontenc` with `T1` is useful for appropriate Latin fonts. Configure `babel` for the requested supported language. Do not add legacy `inputenc` for modern installations by default.
- **XeLaTeX** supports Unicode and system fonts through `fontspec`; use it when the requested scripts or fonts require it. Installed fonts must be available on the target machine.
- **LuaLaTeX** also supports Unicode and `fontspec`, with Lua-based extensibility. Use it when requested or when a feature requires it.

For XeLaTeX or LuaLaTeX, replace pdfLaTeX-specific font encoding setup with `fontspec` when needed; do not load `fontenc` or `inputenc` by habit. Choose language packages and options compatible with the actual language, script, and engine; `babel` language support varies by installed distribution. Record required fonts and packages. Test the selected configuration rather than assuming an engine alone supports every language.

For `latexmk`, common commands are `latexmk -pdf main.tex`, `latexmk -xelatex main.tex`, and `latexmk -lualatex main.tex`. A `.latexmkrc` can select the default via `$pdf_mode = 1;`, `5;`, or `4;`, respectively. Avoid copying an unreviewed existing configuration. Direct engine builds may require multiple runs; BibLaTeX also needs Biber between runs as described in the project README.
