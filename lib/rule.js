
/**
 * Module dependencies.
 */

var Symbol = require('./symbol');
var Token = require('./token');
var stop = new Symbol;
var slice = [].slice;

/**
 * Expose `Rule`.
 */

module.exports = Rule;

/**
 * Initialize a new `Rule`.
 *
 * @param {String} name
 * @param {Array} symbols
 */

function Rule(name, symbols) {
  this.name = name;
  for (var i = 0, n = symbols.length; i < n; i++) {
    symbols[i] = new Symbol(symbols[i]);
  }
  symbols.push(stop);
  this.symbols = symbols;
}

/**
 * Compile symbols to pass back to parent.
 *
 * @param {Parser} parser
 * @param {Array} matches
 */

Rule.prototype.apply = function(parser, matches){
  for (var i = 0, n = matches.length; i < n; i++) {
    // if you have `$:some.expression`,
    // that's saying "return the child token"
    if (this.symbols[i].returnChild) {
      matches[i] = matches[i].content;
    }
  }

  // keep it simple and return an object instead of a 
  // nested object if the array only has one item.

  var content = 1 == matches.length
    ? matches[0]
    : matches;

  return new Token(this.name, content);
};