
var Grammar = require('./');
var RuleSet = require('./lib/rule-set');
var Symbol = require('./lib/symbol');
var Token = require('./lib/token');
var Rule = require('./lib/rule');
var assert = require('assert');

describe('symbol', function(){
  it('should support string', function(){
    var symbol = new Symbol('123');
    assert(symbol.isString);
  });

  it('should support regexp', function(){
    var symbol = new Symbol(/123/);
    assert(symbol.isRegExp);
  });

  describe('expression', function(){
    it('should support', function(){
      var symbol = new Symbol(':custom');
      assert(symbol.isExpression);
    });

    it('should support !', function(){
      var symbol = new Symbol('!:custom');
      assert(symbol.isExpression);
      assert(symbol.notMatchAndIgnore);
    });

    it('should support &', function(){
      var symbol = new Symbol('&:custom');
      assert(symbol.isExpression);
      assert(symbol.matchAndIgnore);
    });

    it('should support *', function(){
      var symbol = new Symbol(':custom*');
      assert(symbol.isExpression);
      assert(symbol.zeroPlus);
    });

    it('should support +', function(){
      var symbol = new Symbol(':custom+');
      assert(symbol.isExpression);
      assert(symbol.onePlus);
    });

    it('should support ?', function(){
      var symbol = new Symbol(':custom?');
      assert(symbol.isExpression);
      assert(symbol.optional);
    });

    it('should support $', function(){
      var symbol = new Symbol('$:custom');
      assert(symbol.isExpression);
      assert(symbol.returnChild);
    });

    it('should support complex ones', function(){
      var symbol = new Symbol('&:custom.name+');
      assert(symbol.isExpression);
      assert(symbol.matchAndIgnore);
      assert(symbol.onePlus);
    });
  });
});

describe('rule', function(){
  it('should test', function(){
    var rule = new Rule('something', [ 'a', 'b' ], args);
    assert(3 == rule.symbols.length);
  });

  it('should support +', function(){
    var rule = new Rule('something', [ /\d+/, '+', /\d/ ], args);
    assert(4 == rule.symbols.length);
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

function args() {
  return Array.prototype.slice.call(arguments);
}

function addition($1, $2, $3) {
  return parseInt($1) + parseInt($3);
}