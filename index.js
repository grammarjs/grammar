
/**
 * Module dependencies.
 */

var operator = require('tower-operator')
  , escapeRegExp = 'undefined' === typeof window
    ? require('escape-regexp-component')
    : require('escape-regexp');

/**
 * Expose `expression`.
 */

module.exports = expression;

/**
 * RegExps.
 */

var filterRegExp = / +| +/;
var fnRegExp = /(\w+)\(([^\)]*)\)/;
var numberRegExp = /^\d+(?:\.\d+)*$/
var propertyRegExp = /[\w\d\.]+/
var operatorRegExp = [];
for (var i = 0, n = operator.collection.length; i < n; i++) {
  operatorRegExp.push(escapeRegExp(operator.collection[i]));
}
operatorRegExp = new RegExp('(' + propertyRegExp.source + ') *(' + operatorRegExp.join('|') + ') *(' + propertyRegExp.source + ')');

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
  return Function('scope', '  return ' + parseExpression(val));
}

function filterExpression(val) {
  val = val.split(filterRexExp);
  for (var i = 0, n = val.length; i < n; i++) {
    // XXX
    // val[i] = x
  }
  return val
}

function parseExpression(val) {
  return keyValueExpression(val)
    || fnExpression(val)
    || operatorExpression(val)
    || propertyExpression(val);
}

// <input on-keypress="enter:createTodo">
// <input on-keypress="enter : createTodo">
// <input on-keypress="enter:create(todo)">
function keyValueExpression(val) {
  // XXX: todo
  // val.match(fnRegExp);
}

// <input on-keypress="create(todo)">
function fnExpression(val) {
  if (!val.match(fnRegExp)) return;

  var name = RegExp.$1;
  var args = RegExp.$2;
  
  if (args) {
    return "scope.call('" + name + "', " + argumentsExpression(args) + ")";
  } else {
    return "scope.call('" + name + "')";
  }
}

function argumentsExpression(val) {
  val = val.split(/ *, */);
  var result = [];
  for (var i = 0, n = val.length; i < n; i ++) {
    result.push(parseExpression(val[i]));
  }
  return result.join(', ');
}

function operatorExpression(val) {
  if (!val.match(operatorRegExp)) return;

  var left = RegExp.$1;
  var operator = RegExp.$2;
  var right = RegExp.$3;

  var code = parseExpression(left)
    + ' ' + operator + ' '
    + parseExpression(right);

  return code;
}

function propertyExpression(val) {
  return numberExpression(val)
    || pathExpression(val);
}

function numberExpression(val) {
  if (val.match(numberRegExp)) return val;
}

function pathExpression(val) {
  return "scope.get('" + val + "')";
}