# Tufte CSS Implementation Progress

## Current Status
Research phase for implementing Tufte-style sidenotes and improved typography in Hugo Hextra theme.

## Research Findings

### Hugo Theme Structure
- Site uses Hextra theme with Hugo asset pipeline
- Configuration: `hugo.yaml` (YAML format)
- Custom CSS location: `themes/hextra/assets/css/custom.css` (currently minimal)
- Site assets directory: `assets/css/extended/` (currently empty)
- Static files: `static/` directory for images and assets

### Tufte CSS Key Features
- Sidenotes display in margin instead of footer footnotes
- Responsive: show in margin on large screens, toggle on small screens
- HTML structure uses `<label>` + `<input type="checkbox">` + `<span class="sidenote">`

### Required CSS Classes
```css
.margin-toggle        /* Checkbox for show/hide functionality */
.sidenote-number     /* Superscript reference numbers */
.sidenote            /* Sidenote content styling */
.marginnote          /* Margin notes without numbers */
```

### Hugo Customization Options
1. **Theme Override**: Create `assets/css/extended/tufte.css`
2. **Custom CSS**: Modify `themes/hextra/assets/css/custom.css`
3. **Asset Pipeline**: Use Hugo Pipes for processing

## Critical Issues Investigation

### Image Migration Status ✅
- **Status**: All referenced images exist in `static/images/` (75 files)
- **Check Results**: Systematic verification confirms no missing image files
- **Image References**: All blog posts use correct `/images/filename.ext` paths

### Hugo Markdown Processing Issue ✅ RESOLVED
- **Root Cause**: Goldmark markdown processor doesn't process markdown inside HTML tags
- **Problem**: Images using `![](/images/file.png)` syntax inside `<figure>` tags weren't converted to HTML
- **Solution**: Converted markdown image syntax to proper HTML `<img>` tags
- **Files Fixed**: 
  - `the-genome-wide-signal-of-linked-selection-in-temporal-data.md` (9 images)
  - `the-problem-of-detecting-polygenic-selection-from-temporal-data.md` (4 images)
  - `understanding-snakemake.md` (1 image)
  - `why-do-species-get-a-thin-slice-of-pi-revisiting-lewontins-paradox-of-variation.md` (1 image)

### Technical Details
- **Before**: `<figure>![](/images/file.png)<figcaption>` (markdown inside HTML)
- **After**: `<figure><img src="/images/file.png" alt="description" /><figcaption>` (proper HTML)
- **Result**: Images now display correctly in Hugo-generated pages

## Next Steps

### Immediate (Priority 1)
1. ✅ Document current progress
2. ✅ Verify images exist in static/images/ (all 75 images confirmed)
3. ✅ Check all 14 migrated posts for missing assets (no missing files)
4. ✅ Fix Hugo markdown processing issue (converted markdown to HTML img tags)
5. ✅ Test image rendering (images now display correctly)

### Implementation (Priority 2)
1. Create Tufte CSS implementation
2. Integrate with Hextra theme
3. Test sidenotes functionality with existing blog content
4. Update existing footnotes to use sidenote format

### Testing (Priority 3)
1. Verify responsive behavior
2. Test with existing academic content
3. Ensure compatibility with MathJax/equations
4. Cross-browser testing

## Files to Modify
- `assets/css/extended/tufte.css` (create)
- All blog posts in `content/blog/` (fix image paths)
- Potentially `themes/hextra/assets/css/custom.css`

## Research References
- Tufte CSS: https://edwardtufte.github.io/tufte-css/
- Hugo Asset Pipeline: https://gohugo.io/hugo-pipes/
- Hextra Theme Docs: Theme customization patterns

---
*Last Updated: 2025-08-24*
*Status: Research Complete, Asset Issues Discovered, Implementation Pending*