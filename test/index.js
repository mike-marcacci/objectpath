'use strict';

var assert = require('chai').assert;
var ObjectPath = require('../index.js');

var parse = ObjectPath.parse;
var stringify = ObjectPath.stringify;

describe('Parse', function(){
	it('parses simple paths in dot notation', function(){
		assert.deepEqual(parse('a'), ['a'], 'incorrectly parsed single node');
		assert.deepEqual(parse('a.b.c'), ['a','b','c'], 'incorrectly parsed multi-node');
	});

	it('parses simple paths in bracket notation', function(){
		assert.deepEqual(parse('["c"]'), ['c'], 'incorrectly parsed single headless node');
		assert.deepEqual(parse('a["b"]["c"]'), ['a','b','c'], 'incorrectly parsed multi-node');
		assert.deepEqual(parse('["a"]["b"]["c"]'), ['a','b','c'], 'incorrectly parsed headless multi-node');
	});

	it('parses a numberic nodes in bracket notation', function(){
		assert.deepEqual(parse('[5]'), ['5'], 'incorrectly parsed single headless numeric node');
		assert.deepEqual(parse('[5]["a"][3]'), ['5','a','3'], 'incorrectly parsed headless numeric multi-node');
	});

	it('parses a combination of dot and bracket notation', function(){
		assert.deepEqual(parse('a[1].b.c.d["e"]["f"].g'), ['a','1','b','c','d','e','f','g']);
	});

	it('parses unicode characters', function(){
		assert.deepEqual(parse('∑´ƒ©∫∆.ø'), ['∑´ƒ©∫∆','ø'], 'incorrectly parsed unicode characters from dot notation');
		assert.deepEqual(parse('["∑´ƒ©∫∆"]["ø"]'), ['∑´ƒ©∫∆','ø'], 'incorrectly parsed unicode characters from bracket notation');
	});

	it('parses nodes with control characters', function(){
		assert.deepEqual(parse('["a.b."]'), ['a.b.'], 'incorrectly parsed dots from inside brackets');
		assert.deepEqual(parse('["\""][\'\\\'\']'), ['"','\''], 'incorrectly parsed escaped quotes');
		assert.deepEqual(parse('["\'"][\'"\']'), ['\'','"'], 'incorrectly parsed unescaped quotes');
		assert.deepEqual(parse('["\\""][\'\\\'\']'), ['"','\''], 'incorrectly parsed escaped quotes');
		assert.deepEqual(parse('[\'\\"\']["\\\'"]'), ['\\"','\\\''], 'incorrectly parsed escape characters');
		assert.deepEqual(parse('["\\"]"]["\\"]\\"]"]'), ['"]','"]"]'], 'incorrectly parsed escape characters');
		assert.deepEqual(parse('["[\'a\']"][\'[\\"a\\"]\']'), ['[\'a\']','[\\"a\\"]'], 'incorrectly parsed escape character');
	});
});

describe('Stringify', function(){
	it('stringifys simple paths with single quotes', function(){
		assert.deepEqual(stringify(['a']), 'a', 'incorrectly stringified single node');
		assert.deepEqual(stringify(['a','b','c']), 'a.b.c', 'incorrectly stringified multi-node');
		assert.deepEqual(stringify(['a'], '\''), 'a', 'incorrectly stringified single node with excplicit single quote');
		assert.deepEqual(stringify(['a','b','c'], '\''), 'a.b.c', 'incorrectly stringified multi-node with excplicit single quote');
	});

	it('stringifys simple paths with double quotes', function(){
		assert.deepEqual(stringify(['a'],'"'), 'a', 'incorrectly stringified single node');
		assert.deepEqual(stringify(['a','b','c'],'"'), 'a.b.c', 'incorrectly stringified multi-node');
	});

	it('stringifys a numberic nodes in bracket notation with single quotes', function(){
		assert.deepEqual(stringify(['5']), '[5]', 'incorrectly stringified single headless numeric node');
		assert.deepEqual(stringify(['5','a','3']), '[5].a[3]', 'incorrectly stringified headless numeric multi-node');
	});

	it('stringifys a numberic nodes in bracket notation with double quotes', function(){
		assert.deepEqual(stringify(['5'],'"'), '[5]', 'incorrectly stringified single headless numeric node');
		assert.deepEqual(stringify(['5','a','3'],'"'), '[5].a[3]', 'incorrectly stringified headless numeric multi-node');
	});

	it('stringifys a combination of dot and bracket notation with single quotes', function(){
		assert.deepEqual(stringify(['a','1','b','c','d','e','f','g']), 'a[1].b.c.d.e.f.g');
		assert.deepEqual(stringify(['a','1','b','c','d','e','f','g'],null,true), "['a']['1']['b']['c']['d']['e']['f']['g']");
	});

	it('stringifys a combination of dot and bracket notation with double quotes', function(){
		assert.deepEqual(stringify(['a','1','b','c','d','e','f','g'],'"'), 'a[1].b.c.d.e.f.g');
		assert.deepEqual(stringify(['a','1','b','c','d','e','f','g'],'"',true), '["a"]["1"]["b"]["c"]["d"]["e"]["f"]["g"]');
	});

	it('stringifys unicode characters with single quotes', function(){
		assert.deepEqual(stringify(['∑´ƒ©∫∆']), '[\'∑´ƒ©∫∆\']', 'incorrectly stringified single node path with unicode');
		assert.deepEqual(stringify(['∑´ƒ©∫∆','ø']), '[\'∑´ƒ©∫∆\'][\'ø\']', 'incorrectly stringified multi-node path with unicode characters');
	});

	it('stringifys unicode characters with double quotes', function(){
		assert.deepEqual(stringify(['∑´ƒ©∫∆'],'"'), '["∑´ƒ©∫∆"]', 'incorrectly stringified single node path with unicode');
		assert.deepEqual(stringify(['∑´ƒ©∫∆','ø'],'"'), '["∑´ƒ©∫∆"]["ø"]', 'incorrectly stringified multi-node path with unicode characters');
	});

	it("stringifys nodes with control characters and single quotes", function(){
		assert.deepEqual(stringify(["a.b."],"'"), "['a.b.']", "incorrectly stringified dots from inside brackets");
		assert.deepEqual(stringify(["'","\\\""],"'"), "['\\\'']['\\\\\"']", "incorrectly stringified escaped quotes");
		assert.deepEqual(stringify(["\"","'"],"'"), "['\"']['\\'']", "incorrectly stringified unescaped quotes");
		assert.deepEqual(stringify(["\\'","\\\""],"'"), "['\\\\\\'']['\\\\\"']", "incorrectly stringified escape character");
		assert.deepEqual(stringify(["[\"a\"]","[\\'a\\']"],"'"), "['[\"a\"]']['[\\\\\\'a\\\\\\']']", "incorrectly stringified escape character");
	});
	
	it("stringifys nodes with backslash", function(){
		const originalProperty = ' \\" \\\\" \\\\\\';
		const path = stringify([' \\" \\\\" \\\\\\'], '"');
		const finalProperty = JSON.parse(path.substring(1, path.length - 1));

		assert.deepEqual(finalProperty, originalProperty, 'incorrectly stringified escaped backslash');
	});

	it('stringifys nodes with control characters and double quotes', function(){
		assert.deepEqual(stringify(['a.b.'],'"'), '["a.b."]', 'incorrectly stringified dots from inside brackets');
		assert.deepEqual(stringify(['"','\\\''],'"'), '["\\\""]["\\\\\'"]', 'incorrectly stringified escaped quotes');
		assert.deepEqual(stringify(['\'','"'],'"'), '["\'"]["\\""]', 'incorrectly stringified unescaped quotes');
		assert.deepEqual(stringify(['\\"','\\\''],'"'), '["\\\\\\""]["\\\\\'"]', 'incorrectly stringified escape character');
		assert.deepEqual(stringify(['[\'a\']','[\\"a\\"]'],'"'), '["[\'a\']"]["[\\\\\\"a\\\\\\"]"]', 'incorrectly stringified escape character');
	});
});

describe('Backslash support tests', function(){
	var property, expected;
	function noBuckets(path) {
		return path.replace(/^\[(.*)\]$/, '$1');
	}
	function digest(property) {
		return stringify(parse(property), '"');
	}

	it('should escape a quote', function(){
		assert.deepEqual(digest('a"'), String.raw`["a\""]`, 'incorrectly escape quote');
	});

	it('should escape backslash', function(){
		assert.deepEqual(digest('lol\\\\eded.ededed.deede'), String.raw`["lol\\\\eded"].ededed.deede`, 'incorrectly escape quote');
	});

	it('should escape one backslash', function(){
		property = String.raw`a\"`;
		expected = String.raw`["a\\\""]`; // equivalent: expected = '["a\\\\\\""]'
		assert.deepEqual(digest(property), expected, 'incorrectly escape single backslash');
		assert.deepEqual(JSON.stringify(property), noBuckets(expected), 'incorrectly escape single backslash');
	});

	it('should escape several backslash', function(){
		property = String.raw`a\\"`;
		expected = String.raw`["a\\\\\""]`; // equivalent: expected = '["a\\\\\\""]'
		assert.deepEqual(digest(property), expected, 'incorrectly escape several backslash');
		assert.deepEqual(JSON.stringify(property), noBuckets(expected), 'incorrectly escape several backslash');
		assert.deepEqual(digest(digest(digest(digest(property)))), expected, 'incorrectly escape after several stringify&parse on the same value');
	});

	it('should be a valid js path (accepted by ECMAScript)', function(){
		property = String.raw`a\\"`;
		expected = String.raw`["a\\\\\""]`; // equivalent: expected = '["a\\\\\\""]'
		assert.deepEqual(digest(property), expected, 'invalid path syntax');
		assert.doesNotThrow(function () {
			try {
				eval(digest(property)); // only with trusted string
				return true;
			} catch (e) {
				if (e.message.indexOf("Cannot read property") !== -1) // mean undefined
					return true;
				else // Syntax error
					throw new Error("wrong with ES");
			}
		}, 'invalid path syntax');
	});
});

describe('Normalize', function(){
	it('normalizes a string', function(){
		assert.deepEqual(ObjectPath.normalize('a.b["c"]'), 'a.b.c', 'incorrectly normalized a string with single quotes');
		assert.deepEqual(ObjectPath.normalize('a.b["c"]','"'), 'a.b.c', 'incorrectly normalized a string with double quotes');
	});

	it('normalizes an array', function(){
		assert.deepEqual(ObjectPath.normalize(['a','b','c']), 'a.b.c', 'incorrectly normalized an array with single quotes');
		assert.deepEqual(ObjectPath.normalize(['a','b','c'],'"'), 'a.b.c', 'incorrectly normalized an array with double quotes');
	});
});
