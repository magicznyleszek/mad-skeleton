# CUACSS<sup>1</sup> philosophy

<sup>1</sup> Component and utility attribute-driven CSS

Basic architecture of CSS. It's ~~based on~~ inspired by:

- [AMCSS](https://amcss.github.io/)
- [Gemma](https://github.com/colepeters/gemma)
- [Organic CSS](http://krasimir.github.io/organic-css/)
- [Atomic Design](http://demo.patternlab.io)
- [Tachyons](http://tachyons.io/)

The base global prefix for all attribute modules is `gui-`.


## Architecture


### Settings

CSS variables, custom media and selectors.


### Basics

Normalisation and styles that target bare HTML elements (i.e. "resets").


### Components

Context-specific selectors for distinct components of an interface. They are
forbidden to mix with each other.

Components use the `c-` namespace.


### Utilities

Structure- and layout-related classes that do one, generic thing extremely well.
Can be naturally mixed with each other and with components -- as long as it
makes sense of course.

Utilities use the `u-` namespace.


## Attribute-modules naming structure

```
[<globalPrefix>-<namespace>-<name>{-<childName>||~=<modifierName>}]
```

AMs names are defined in a simple fashion. Attribute always starts with the
global prefix, followed by namespace and then name. If it's a child AM it
appends a single hyphen, followed by the child name.

Modifiers are a space-separated strings (you can use almost any character you
want, i.e. `[gui-m-column~="2/3"]`).
