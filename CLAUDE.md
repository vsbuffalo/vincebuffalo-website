# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Vince Buffalo's personal website, a Hugo-based static site focused on computational biology, evolutionary genetics, and bioinformatics. The site uses the Hextra theme and includes blog posts, research content, and personal information.

## Development Commands

### Building and Running the Site
- `make serve` or `hugo server -D` - Start development server with drafts enabled
- `make site` - Build the production site (includes notebook preprocessing)
- `make notebooks` - Process Jupyter notebooks using Snakemake
- `make clean` - Remove build artifacts and clean Hugo modules
- `make dev` - Clean and start development server
- `make rebuild` - Clean and build production site

### Dependencies
- Hugo (static site generator) - requires extended version >= 0.87.0
- Python dependencies managed via `uv` and defined in `pyproject.toml`
- Snakemake for notebook processing workflow
- Jupyter for notebook support

## Architecture

### Directory Structure
- `content/` - Hugo content files (Markdown)
  - `blog/` - Blog posts
  - `_index.md` - Homepage content
  - `about.md` - About page
- `themes/hextra/` - Hugo theme (Hextra)
- `static/` - Static assets (images, etc.)
- `public/` - Generated site output (created by Hugo)
- `old/` - Legacy content from previous site incarnation (Pelican-based)
- `config/` - Hugo configuration (currently empty, uses hugo.yaml)
- `data/`, `i18n/`, `archetypes/` - Standard Hugo directories

### Configuration
- `hugo.yaml` - Main Hugo configuration file
- `pyproject.toml` - Python project dependencies (Jupyter, Snakemake, Pillow)
- `Makefile` - Build automation
- `.gitmodules` - Git submodule configuration for theme

### Theme Integration
The site uses the Hextra theme, which provides:
- Modern responsive design with dark/light mode toggle
- Built-in search functionality (FlexSearch)
- Blog and documentation layouts
- Syntax highlighting and code copy functionality
- Math rendering support (LaTeX via MathJax/KaTeX)

### Content Processing
- Jupyter notebooks can be processed via Snakemake workflow
- Hugo handles Markdown to HTML conversion
- Math expressions supported via passthrough delimiters
- Image processing and optimization handled by Hugo

## Development Workflow

1. Use `make dev` to start development with a clean slate
2. Content changes are automatically reloaded in development server
3. Run `make notebooks` if working with Jupyter notebook content
4. Use `make site` for production builds
5. The site is configured for deployment to vincebuffalo.org

## Content Guidelines

- Blog posts go in `content/blog/` with appropriate frontmatter
- Use Hugo's taxonomy system (tags, categories, authors, series)
- Images should be placed in `static/images/` or use Hugo's page bundles
- Math expressions use LaTeX syntax with `\[...\]` for display math and `\(...\)` for inline