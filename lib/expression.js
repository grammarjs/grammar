
/**
 * Module dependencies.
 */

var Rule = require('./rule');
var slice = [].slice;
var toString = Object.prototype.toString;
var isFunction = function(val) {
  return '[object Function]' === toString.call(val);
};

/**
 * Expose `Expression`.
 */

module.exports = Expression;

/**
 * Initialize a new `Expression`.
 *
 * @param {String} name
 * @api public
 */

function Expression(name) {
  if (!name) throw new Error('An expression must have a name');
  this.name = name;
  this.rules = [];
}

/**
 * Patterns to match against.
 *
 * @chainable
 * @api public
 */

Expression.prototype.match = function(){
  var args = slice.call(arguments);
  
  // function to return match result

  var fn = isFunction(args[args.length - 1])
    ? args.pop()
    : identityFn;

  this.rules.push(new Rule(args, fn));
  return this;
};

/**
 * Function returning its parameter.
 *
 * @api private
 */

function identityFn() {
  return slice.call(arguments);
}