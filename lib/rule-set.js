
/**
 * Module dependencies.
 */

var Rule = require('./rule');
var slice = [].slice;
var toString = Object.prototype.toString;

/**
 * Expose `RuleSet`.
 */

module.exports = RuleSet;

/**
 * Initialize a new `RuleSet`.
 *
 * @param {String} name
 * @api public
 */

function RuleSet(name) {
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

RuleSet.prototype.match = function(){
  var args = slice.call(arguments);
  
  // function to return match result

  var fn = isFunction(args[args.length - 1])
    ? args.pop()
    : identityFn;

  this.rule = new Rule(args, fn);
  this.rules.push(this.rule);
  return this;
};

/**
 * Lookahead.
 */

RuleSet.prototype.peek = function(){
  this.rule.peek = slice.call(arguments);
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