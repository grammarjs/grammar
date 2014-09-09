
var Grammar = require('..');
var RuleSet = require('../lib/rule-set');
var Symbol = require('../lib/symbol');
var Token = require('../lib/token');
var Rule = require('../lib/rule');
var assert = require('assert');

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

  describe('symbol', function(){
    it('should support string', function(){
      var symbol = new Symbol('123');
      assert(symbol.isString);
    });

    it('should support regexp', function(){
      var symbol = new Symbol(/123/);
      assert(symbol.isRegExp);
    });

    it('should support :expression', function(){
      var symbol = new Symbol(':custom');
      assert(symbol.isExpression);
    });
  });

  describe('rule', function(){
    it('should test', function(){
      var rule = new Rule([ 'a', 'b' ], args);
      assert(3 == rule.symbols.length);
    });
  });

  describe('rule-set', function(){
    it('should test', function(){
      var set = new RuleSet('operator')
        .match('+')
        .match('-')
        .match('*')
        .match('/');

      assert(4 == set.rules.length);
    });
  });
});

function args() {
  return Array.prototype.slice.call(arguments);
}