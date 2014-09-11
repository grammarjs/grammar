
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
  var content = [];
  for (var i = 0, n = matches.length; i < n; i++) {
    if (Array.isArray(matches[i])) {
      // if you have `$:some.expression`,
      // that's saying "return the child token"
      var name = this.symbols[i].returnChild
        ? '$array.join'
        : '$array';
      
      content.push(new Token(name, matches[i]));
    } else if (this.symbols[i].returnChild) {
      // wrap in special token
      content.push(new Token('$join', matches[i]));
    } else {
      if (matches[i] instanceof Token) {
        content.push(matches[i]);
      } else {
        if (matches[i])
          content.push(new Token('$string', matches[i]))
      }
    }
  }

  // keep it simple and return an object instead of a 
  // nested object if the array only has one item.

  content = 1 == content.length
    ? content[0]
    : content;

  return new Token('$rule', content, this.name);
};