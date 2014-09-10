
/**
 * Module dependencies.
 */

var Rule = require('./rule');
var slice = [].slice;

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
  this.rule = new Rule(args);
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