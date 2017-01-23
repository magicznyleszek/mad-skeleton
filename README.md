# Boilerplate assets

Boilerplate assets for quick start with web project.

Features:

- pure npm-scripts-driven building
- svg icons
- [cssnext](http://cssnext.io/)
- [MADCSS][^madcss]

## [^madcss]: MADCSS<sup>1</sup> philosophy

<sup>1</sup> Modular Attribute-Driven CSS

Basic architecture is ~~based on~~ inspired by:

- [AMCSS](https://amcss.github.io/)
- [Gemma](https://github.com/colepeters/gemma)
- [Organic CSS](http://krasimir.github.io/organic-css/)
- [Atomic Design](http://demo.patternlab.io)
- [Tachyons](http://tachyons.io/)

The base global prefix for all attribute modules is `i-`.

### Attribute-modules naming structure

```
[<globalPrefix>-<name>{-<childName>||~=<modifierName>}]
```

Attribute names are defined in a simple fashion. Attribute always starts with the global prefix, followed by module name. If it's a child, then it appends a single hyphen, followed by the child name. Note: you shouldn't go deeper: i.e. grandchildren are forbidden.

Modifiers are a space-separated strings (you can use almost any character you want, i.e. `[i-column~='2/3 isActive ++']`).

### Variables

All global variables. Note that this should be **the only place** for adding new colors.

### Setup

Root styles for the whole website/app and some simple typography normalisations.

### Modules

These can be either structure- and layout-related selectors that do one, generic thing extremely well -- or a context-specific selectors for distinct components of an interface. Can be naturally mixed with each other -- as long as it makes sense of course.
