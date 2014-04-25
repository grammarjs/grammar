
/**
 * Expose `StringToken`.
 */

exports.StringToken = StringToken;

/**
 * Expose `RegExpToken`.
 */

exports.RegExpToken = RegExpToken;

/**
 * Expose `ExpressionToken`.
 */

exports.ExpressionToken = ExpressionToken;

/**
 * Expose `StopToken`.
 */

exports.StopToken = StopToken;

/**
 * Initialize a new `StringToken`.
 *
 * @param {String} val
 */

function StringToken(val) {
  this.val = val;
}

/**
 * Parse.
 */

StringToken.prototype.parse = function(str, ctx){
  if (this.val === str.substr(ctx.pos, this.val.length)) {
    ctx.pos += this.val.length;
    return this.val;
  }
};

/**
 * Initialize a new `RegExpToken`.
 *
 * @param {String} val
 */

function RegExpToken(val) {
  var op = operator(val.source);
  if (op) this.operator = op;

  var val = val.source;
  var oneOrMore = '+' === val.substr(val.length - 1);
  var zeroOrMore = '*' === val.substr(val.length - 1);
  var many = oneOrMore || zeroOrMore;
  //var optional = '?' === val.substr(val.length - 1);
  if (many) val = val.substr(0, val.length - 1);
  this.pattern = new RegExp(val);
}

RegExpToken.prototype.parse = function(str, ctx){
  if (this.pattern.test(str.charAt(ctx.pos))) {
    return str.charAt(ctx.pos++);
  }
};

/**
 * A token used like a regexp for expressions.
 *
 * @param {String} val Name of expression(s)
 */

function ExpressionToken(val) {
  var op = operator(val);
  if (op) this.operator = op;
  var name = val.split(':')[1]; // TODO: handle namespaces
  if (this.operator) name = name.substr(0, name.length - 1);
  this.name = name;
  this.zeroplus = '*' === this.operator;
  this.oneplus = '+' === this.operator;
  this.many = this.zeroplus || this.oneplus;
  this.isExpression = true; // TODO: remove
}

/**
 * A singleton token used to know when
 * it's at the end of a matcher.
 */

function StopToken() {
  this.isLast = true;
}

/**
 * Extract trailing operator from a string.
 *
 * @param {String}
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