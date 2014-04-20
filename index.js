
/**
 * Module dependencies.
 */

var Expression = require('./lib/expression');
var Context = require('./lib/context');

/**
 * Expose `Grammar`.
 */

module.exports = Grammar;

/**
 * Initialize a new `Grammar`.
 *
 * @param {String} name
 * @api public
 */

function Grammar(name) {
  if (!name) throw new Error('A grammar must have a name');
  this.name = name;
  this.expressions = {};
  this.expression = this.expression.bind(this);
}

/**
 * Build off of other grammars.
 *
 * @chainable
 * @param {Grammar} grammar
 * @api public
 */

Grammar.prototype.use = function(grammar){
  this.expressions[grammar.name] = grammar;
  return this;
};

/**
 * Define an expression.
 *
 * @param {String} name
 * @return {Expression}
 */

Grammar.prototype.expression = function(name){
  var exp = new Expression(name);
  this.expressions[exp.name] = exp;
  if (this.name == exp.name) this.root = exp;
  return exp;
};

/**
 * Parse a string.
 *
 * It's up to the grammar on what gets returned.
 * Potentially this should allow for streaming.
 *
 * @param {String} str
 * @api public
 */

Grammar.prototype.parse = function(str){
  return (new Context(this)).parse(str);
};