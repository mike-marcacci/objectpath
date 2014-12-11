Important!
==========

This was all blatantly stolen from Mike Marcacci here: https://github.com/mike-marcacci/objectpath.git
I've made changes so that I can use this module with webpack and have submitted a PR to the original source.
When (if) that gets merged, I'll delete this repo.

ObjectPath
==========

[![Build Status](https://travis-ci.org/mike-marcacci/objectpath.svg)](https://travis-ci.org/mike-marcacci/objectpath)

Parse js object paths using both dot and bracket notation. Stringify an array of properties into a valid path.

- parse JS object reference fragments
- build JS object reference fragments
- supports presence of unicode characters
- supports presence of control characters in key names

Parse a Path
------------

ObjectPath.parse(str)

```js
var ObjectPath = require('objectpath');

ObjectPath.parse('a[1].b.c.d["e"]["f"].g');
// => ['a','1','b','c','d','e','f','g']
```

Build a Path String
-------------------

ObjectPath.stringify(arr, [quote='\'']);

```js
var ObjectPath = require('objectpath');

ObjectPath.stringify(['a','1','b','c','d','e','f','g']);
// => '[\'a\'][\'1\'][\'b\'][\'c\'][\'d\'][\'e\'][\'f\'][\'g\']'


ObjectPath.stringify(['a','1','b','c','d','e','f','g'],'"');
// => '["a"]["1"]["b"]["c"]["d"]["e"]["f"]["g"]'
```

Normalize a Path
----------------

ObjectPath.normalize(str)

```js
var ObjectPath = require('objectpath');

ObjectPath.parse('a[1].b.c.d["e"]["f"].g');
// => '["a"]["1"]["b"]["c"]["d"]["e"]["f"]["g"]'