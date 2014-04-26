
/**
 * Module dependencies.
 */

var Expression = require('parsejs-expression');

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
  if (this.expressions[name]) return this.expressions[name];
  var exp = new Expression(name);
  this.expressions[exp.name] = exp;
  if (this.name == exp.name) this.root = exp;
  return exp;
};