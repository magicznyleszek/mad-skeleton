# Boilerplate assets

Boilerplate assets for quick start with web project.

Features:

- [Grunt](http://gruntjs.com/) - watch, compass, coffee
- [Compass](http://compass-style.org/)
- [CoffeScript](http://coffeescript.org)


## Styles architecture

I use the [AMCSS](http://amcss.github.io/) philosophy to build small modules and keep a variables config in single place. I hardly use any *classes*, as almost everything could be an `am`; and *id*'s for custom single-case elements.

This is how the `SCSS` files are kept:

``` SCSS
// normalizations
base/_normalize.scss
base/_spacing.scss
base/_typography.scss

// config
config/helpers/_someHelper.scss
config/variables/_descriptive.scss
config/variables/_functional.scss
config/_fonts.scss
config/_helpers.scss
config/_resets.scss

// layout
layout/_base.scss
layout/_content.scss
layout/_footer.scss
layout/_header.scss

// all the am-modules
modules/someModule/_config.scss
modules/someModule/_module.scss

// aggregators for the main file
_base.scss
_config.scss
_layout.scss
_modules.scss

// the main file
main.scss
```
