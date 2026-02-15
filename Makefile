.PHONY: notebooks site serve clean favicon

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
