
# Parsing Expression Grammar

![experimental](http://img.shields.io/badge/status-experimental-orange.svg?style=flat)
[![Build Status](http://img.shields.io/travis/grammarjs/grammar/v0.6.svg?style=flat)](https://travis-ci.org/grammarjs/grammar)

PEG-like expression builder for JavaScript. <1kb.

## Installation

```
$ npm install grammarjs-grammar
```

browser:

```
$ component install grammarjs/grammar
```

## Features

- easily define a custom parsing expression grammar (PEG)
- reuse and recombine PEGs with `.use(grammar)`
- expressions can be referenced by name, so complex grammars are very readable

## Overview

A `grammar` is a set of expressions that share a common namespace. This means you can define named expressions within a grammar, and access them from anywhere else within the grammar.

Expressions can't exist outside of a grammar. A grammar itself is just an expression, it is the start of the expression hierarchy.

You can nest grammars, and so build on top of them easily!

## Examples

```js
var Grammar = require('grammarjs-grammar');
var Parser = require('grammarjs-recursive-parser');
var grammar = new Grammar('math');
var expression = grammar.expression;

expression('math')
  .match(':number', ':operator', ':number', function(left, operator, right){
    switch (operator) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return left / right;
    }
  });

expression('number')
  .match(/\d+/, parseInt);

expression('operator')
  .match('+')
  .match('-')
  .match('*')
  .match('/');

var parser = new Parser(grammar);
var val = parser.parse('6*8'); // 48
```

Nesting grammars. Say the above simple math grammar was in a module called `math-grammar` and we had another one called `function-grammar`. We could create a new grammar that builds on both of those:

```js
var math = require('math-grammar');
var fn = require('function-grammar');
var Grammar = require('grammarjs-grammar');

var grammar = new Grammar('foo');
grammar.use(math);
grammar.use(fn);
```

Then you could use their names in your grammar:

```js
expression('foo')
  .match(':math')
  .match(':fn');
```

Or just use a subset of them:

```js
expression('foo')
  .match(':fn', ':math:operator', ':fn');
```

## Test

```
make test
```

## Selectors

```
punctuation
punctuation.whitespace
punctuation.definition
literal
literal.string
literal.string.quote
literal.string.quote.double
literal.string.quote.single
literal.string
literal.number.integer
literal.number.decimal
literal.boolean
literal.boolean
keyword.control
keyword.other.var
keyword.operator
keyword.operator.gte
keyword.operator.percent
comment
comment.line
comment.line.dash
comment.line.dash.double
comment.line.percent
comment.block
type.struct (or entity?)
type.function
type.object
type.array
type.tag
type.pointer
type.interface
type.class
type.channel
type.map
constant
character.source
character.unicode
expression
expression.assignment
statement
statement.if
statement.switch
statement.continue
statement.debugger
statement.for
statement.while
statement.return
operator
delimiter https://golang.org/ref/spec
declaration
declaration.variable
declaration.class
declaration.type
declaration.function
support
```

## Notes

- http://stackoverflow.com/questions/5109905/are-there-any-javascript-frameworks-for-parsing-auto-completing-a-domain-specifi
- https://github.com/cgrand/parsley
- http://hackage.haskell.org/package/incremental-parser-0.2.3.2/docs/Text-ParserCombinators-Incremental.html
- error productions (http://www.codekana.com/blog/2009/04/02/on-the-speed-of-light-innovation-and-the-future-of-parsing/)
- http://manual.macromates.com/en/language_grammars

## Licence

MIT
