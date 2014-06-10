
if ('undefined' === typeof window) {
  var Grammar = require('..');
  var assert = require('assert');
} else {
  var Grammar = require('grammarjs-grammar');
  var assert = require('component-assert');
}

describe('grammar', function(){
  it('should define root rule', function(){
    var grammar = new Grammar('math');
    grammar.rule('math').match('+');
    assert(grammar.root);
  });

  it('should support setting `.start` rule', function(){
    var grammar = new Grammar('math');
    grammar.rule('add').match('+');
    grammar.start('add');
    assert(grammar.root == grammar.rule('add'));
  });
});