
/**
 * Module dependencies.
 */

var type = require('component-type');

/**
 * Expose `Token`.
 */

module.exports = Token;

/**
 * Initialize a new `Token`.
 *
 * @param {String|RegExp} val
 */

function Token(val) {
  this.val = val;
  this.expressions = false;

  // TODO: support all the parsing expression types
  // https://github.com/dmajda/pegjs#parsing-expression-types

  if ('regexp' == type(val)) {
    this.parse = compileRegExp(val);
  } else if (/^:\w/.test(val)) {
    this.parse = compileExpression(val);
    this.expressions = true;
  } else {
    this.parse = compileString(val);
  }
}

/**
 * Return's a function to match exact
 * string against input string starting at 
 * parser's current position.
 *
 * @param {String} val
 * @return {Function} exec
 * @api private
 */

function compileString(val) {
  var len = val.length;

  function exec(str, ctx) {
    if (val === str.substr(ctx.pos, len)) {
      ctx.pos += len;
      return val;
    }
  }

  return exec;
}

/**
 * RegExp function.
 *
 * @param {String} val
 * @return {Function} exec
 * @api private
 */

function compileRegExp(val) {
  var val = val.source;
  var oneOrMore = '+' === val.substr(val.length - 1);
  var zeroOrMore = '*' === val.substr(val.length - 1);
  var many = oneOrMore || zeroOrMore;
  //var optional = '?' === val.substr(val.length - 1);
  if (many) val = val.substr(0, val.length - 1);
  var pattern = new RegExp(val);

  var c;
  if (many) {
    var exec = function exec(str, ctx) {
      var result = [];
      while (pattern.test(c = str.charAt(ctx.pos))) {
        result.push(c);
        ctx.pos++;
      }

      return result.length
        ? result.join('')
        : (zeroOrMore ? '' : undefined);
    }
  } else {
    var exec = function exec(str, ctx) {
      if (pattern.test(str.charAt(ctx.pos))) {
        ctx.pos++;
        return str.charAt(ctx.pos - 1);
      }
    }
  }

  return exec;
}

/**
 * Return's a function to execute a named expression
 * on the input string.
 *
 * @param {String} val Name of expression
 * @return {Function} exec
 * @api private
 */

function compileExpression(val) {
  var name = val.split(':')[1];
  var oneOrMore = '+' === name.substr(name.length - 1);
  var zeroOrMore = '*' === name.substr(name.length - 1);
  var many = oneOrMore || zeroOrMore;
  var optional = '?' === name.substr(name.length - 1);
  if (many || optional)
    name = name.substr(0, name.length - 1);
  
  if (many) {
    return function exec(str, ctx) {
      var results = [];
      var result = this.children[name]._parse(str, ctx);
      
      while (result != null) {
        results.push(result);
        result = this.children[name]._parse(str, ctx);
      }

      return results;
      // XXX: 1 or more, but length is zero case.
    }
  } else {
    return function exec(str, ctx) {
      var result = this.children[name]._parse(str, ctx);
      return result;
      //return result
      //  ? result
      //  : (optional ? '' : result);
    }
  }
}