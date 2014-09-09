
/**
 * Module dependencies.
 */

var type = require('component-type');

/**
 * Expose `Symbol`.
 */

module.exports = Symbol;

/**
 * Initialize a new `Symbol`.
 *
 * @param {String} val
 */

function Symbol(val) {
  // TODO: support all the parsing expression types
  // https://github.com/dmajda/pegjs#parsing-expression-types

  if (null == val) {
    this.isLast = true;
  } else if ('regexp' == type(val)) {
    this.isRegExp = true;
    this.parse = parseRegExp;
    var op = operator(val = val.source);
    if (op) {
      this.operator = op;
      val = val.substr(0, val.length - 1);
    }
    this.zeroplus = '*' === this.operator;
    this.oneplus = '+' === this.operator;
    this.many = this.zeroplus || this.oneplus;
    this.optional = '?' === this.operator;
    this.pattern = new RegExp(val);
  } else if (/^:\w/.test(val)) {
    this.isExpression = true;
    var op = operator(val);
    if (op) this.operator = op;
    var parts = val.split(':');
    if (parts.length == 3) {
      this.expression = parts[2];
      this.grammar = parts[1];
    } else {
      this.expression = parts[1];
    }
    if (this.operator) {
      this.expression = this.expression.substr(0, this.expression.length - 1);
    }
    this.zeroplus = '*' === this.operator;
    this.oneplus = '+' === this.operator;
    this.many = this.zeroplus || this.oneplus;
    this.optional = '?' === this.operator;
    this.isExpression = true; // TODO: remove
  } else {
    this.val = val;
    this.isString = true;
    this.parse = parseString;
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
 */

function parseString(str, parser) {
  if (this.val === str.substr(parser.pos, this.val.length)) {
    parser.pos += this.val.length;
    return this.val;
  }
}

/**
 * Parse RegExp.
 */

function parseRegExp(str, parser) {
  if (this.many) {
    var pos = parser.pos;
    var res = [];

    while (this.pattern.test(str.charAt(parser.pos))) {
      res.push(str.charAt(parser.pos));
      parser.pos++;
    }
    
    if (this.oneplus && !res.length) {
      parser.pos = pos;
      return;
    }

    return res.join('');
  }

  if (this.pattern.test(str.charAt(parser.pos))) {
    return str.charAt(parser.pos++);
  }

  if (this.optional) return '';
}

/**
 * Extract trailing operator from a string.
 *
 * @param {String} val
 */

function operator(val) {
  var c = val.charAt(val.length - 1);

  switch(c) {
    case '+':
    case '*':
    case '?':
      return c;
  }
}