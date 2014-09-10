
/**
 * Module dependencies.
 */

var Symbol = require('./symbol');
var Token = require('./token');
var stop = new Symbol;
var slice = [].slice;
var toString = Object.prototype.toString;

/**
 * Expose `Rule`.
 */

module.exports = Rule;

/**
 * Initialize a new `Rule`.
 *
 * @param {Array} symbols
 */

function Rule(symbols) {
  var fn = isFunction(symbols[symbols.length - 1]) && symbols.pop();

  for (var i = 0, n = symbols.length; i < n; i++) {
    symbols[i] = new Symbol(symbols[i]);
  }

  symbols.push(stop);

  this.symbols = symbols;

  // if we aren't given a function
  // if all symbols are not expressions,
  // then we're going to join everything into a single string by default.
  if (!fn) {
    fn = stringFn;
    symbols.forEach(function(symbol){
      if (symbol.isExpression) {
        fn = arrayFn;
        return false;
      }
    });
  }

  this.fn = fn;
}

/**
 * Pass symbol matches to callback.
 *
 * @param {Parser} parser
 * @param {Array} matches
 */

Rule.prototype.apply = function(parser, matches){
  // return this.fn.apply(parser, matches);
  // TODO: refactor!
  this.parser = parser;
  var val = this.fn.apply(this, matches);
  delete this.parser;
  return val;
};

/**
 * Function returning strings joined together.
 *
 * @api private
 */

function stringFn() {
  return slice.call(arguments).join('');
}

/**
 * Function returning items separately.
 *
 * @api private
 */

function arrayFn() {
  var arr = [];
  var name;
  var content;
  for (var i = 0, n = arguments.length; i < n; i++) {
    name = this.symbols[i].expression || 'string';
    content = arguments[i];
    arr.push(new Token(name, content));
  }
  return arr;
  // return slice.call(arguments);
}

/**
 * Check if value is a function.
 *
 * @param {Object} val
 * @return {Boolean}
 * @api private
 */

function isFunction(val) {
  return '[object Function]' === toString.call(val);
}