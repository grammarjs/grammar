# Expression

PEG-like expression builder for JavaScript. <1kb.

## Installation

```
npm install parsejs-expression
```

browser:

```
component install parsejs/expression
```

## Examples

```js
var Expression = require('expression');
var exp = new Expression;
exp.match(/[0-9]+/, '*', /[0-9]+/, function(left, times, right){
  return left * right;
});
var val = exp.parse('6*8'); // 42
```

## Licence

MIT