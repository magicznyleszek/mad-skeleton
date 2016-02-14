# OACSS<sup>1</sup> philosophy

<sup>1</sup> Organic attribute-driven CSS

Basic architecture of CSS. It's ~~based on~~ inspired by:

- [AMCSS](https://amcss.github.io/)
- [Gemma](https://github.com/colepeters/gemma)
- [Organic CSS](http://krasimir.github.io/organic-css/)
- [Atomic Design](http://demo.patternlab.io)
- [Tachyons](http://tachyons.io/)

The base global prefix for all attribute modules is `gui-`. Of course you can
alwas switch to `data-gui-` if you feel uneasy and exposed to danger.


## Architecture


### Atoms

Atoms are CSS variables -- this should be the only place for adding new colors,
sizes and other basic values. Treat this as a project palette.


### Setup

Root styles for the whole website/app and some simple typography normalisations.


### Molecules

Structure- and layout-related classes that do one, generic thing extremely well.
Can be naturally mixed with each other and with organisms -- as long as it makes
sense of course.

Molecules use the `m-` namespace.


### Organisms

Context-specific selectors for distinct components of an interface. They are
forbidden to mix with each other, sorry.

Organisms use the `o-` namespace.


## Attribute-modules naming structure

```
[<globalPrefix>-<namespace>-<name>{-<childName>||~=<modifierName>}]
```

AMs names are defined in a simple fashion. Attribute always starts with the
global prefix, followed by namespace and then name. If it's a child AM it
appends a single hyphen, followed by the child name.

Modifiers are a space-separated strings (you can use almost any character you
want, i.e. `[gui-m-column~='2/3']`).
