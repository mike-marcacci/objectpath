ObjectPath
==========

Parse js object paths using both dot and bracket notation. Stringify an array of properties into a valid path.

Parse a Path
------------

```js
ObjectPath.parse('a[1].b.c.d["e"]["f"].g')
// => ['a','1','b','c','d','e','f','g']
```

Build a Path
------------

```js
ObjectPath.parse('a[1].b.c.d["e"]["f"].g')
// => ['a','1','b','c','d','e','f','g']
```