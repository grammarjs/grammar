
if ('undefined' === typeof window) {
  var Expression = require('..');
  var assert = require('assert');
} else {
  var Expression = require('expression-builder');
  var assert = require('component-assert');
}

describe('expression', function(){
  it('should define string expressions', function(){
    var grammar = new Expression('math');
    var expression = grammar.expression;

    expression('math').match('1', parseInt);

    var val = grammar.parse('1');
    assert(1 === val);
  });

  it('should define sub-expressions', function(){
    var grammar = new Expression('math');
    var expression = grammar.expression;

    expression('math').match(':numb', ':plus', ':numb', addition);
    expression('plus').match('+', value);
    expression('numb').match(/\d/, value);

    var val = grammar.parse('1+2');
    assert(3 === val);
  });

  it('should skip non-matching matchers', function(){
    var grammar = new Expression('math');
    var expression = grammar.expression;

    expression('math')
      .match(':numb', ':plus', ':numb', addition)
      .match(':numb', ':minus', ':numb', subtraction);
    
    expression('plus')
      .match('+', value);

    expression('minus')
      .match('-', value);

    expression('numb')
      .match(/\d/, value);

    var val = grammar.parse('1-2');
    assert(-1 === val);
  });

  it('should handle :expression+', function(){
    var grammar = new Expression('math');
    var expression = grammar.expression;

    expression('math').match(':numb+', ':plus', ':numb+', addition);
    expression('plus').match('+', value);
    expression('numb').match(/\d/, value);

    var val = grammar.parse('10+20');
    assert(30 === val);
  });

  it('should handle :expression*');
  it('should handle :expression?');
  it('should handle :nested:expression');
  it('should handle /\\d+/');

  // it('should define nested expressions', function(){
  //   var grammar = new Expression('digits');
  //   var expression = grammar.expression;

  //   expression('digits').match(':digit+');
  //   expression('digit').match(/\d/);

  //   var val = grammar.parse('123');
  //   console.log(val);
  // });
});

function addition($1, $2, $3) {
  return parseInt($1) + parseInt($3);
}

function subtraction($1, $2, $3) {
  return parseInt($1) - parseInt($3);
}

function value(val) {
  return val;
}