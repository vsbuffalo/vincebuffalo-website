BOOTSTRAP_VERSION=4.4.1
FONT_AWESOME_VERSION=5.12.1



style: css/style.min.css
update: purge style
clean: clean-font-awesome clean-bootstrap clean-style

## Markdown Targets

## CSS targets
__less/bootstrap:
	wget https://github.com/twbs/bootstrap/archive/v$(BOOTSTRAP_VERSION).zip -O bootstrap.zip && unzip bootstrap.zip
	mkdir -p $@
	cp -r bootstrap-$(BOOTSTRAP_VERSION)/* $@
	wget -O js/jquery-3.4.1.min.js https://code.jquery.com/jquery-3.4.1.min.js

__less/font-awesome:
	wget https://use.fontawesome.com/releases/v5.12.1/fontawesome-free-$(FONT_AWESOME_VERSION)-web.zip -O font-awesome.zip && unzip font-awesome.zip
	mkdir -p $@
	cp -r font-awesome-$(FONT_AWESOME_VERSION)/ $@

css/style.min.css: __less/style.less __less/bootstrap __less/font-awesome
	# lessc $< --clean-css="--s1 --advanced --compatibility=ie8" > $@
	lessc $< > css/style.css
	mkdir -p webfonts/
	cp __less/font-awesome/webfonts/* webfonts/

clean-bootstrap:
	rm -rf bootstrap.zip bootstrap-$(BOOTSTRAP_VERSION)/

clean-font-awesome:
	rm -rf font-awesome.zip font-awesome-$(FONT_AWESOME_VERSION)

clean-style:
	rm -rf css/style.min.css

# remove the source directories from __less, e.g. for upgrades
purge:
	rm -rf __less/font-awesome __less/bootstrap

.PHONY: clean clean-bootstrap clean-font-awesome purge all update
