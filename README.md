# Boilerplate assets

Boilerplate assets for quick start with web project.

Features:

- [Grunt](http://gruntjs.com/) - watch, compass, coffee
- [Compass](http://compass-style.org/)
- [CoffeScript](http://coffeescript.org)


## Styles architecture

I loosely follow the [AMCSS](http://amcss.github.io/) technique and a tested
directory structure. All UI elements are build as small modules with custom
cases rarely appearing (assuming the UI is properly designed). All custom
variables are kept in base or module-dedicated config files. I hardly use
`.classes`, as almost everything could and should be a module; for custom
single-case elements i use `#ids`.

This is how the files structure looks like:

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
