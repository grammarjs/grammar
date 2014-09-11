
/**
 * Module dependencies.
 */

var type = require('component-type');

/**
 * Expose `Symbol`.
 */

module.exports = Symbol;

/**
 * Patterns.
 */

var regexp = /^(.*?)([+?*])?$/;
var rexpression = /^([\!\&\$])?:([a-zA-Z0-9\.\-\_]+?)([+?*])?$/;

/**
 * Initialize a new `Symbol`.
 *
 * @param {String} val
 */

function Symbol(val) {
  this.isLast = null == val;
  this.isRegExp = 'regexp' == type(val);
  this.isExpression = !!rexpression.test(val);

  // build the different types of symbols
  
  if (this.isLast) {

  } else if (this.isRegExp) {
    val.source.match(regexp);
    var flags = val.ignoreCase
      ? 'i'
      : '';
    this.pattern = new RegExp(RegExp.$1, flags);
    if (RegExp.$2) this.postfix = RegExp.$2;
  } else if (this.isExpression) {
    val.match(rexpression);
    // &:some.name means it must match, and it wont consume
    // !:some.name means it must not match, and it wont consume
    if (RegExp.$1) this.prefix = RegExp.$1;
    this.expression = RegExp.$2;
    // :some.name+ means it must match one or more, etc.
    if (RegExp.$3) this.postfix = RegExp.$3;
  } else {
    this.val = val;
    this.isString = true;
  }

  // check if this is something to match but not consume
  
  if (this.prefix) {
    this.matchAndIgnore =
      '&' === this.prefix;
    this.notMatchAndIgnore =
      '!' === this.prefix;
    this.returnChild =
      '$' === this.prefix;
  }

  // check how many times we should match (or if it's optional)
  
  if (this.postfix) {
    this.optional =
      '?' === this.postfix;
    this.zeroPlus =
      '*' === this.postfix;
    this.onePlus =
      '+' === this.postfix;
    this.many = this.zeroPlus || this.onePlus;
  }
}