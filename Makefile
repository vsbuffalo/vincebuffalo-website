.PHONY: notebooks site serve clean favicon build deploy deploy-dry

DEPLOY_HOST := vincebuffalo
DEPLOY_PATH := /home/vsbuffalo/apps/vincebuffalo/

# Top-level paths that live on the host but are NOT part of the Hugo
# build (separate apps, server config). Protect them from --delete.
DEPLOY_PROTECT := \
  --filter='protect /camdl/' \
  --filter='protect /cvhz3/' \
  --filter='protect /87d71uj_old_stuff/' \
  --filter='protect /.htaccess'

notebooks:
	uv run snakemake --cores 2

site: notebooks
	hugo --minify

serve:
	hugo server -D

clean:
	rm -rf public/ resources/ .hugo_build.lock
	hugo mod clean

rebuild: clean site

# Build a fresh production site (no notebooks step, no drafts).
# Clears public/ first so removed pages don't linger and get re-synced.
build:
	rm -rf public/
	hugo --minify

# Dry-run: show what would change on the live host without uploading.
deploy-dry: build
	rsync -avzn --delete $(DEPLOY_PROTECT) public/ $(DEPLOY_HOST):$(DEPLOY_PATH)

# Real deploy: mirror public/ to the host (drafts excluded by hugo --minify).
deploy: build
	rsync -avz --delete $(DEPLOY_PROTECT) public/ $(DEPLOY_HOST):$(DEPLOY_PATH)

dev: clean
	hugo server -D

# Generate favicons from logo.svg
# Requires: Inkscape.app, imagemagick (for .ico generation)
INKSCAPE := /Applications/Inkscape.app/Contents/MacOS/inkscape

favicon:
	cp static/images/logo.svg static/favicon.svg
	$(INKSCAPE) static/images/logo.svg --export-type=png --export-filename=static/favicon-16x16.png -w 16 -h 16
	$(INKSCAPE) static/images/logo.svg --export-type=png --export-filename=static/favicon-32x32.png -w 32 -h 32
	$(INKSCAPE) static/images/logo.svg --export-type=png --export-filename=static/favicon-96x96.png -w 96 -h 96
	@command -v magick >/dev/null 2>&1 && \
		magick static/favicon-16x16.png static/favicon-32x32.png static/favicon-96x96.png static/favicon.ico && \
		rm static/favicon-96x96.png || \
		echo "ImageMagick not found, skipping .ico generation (install with: brew install imagemagick)"
