
/**
 * Module dependencies.
 */

var operator = require('tower-operator');

/**
 * Expose `expression`.
 */

module.exports = expression;

/**
 * Parse a directive expression.
 *
 * XXX: Maybe there are "named" expressions later.
 *
 * @param {String} val
 * @return {Function} fn Expression to evaluate
 *    against the current `scope`.
 */

function expression(val) {
  if (val.indexOf(':') != -1) {
    return keyValueExpression(val);
  } else if (val.indexOf('(') != -1) {
    return functionExpression(val);
  }

  return Function('scope', 'return 1 + 1');
}

// <input on-keypress="enter:createTodo">
// <input on-keypress="enter : createTodo">
function keyValueExpression(val) {
  val = val.split(/ +: +/);
  return { key: val[0], val: expression(val[0]) };
}

// <input on-keypress="enter:create(todo)">
// <input on-keypress="[enter] create(todo)">
function functionExpression(val) {

}

function argumentsExpression(val) {

}