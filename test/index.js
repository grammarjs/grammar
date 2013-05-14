var expression = 'undefined' == typeof window
  ? require('..')
  : require('tower-expression');

var assert = 'undefined' == typeof window
  ? require('assert')
  : require('component-assert');

describe('expression', function(){
  it('should test', function(){
    var fn = expression('1 + 1');
    console.log(fn.toString())
    assert(2 === fn());
  });
});