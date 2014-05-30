
if ('undefined' === typeof window) {
  var Grammar = require('..');
  var assert = require('assert');
} else {
  var Grammar = require('grammarjs-grammar');
  var assert = require('component-assert');
}

describe('grammar', function(){
  it('should define root expression', function(){
    var grammar = new Grammar('math');
    grammar.expression('math').match('+');
    assert(grammar.root);
  });
});