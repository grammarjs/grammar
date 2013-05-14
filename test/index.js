var expression = 'undefined' == typeof window
  ? require('..')
  : require('tower-expression');

var assert = 'undefined' == typeof window
  ? require('assert')
  : require('component-assert');

var scopes = require('tower-scope');

describe('expression', function(){
  describe('operators', function(){
    it('should parse simple math expression', function(){
      var fn = expression('1 + 1');
      assert(2 === fn());
      var fn = expression('2 * 2');
      assert(4 === fn());
    });

    it('should parse >', function(){
      var fn = expression('1 > 2');
      assert(false === fn());
    });

    it('should parse >=', function(){
      var fn = expression('1 >= 2');
      assert(false === fn());
      var fn = expression('1 >= 1');
      assert(true === fn());
    });

    it('should parse <', function(){
      var fn = expression('1 < 2');
      assert(true === fn());
    });

    it('should parse <=', function(){
      var fn = expression('2 <= 2');
      assert(true === fn());
      var fn = expression('2 <= 1');
      assert(false === fn());
    });
  });

  it('should parse attribute', function(){
    var fn = expression('createTodo');
    var string = [
        "function anonymous(scope) {"
      , "  return scope.get('createTodo')"
      , "}"
    ].join('\n');
    assert(string === fn.toString());
  });

  describe('function', function(){
    it('should parse method', function(){
      var fn = expression('createTodo()');
      var string = [
          "function anonymous(scope) {"
        , "  return scope.call('createTodo')"
        , "}"
      ].join('\n');
      assert(string === fn.toString());
    });

    it('should parse method with arguments', function(done){
      var fn = expression('create(todo)');
      var string = [
          "function anonymous(scope) {"
        , "  return scope.call('create', scope.get('todo'))"
        , "}"
      ].join('\n');
      assert(string === fn.toString());

      scopes('todo')
        .action('create', function(todo){
          assert('A todo!' === todo.title);
          done();
        });

      var ctx = scopes('todo').init({ todo: { title: 'A todo!' }});
      fn(ctx);
    });
  });
});