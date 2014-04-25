
/**
 * Expose `Frame`.
 */

module.exports = Frame;

/**
 * Initialize a new `Frame`.
 *
 * @param {Expression} expression
 */

function Frame(expression, parent) {
  this.parent = parent;
  this.expression = expression;
  this.matcher = expression.matchers[0];
  this.matcherIndex = 0;
  this.tokenIndex = 0;
  this.value = [];
  this.token = null;
  this.offset = 0; // how much of the string it's gone forward
}