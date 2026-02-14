# vincebuffalo.org

Personal website of Vince Buffalo — computational biology, evolutionary genetics, and bioinformatics.

## Stack

- **Static Site Generator**: [Hugo](https://gohugo.io/) (extended version >= 0.87.0)
- **Theme**: [Hextra](https://imfing.github.io/hextra/) with custom overrides
- **Notebook Processing**: Snakemake + Jupyter (optional)
- **Package Management**: [uv](https://github.com/astral-sh/uv) for Python dependencies

## Directory Structure

```
├── content/           # Markdown content
│   ├── blog/          # Blog posts
│   ├── notes/         # Technical notes
│   ├── about.md       # About page
│   ├── book.md        # Book page
│   ├── publications.md
│   └── research.md
├── layouts/           # Custom layout overrides
│   └── blog/list.html # Custom blog listing with images
├── static/images/     # Static assets
├── themes/hextra/     # Hextra theme (git submodule)
├── assets/css/        # Custom CSS
├── hugo.yaml          # Hugo configuration
├── Makefile           # Build commands
└── pyproject.toml     # Python dependencies
```

## Development

### Prerequisites

- Hugo extended version (install via `brew install hugo` on macOS)
- Python 3.x with uv (`brew install uv`)

### Commands

```bash
# Start development server with drafts
make serve
# or
hugo server -D

# Clean build artifacts and start dev server
make dev

# Build production site
make site

# Process Jupyter notebooks (if any)
make notebooks

# Clean all build artifacts
make clean

# Full rebuild
make rebuild
```

### Local Development

1. Clone the repo with submodules:
   ```bash
   git clone --recursive https://github.com/vsbuffalo/vincebuffalo-website
   ```

2. Start the dev server:
   ```bash
   make serve
   ```

3. View at http://localhost:1313

## Content

### Blog Posts

Blog posts go in `content/blog/` with frontmatter:

```yaml
---
title: "Post Title"
date: 2024-01-15
draft: false
tags: ["tag1", "tag2"]
categories: ["category"]
images: ["/images/featured.png"]  # Optional: shows in blog listing
summary: "Optional custom summary"
aliases:
  - /old/url/path.html  # Redirects from old URLs
---
```

### Notes

Technical notes go in `content/notes/`.

### Pages

Static pages (about, book, publications, research) are in `content/`.

## URL Structure

- Blog posts: `/blog/post-slug/`
- Notes: `/notes/note-slug/`
- Pages: `/about/`, `/book/`, `/publications/`, `/research/`

Old Pelican URLs (e.g., `/blog/2012/03/08/slug.html`) redirect via Hugo aliases.

## Customizations

### Custom Blog Layout

`layouts/blog/list.html` overrides the theme to show:
- Posts grouped by year
- Thumbnail images (from `images:` frontmatter)
- Auto-generated summaries

### Theme

Hextra theme is included as a git submodule. Custom CSS can be added in `assets/css/custom.css`.

## Deployment

Build the site:

```bash
make site
```

Output goes to `public/` directory, ready for deployment to any static host.
