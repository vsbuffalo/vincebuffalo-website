BOOTSTRAP_VERSION=3.3.5
FONT_AWESOME_VERSION=4.4.0

all: css/style.min.css

update: purge all

__less/bootstrap:
	wget https://github.com/twbs/bootstrap/archive/v$(BOOTSTRAP_VERSION).zip -O bootstrap.zip && unzip bootstrap.zip
	mkdir -p $@
	cp -r bootstrap-$(BOOTSTRAP_VERSION)/* $@

__less/font-awesome:
	wget http://fortawesome.github.io/Font-Awesome/assets/font-awesome-$(FONT_AWESOME_VERSION).zip -O font-awesome.zip && unzip font-awesome.zip
	mkdir -p $@
	cp -r font-awesome-$(FONT_AWESOME_VERSION)/ $@

css/style.min.css: __less/style.less __less/bootstrap __less/font-awesome
	lessc $< --clean-css="--s1 --advanced --compatibility=ie8" > $@
	lessc $< > css/style.css
	mkdir -p fonts/
	cp __less/font-awesome/fonts/* fonts/

clean-bootstrap:
	rm -rf bootstrap.zip bootstrap-$(BOOTSTRAP_VERSION)/

clean-font-awesome:
	rm -rf font-awesome.zip font-awesome-$(FONT_AWESOME_VERSION)

clean: clean-font-awesome clean-bootstrap

# remove the source directories from __less, e.g. for upgrades
purge:
	rm -rf __less/font-awesome __less/bootstrap

.PHONY: clean clean-bootstrap clean-font-awesome purge all update
