'use strict';

var assert = require('chai').assert;
var ObjectPath = require('../index.js');

describe('ObjectPath', function(){
	it('parses simple paths in dot notation', function(){
		assert.deepEqual(ObjectPath.parse('a'), ['a'], 'incorrectly parsed single node');
		assert.deepEqual(ObjectPath.parse('a.b.c'), ['a','b','c'], 'incorrectly parsed multi-node');
	});

	it('parses simple paths in bracket notation', function(){
		assert.deepEqual(ObjectPath.parse('["c"]'), ['c'], 'incorrectly parsed single headless node');
		assert.deepEqual(ObjectPath.parse('a["b"]["c"]'), ['a','b','c'], 'incorrectly parsed multi-node');
		assert.deepEqual(ObjectPath.parse('["a"]["b"]["c"]'), ['a','b','c'], 'incorrectly parsed headless multi-node');
	});

	it('parses a numberic nodes in bracket notation', function(){
		assert.deepEqual(ObjectPath.parse('[5]'), ['5'], 'incorrectly parsed single headless numeric node');
		assert.deepEqual(ObjectPath.parse('[5]["a"][3]'), ['5','a','3'], 'incorrectly parsed headless numeric multi-node');
	});

	it('parses a combination of dot and bracket notation', function(){
		assert.deepEqual(ObjectPath.parse('a[1].b.c.d["e"]["f"].g'), ['a','1','b','c','d','e','f','g']);
	});

	it('parses utf8 characters', function(){
		assert.deepEqual(ObjectPath.parse('∑´ƒ©∫∆.ø'), ['∑´ƒ©∫∆','ø'], 'incorrectly parsed utf8 characters from dot notation');
		assert.deepEqual(ObjectPath.parse('["∑´ƒ©∫∆"]["ø"]'), ['∑´ƒ©∫∆','ø'], 'incorrectly parsed utf8 characters from bracket notation');
	});

	it('parses nodes with control characters', function(){
		assert.deepEqual(ObjectPath.parse('["a.b."]'), ['a.b.'], 'incorrectly parsed dots from inside brackets');
		assert.deepEqual(ObjectPath.parse('["\""][\'\\\'\']'), ['"','\\\''], 'incorrectly parsed escaped quotes');
		assert.deepEqual(ObjectPath.parse('["\'"][\'"\']'), ['\'','"'], 'incorrectly parsed unescaped quotes');
		assert.deepEqual(ObjectPath.parse('["\\""][\'\\\'\']'), ['\\"','\\\''], 'incorrectly parsed escape character');
		assert.deepEqual(ObjectPath.parse('["[\'a\']"][\'[\\"a\\"]\']'), ['[\'a\']','[\\"a\\"]'], 'incorrectly parsed escape character');
	});
});