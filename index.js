
/**
 * Module dependencies.
 */

var RuleSet = require('./lib/rule-set');

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
  if (name) this.name = name;
  this.rules = {};
  this.rule = this.rule.bind(this);
}

/**
 * Use `plugin` function.
 *
 * @chainable
 * @param {Function} plugin
 * @api public
 */

Grammar.prototype.use = function(plugin){
  plugin(this);
  return this;
};

/**
 * Starting grammar rule.
 * 
 * @param {String} name
 * @return {Expression}
 */

Grammar.prototype.start = function(name){
  return this.root = this.rule(name);
};

/**
 * Define a grammar rule.
 * 
 * @param {String} name
 * @return {RuleSet}
 */

Grammar.prototype.rule = function(name){
  if (this.rules[name]) return this.rules[name];
  var set = new RuleSet(name);
  this.rules[set.name] = set;
  if (this.name == set.name) this.root = set;
  return set;
};