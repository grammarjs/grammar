
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

See the [tests](https://github.com/grammarjs/recursive-parser/blob/master/test/index.js) for examples. Basically, in building a grammar, you are just building a Concrete Syntax Tree. This can be used for syntax highlighting, linting, and lots of other things. The next goal is to then find a standard mapping of the CST to the AST (Abstract Syntax Tree). This way you can define a grammar once, use it in an editor if you want, and also convert it to executable code.

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
