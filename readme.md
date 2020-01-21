ObjectPath
==========

[![Join the chat at https://gitter.im/mike-marcacci/objectpath](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mike-marcacci/objectpath?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/mike-marcacci/objectpath.svg?branch=master)](https://travis-ci.org/mike-marcacci/objectpath)

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

ObjectPath.parse('a[1].b.c.d["e"]["f-f"].g');
// => ['a','1','b','c','d','e','f-f','g']
```

Build a Path String
-------------------

ObjectPath.stringify(arr, [quote="'"], [forceQuote=false]);

```js
var ObjectPath = require('objectpath');

ObjectPath.stringify(['a','1','b','c','d-d','e']);
// => "a[1].b.c['d-d'].e"


ObjectPath.stringify(['a','1','b','c','d-d','e'],'"');
// => 'a[1].b.c["d-d"].e'


ObjectPath.stringify(['a','1','b','c','d-d','e'],"'", true);
// => "['a']['1']['b']['c']['d-d']['e']"
```

Normalize a Path
----------------

ObjectPath.normalize(str, [quote="'"], [forceQuote=false])

```js
var ObjectPath = require('objectpath');

ObjectPath.normalize('a[1].b.c.d["e"]["f-f"].g');
// => "a[1].b.c.d.e['f-f'].g"

ObjectPath.normalize('a[1].b.c.d["e"]["f-f"].g', '"');
// => 'a[1].b.c.d.e["f-f"].g'

ObjectPath.normalize('a[1].b.c.d["e"]["f-f"].g', "'", true);
// => "['a']['1']['b']['c']['d']['e']['f-f']['g']"
