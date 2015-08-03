# Notes about my site

## Fonts

## CSS & less

This site uses the terrific [less](http://lesscss.org/) CSS pre-processor to
create the CSS. All less files are in `__less/` and are compiled into CSS files
with `Makefile`. Install less and less-plugin-clean-css

    npm install -g less
    npm install -g less-plugin-clean-css


## .com to .org redirect

This is accomplished with an `.htaccess` file:

    Options +FollowSymlinks
    RewriteEngine on
    rewritecond %{http_host} ^vincebuffalo.com [nc]
    rewriterule ^(.*)$ http://vincebuffalo.org/$1 [r=301,nc]

## pre/code blocks and styling

`<pre></pre>` blocks are temperamental about newlines; this can affect
styling. Newlines are interpreted, so in some cases code should be formatted as:

    <pre><code class="python">def simulate_coalescent(theta, n):
    # stuff
    return sim</code></pre>

## Stylistical concerns with Asides

Inspired by [Edward Tufte](http://www.edwardtufte.com/tufte/)'s terrific books,
I wanted asides in my pages. Stylistically, these should be aligned with their
callout (e.g. an asterisk), but this is rather difficult as HTML5's
`<aside></aside>` will break a

To maintain consistent styling, place `<aside></aside>` after the callout.
