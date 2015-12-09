# Architecture

Basic architecture of CSS. It's based on [AMCSS](https://amcss.github.io/) and
[Gemma](https://github.com/colepeters/gemma).

The base global prefix for all attribute modules is `gui-`.


## Settings

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
want, i.e. `[gui-u-column~="2/3"]`).
