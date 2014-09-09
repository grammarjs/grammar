
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
var rexpression = /^([\!\&])?:([a-zA-Z0-9\.\-\_]+?)([+?*])?$/;

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
    this.pattern = new RegExp(RegExp.$1);
    if (RegExp.$2) this.operator = RegExp.$2;
    this.parse = parseRegExp;
  } else if (this.isExpression) {
    val.match(rexpression);
    // &:some.name means it must match, and it wont consume
    // !:some.name means it must not match, and it wont consume
    if (RegExp.$1) this.advancer = RegExp.$1;
    this.expression = RegExp.$2;
    // :some.name+ means it must match one or more, etc.
    if (RegExp.$3) this.operator = RegExp.$3;
  } else {
    this.val = val;
    this.isString = true;
    this.parse = parseString;
  }

  // check if this is something to match but not consume
  if (this.advancer) {
    this.matchAndIgnore =
      '&' === this.advancer;
    this.notMatchAndIgnore =
      '!' === this.advancer;
  }

  // check how many times we should match (or if it's optional)
  if (this.operator) {
    this.optional =
      '?' === this.operator;
    this.zeroPlus =
      '*' === this.operator;
    this.onePlus =
      '+' === this.operator;
    this.many = this.zeroPlus || this.onePlus;
  }
}

/**
 * Parse it's pattern.
 *
 * @param {String} str
 * @param {Object} parser
 */

Symbol.prototype.parse = function(str, parser){

};

/**
 * Parse string.
 *
 * @param {String} str
 * @param {Object} parser
 * @api private
 */

function parseString(str, parser) {
  if (this.val === str.substr(parser.pos, this.val.length)) {
    parser.pos += this.val.length;
    return this.val;
  }
}

/**
 * Parse RegExp.
 *
 * @param {String} str
 * @param {Object} parser
 * @api private
 */

function parseRegExp(str, parser) {
  if (this.many) {
    var pos = parser.pos;
    var res = [];

    while (this.pattern.test(str.charAt(parser.pos))) {
      res.push(str.charAt(parser.pos));
      parser.pos++;
    }
    
    // reset if we want to match one or more but didn't find matches.
    if (this.onePlus && !res.length) {
      parser.pos = pos;
      return;
    }
    
    return res.join('');
  } else if (this.pattern.test(str.charAt(parser.pos))) {
    return str.charAt(parser.pos++);
  } else if (this.optional) {
    return '';
  }
}