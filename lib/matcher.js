
/**
 * Module dependencies.
 */

var type = require('component-type');
var token = require('./token');
var RegExpToken = token.RegExpToken;
var ExpressionToken = token.ExpressionToken;
var StringToken = token.StringToken;
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
    // TODO: support all the parsing expression types
    // https://github.com/dmajda/pegjs#parsing-expression-types

    if ('regexp' == type(tokens[i])) {
      tokens[i] = new RegExpToken(tokens[i]);
    } else if (/^:\w/.test(tokens[i])) {
      tokens[i] = new ExpressionToken(tokens[i]);
    } else {
      tokens[i] = new StringToken(tokens[i]);
    }
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
  return this.fn.apply(ctx, matches);
};