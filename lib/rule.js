
/**
 * Module dependencies.
 */

var Symbol = require('./symbol');
var stop = new Symbol;

/**
 * Expose `Rule`.
 */

module.exports = Rule;

/**
 * Initialize a new `Rule`.
 *
 * @param {Array} symbols
 * @param {Function} fn Callback if all symbols match string.
 */

function Rule(symbols, fn) {
  for (var i = 0, n = symbols.length; i < n; i++) {
    symbols[i] = new Symbol(symbols[i]);
  }

  symbols.push(stop);

  this.symbols = symbols;
  this.fn = fn;
}

/**
 * Pass symbol matches to callback.
 *
 * @param {Parser} parser
 * @param {Array} matches
 */

Rule.prototype.apply = function(parser, matches){
  return this.fn.apply(parser, matches);
};