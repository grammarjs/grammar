# Tower Expression

## Installation

node.js:

```bash
$ npm install tower-expression
```

browser:

```bash
$ component install tower/expression
```

## Examples

```js
var expression = require('tower-expression');
```

Simple expression:

```js
var fn = expression('1 + 1');
fn();
```

Expression evaluated against `scope`:

```js
var scopes = require('tower-scope');

// define some scope attributes used in the DOM.
scopes('dashboard')
  .attr('profit', 'float', 0.0);

// instantiate the scope
var scope = scopes('dashboard').init({ profit: 1000000 });

// define a `currency` filter
var filter = require('tower-filter');
filter('currency', function(val){
  return '$' + val + '.00';
});

// define an expression
// (this automatically gets generated from dom directives)
var fn = expression('profit | currency');
fn(scope); // $1,000,000.00
```

## Licence

MIT