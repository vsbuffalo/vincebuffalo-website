#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'Vince Buffalo'
AUTHOR_EMAIL = u'vsbuffalo@gmail.com'
SITENAME = u'vince buffalo'
SITEURL = ''

PATH = 'content'

TIMEZONE = 'America/Los_Angeles'

DEFAULT_LANG = u'en'
TYPOGRIFY = True
DEFAULT_CATEGORY = 'blog'
THEME = 'theme/'
ARTICLE_PATHS = ['blog', 'notes']
ARTICLE_URL = '{category}/{date:%Y}/{date:%m}/{date:%d}/{slug}.html'
ARTICLE_SAVE_AS = '{category}/{date:%Y}/{date:%m}/{date:%d}/{slug}.html'
PAGE_URL = '{slug}/'
PAGE_SAVE_AS = '{slug}/index.html'

DIRECT_TEMPLATES = ('index', )
TEMPLATE_PAGES = {'blog.html': 'blog/index.html',
                  'blog_archive.html': 'blog/archive/index.html',
                  'notes_archive.html': 'notes/archive/index.html',
                  'notes.html': 'notes/index.html'}

IGNORE_FILES = ['dev-notes']

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Social widget
SOCIAL = (('You can add links in your config file', '#'),
          ('Another social link', '#'),)

DEFAULT_PAGINATION = False

STATIC_PATHS = ['images', 'static']

PLUGIN_PATHS = ['plugins/']
PLUGINS = ['pandoc_reader', 'representative_image', 'gravatar']

# Pandoc settings
PANDOC_ARGS = ['--mathjax',
               '--smart',
               '--no-highlight']
#               '-F pandoc-citeproc']

# Uncomment following line if you want document-relative URLs when developing
# RELATIVE_URLS = True

SUMMARY_MAX_LENGTH = 120
