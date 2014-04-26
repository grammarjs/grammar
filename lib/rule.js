
/**
 * Module dependencies.
 */

var type = require('component-type');
var token = require('./token');
var RegExpToken = token.RegExpToken;
var ExpressionToken = token.ExpressionToken;
var StringToken = token.StringToken;
var StopToken = token.StopToken;
var toString = Object.prototype.toString;
var stopper = new StopToken;

/**
 * Expose `Rule`.
 */

module.exports = Rule;

/**
 * Initialize a new `Rule`.
 *
 * @param {Array} tokens
 * @param {Function} fn Callback if all tokens match string.
 */

function Rule(tokens, fn) {
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

  tokens.push(stopper);

  this.tokens = tokens;
  this.fn = fn;
}

/**
 * Pass token matches to callback.
 *
 * @param {Context} ctx
 * @param {Array} matches
 */

Rule.prototype.apply = function(ctx, matches){
  return this.fn.apply(ctx, matches);
};