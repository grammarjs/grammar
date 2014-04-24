
if ('undefined' === typeof window) {
  var Expression = require('..');
  var assert = require('assert');
} else {
  var Expression = require('expression-builder');
  var assert = require('component-assert');
}

describe('expression', function(){
  // it('should define expression', function(){
  //   var exp = new Expression('addition');
  //   exp.match(/\d+/, ' + ', /\d+/, addition);
  //   var val = exp.parse('1 + 2');
  //   assert('addition' == exp.name);
  //   assert(3 === val);
  // });

  // it('should use sub-expressions', function(){
  //   var a = new Expression('plus').match('+');
  //   var b = new Expression('numb').match(/\d/);
  //   var c = new Expression('math').match(':numb', ':plus', ':numb', addition);
  //   c.use(a);
  //   c.use(b);

  //   var val = c.parse('1+2');
  //   assert(3 === val);
  // });

  it('should define sub-expressions', function(){
    var grammar = new Expression('math');
    var expression = grammar.expression;

    expression('math').match(':numb', ':plus', ':numb', addition);
    expression('plus').match('+', value);
    expression('numb').match(/\d/, value);

    var val = grammar.parse('1+2');
    console.log(val);
    //assert(3 === val);
  });

  it('should define string expressions', function(){
    var grammar = new Expression('math');
    var expression = grammar.expression;

    expression('math').match('1', parseInt);

    var val = grammar.parse('1');
    assert(1 === val);
  });

  // it('should define nested expressions', function(){
  //   var grammar = new Expression('digits');
  //   var expression = grammar.expression;

  //   expression('digits').match(':digit+');
  //   expression('digit').match(/\d/);

  //   var val = grammar.parse('123');
  //   console.log(val);
  // });

  // it('should define grammar');
});

function addition($1, $2, $3) {
  return parseInt($1) + parseInt($3);
}

function value(val) {
  return val;
}