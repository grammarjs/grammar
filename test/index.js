var expression = 'undefined' == typeof window
  ? require('..')
  : require('tower-expression');

var assert = 'undefined' == typeof window
  ? require('assert')
  : require('component-assert');

var content = require('tower-content');

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
    var fn = expression('todo');
    var string = [
        "function anonymous(scope) {"
      , "  return scope.get('todo')"
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

      content('todo')
        .action('create', function(todo){
          assert('A todo!' === todo.title);
          done();
        });

      var ctx = content('todo').init({ todo: { title: 'A todo!' } });
      fn(ctx);
    });
  });

  describe('bindings', function(){
    it('should handle `+` (to)', function(){
      var fn = expression('[+] title');
      assert(fn.bindTo);
      assert(!fn.bindFrom);
    });

    it('should handle `-` (from)', function(){
      var fn = expression('[-] title');
      assert(fn.bindFrom);
      assert(!fn.bindTo);
    });

    it('should handle `=` (both)', function(){
      var fn = expression('[=] title');
      assert(fn.bindTo);
      assert(fn.bindFrom);
      assert(false === fn.broadcast);
    });

    it('should handle binding with broadcasting', function(){
      var fn = expression('[*=] title');
      assert(fn.bindTo);
      assert(fn.bindFrom);
      assert(true === fn.broadcast);
    });
  });

  describe('options', function(){
    it('should parse options', function(){
      var fn = expression('todo in todos [max:10, buffer:5]');
      assert('{"max":10,"buffer":5}' === JSON.stringify(fn.opts));
    });
  });

  describe('dependencies', function(){
    it('should collect the property dependencies referenced', function(){
      var fn = expression('create(todo)');
      assert('todo' === fn.deps.join(','));
      var fn = expression('create(todo, event)');
      assert('todo,event' === fn.deps.join(','));
      var fn = expression('todo && event');
      assert('todo,event' === fn.deps.join(','));
      var fn = expression('todo || event');
      assert('todo,event' === fn.deps.join(','));
      var fn = expression('todos.length > 10');
      assert('todos.length' === fn.deps.join(','));
    });
  });
});