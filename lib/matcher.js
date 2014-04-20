
/**
 * Module dependencies.
 */

var Token = require('./Token');
var toString = Object.prototype.toString;
var isRegExp = function(val) {
  return '[object RegExp]' === toString.call(val);
};

/**
 * Expose `Matcher`.
 */

module.exports = Matcher;

/**
 * Initialize a new `Matcher`.
 *
 * @param {Array} tokens
 * @param {Function} fn Callback if all tokens match string.
 */

function Matcher(tokens, fn) {
  for (var i = 0, n = tokens.length; i < n; i++) {
    tokens[i] = new Token(tokens[i]);
  }

  this.tokens = tokens;
  this.fn = fn;
}

/**
 * Pass token matches to callback.
 *
 * @param {Context} ctx
 * @param {Array} matches
 */

Matcher.prototype.apply = function(ctx, matches){
  this.fn.apply(ctx, matches);
};