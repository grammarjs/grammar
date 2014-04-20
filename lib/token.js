
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
  this.operator = operator(val.source);

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
  this.operator = operator(val);
  var name = val.split(':')[1]; // TODO: handle namespaces
  if (this.operator) name = name.substr(0, name.length - 1);
  this.name = name;
}

/**
 * Parse? Not sure it should even have this.
 */

ExpressionToken.prototype.parse = function(str, ctx){
  var result = this.children[name]._parse(str, ctx);
  return result;
  //return result
  //  ? result
  //  : (optional ? '' : result);
};

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