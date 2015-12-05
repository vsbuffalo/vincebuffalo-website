Title: Methods of Probabilistic Inference
author: Vince Buffalo

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed
volutpat metus. Sed dapibus viverra ante, in rhoncus libero imperdiet
at. Curabitur pellentesque dui ut ex sollicitudin, a vehicula leo
placerat*. Etiam a fringilla ante, eu mattis massa. Other crapola.
Suspendisse potenti. Integer luctus nulla risus, id molestie quam
tincidunt vulputate. Etiam ultrices diam vel dui egestas accumsan.

> Vivamus diam eros, scelerisque nec metus ut, dapibus
> bibendum mauris. Aliquam blandit dui id sem volutpat tristique. Aenean magna
> tortor, finibus sit amet quam vel, maximus condimentum orci. Sed eget purus
> ante.
> <small>some guy</small>

how does some code look? Here it is... in a `sentence(); test += 1 +
2`

<aside>
*some shitty comment. how long can this be before it starts to look stupid?
other stuff

    foo <- function() rnorm(100)
</aside>

Vivamus diam eros, scelerisque nec metus ut, dapibus bibendum mauris. Aliquam
blandit dui id sem volutpat tristique. Aenean magna tortor, finibus sit amet
quam vel, maximus condimentum orci. Sed eget purus ante.

$$n_k = \mathcal{F}_{k+2} = \frac{\phi^{k+2} - \psi^{k+2}}{\sqrt{5}}$$

Vivamus diam eros, scelerisque nec metus ut, dapibus bibendum mauris. Aliquam
blandit dui id sem volutpat tristique. Aenean magna tortor, finibus sit amet
quam vel, maximus condimentum orci. Sed eget purus ante.


```python
def dated_post(app_dir, path):
    """Transform a filename formatted as an ISO 8601 data and a slug with spaces
    replaced with dashes to a filename.
    
    For example, 2015-07-14-some-older-blog-post.Rmd

    ISO 8601 is the best: https://xkcd.com/1179/

    """
    matcher = dated_post_matcher(app_dir)
    parts = matcher.match(path)
    msg = "'%s' is an improperly formatted post path, must be in format \
1970-01-01-slugified-post-title.md"
    if parts is None:
        raise ValueError(msg % path)
    keys = parts.groupdict()
    # the only way to reliable test this is a date is to try parsing it
    try:
        dt = datetime.strptime(keys['date'], '%Y-%m-%d')
    except ValueError as ex:
        msg = "error parsing date, must be in ISO 8601 format: " + ex.message
        raise ValueError(msg)
    dt_path = join(*dt.strftime('%Y-%m-%d').split('-'))
    file_parts = splitext(keys['slug'])
    new_file = file_parts[0] + ".html"
    fig_path = figure_path(app_dir, filename)
    return SlugSet(join(dt_path, new_file), fig_path)
```

Phasellus vitae felis vel ipsum gravida feugiat. Donec ac tristique
lorem, ultrices bibendum massa. Cras sed venenatis lacus, sollicitudin
sodales dui. Quisque facilisis, ipsum id fringilla sodales, odio enim semper
ante, et dignissim elit nulla imperdiet massa.

## this is a header two

Quisque mi lectus, efficitur eu mi eget, faucibus sodales lorem. Pellentesque
maximus diam pellentesque condimentum dictum. Phasellus et est quis quam varius
mattis sed vitae ante. Donec interdum molestie erat, non lacinia est pretium sit
amet. Nam aliquet vulputate augue quis condimentum. Proin id congue sem, vel
consequat urna. In vehicula nunc vel scelerisque semper. Nulla pulvinar ornare
mi, nec volutpat justo efficitur quis. Nulla faucibus vestibulum hendrerit.

### this is a header two

Maecenas aliquet, enim id fermentum facilisis, lectus augue pulvinar magna, in
tempor augue turpis eu magna. Mauris sit amet nulla placerat, pharetra justo
non, egestas ipsum. Morbi a ultrices nulla. Nullam sit amet commodo
elit. Aliquam erat volutpat. Cras posuere ligula eu diam elementum
vulputate. Nam volutpat dapibus mi, a commodo ipsum eleifend ut. Pellentesque
sem velit, consectetur quis purus sit amet, varius lacinia dolor. Curabitur
gravida sit amet nisi quis tristique. Curabitur id odio tempus, suscipit velit
non, tincidunt justo. In hac habitasse platea dictumst. Maecenas mauris nisl,
ullamcorper id ante sit amet, luctus interdum ipsum. Suspendisse potenti.


Duis convallis scelerisque arcu, nec lobortis purus mattis ac. Quisque ut metus
nisi. Praesent at tincidunt felis, eget placerat erat. Donec tempus mauris ac
orci tempor fermentum at eu leo. In in lacus sagittis, gravida tortor convallis,
tincidunt purus. Ut eget mattis tellus. Integer et cursus augue, ut eleifend
ligula. Nam id viverra arcu. Nunc sagittis eget tortor sit amet
vulputate. Phasellus sit amet consectetur augue, vitae consequat
dolor. Pellentesque habitant morbi tristique senectus et netus et malesuada
fames ac turpis egestas. Maecenas condimentum sit amet odio vel dictum. Duis in
lectus mauris.

 - - -

Nullam dictum ut augue sed commodo. Pellentesque laoreet molestie diam et
consequat. Donec id porttitor arcu. Nunc eleifend dolor odio, vel aliquam odio
iaculis et. Morbi tristique ex tortor, in auctor elit consectetur quis. Cras
vehicula nibh at mi euismod hendrerit vel id orci. Quisque rutrum tellus vel
metus rhoncus, sed tristique augue maximus. Nulla facilisi. Sed erat purus,
vehicula vitae ante at, elementum finibus tortor. Donec nisi felis, rutrum vitae
turpis at, convallis scelerisque dui. In sed velit sed augue porta
venenatis. Suspendisse potenti. Mauris ac nunc placerat, efficitur lorem sed,
sollicitudin tellus. Sed lacinia, lorem eu interdum facilisis, magna sem finibus
quam, in aliquam ex orci at ligula.
