.PHONY: notebooks site serve clean

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
