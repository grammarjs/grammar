# Expression Builder

PEG-like expression builder for JavaScript. <1kb.

## Installation

```
npm install expressionjs-expression
```

browser:

```
component install expressionjs/expression
```

## Examples

```js
var Expression = require('expression');
```

Simple expression:

```js
var exp = new Expression;
exp.match(/\d+/, ' ', '*', ' ', \d+, function(left, $2, operator, $4, right){
  return left * right;
});
var val = exp.parse('6 * 8'); // 42
```

## Licence

MIT