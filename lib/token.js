
/**
 * Expose `Token`.
 */

exports = module.exports = Token;

/**
 * Initialize a new `Token`.
 *
 * @param {String} type
 * @param {String|Array|Token} content
 * @api public
 */

function Token(type, content) {
  this.type = type;
  this.content = content;
}

/**
 * Grammar helper.
 *
 * @param {String} val
 * @api public
 */

exports.value = function(val){
  return new Token(this.expression.name, val);
};

/**
 * Grammar helper.
 *
 * @api public
 */

exports.passthrough = function(){
  var arr = [];
  for (var i = 0, n = arguments.length; i < n; i++) {
    if (Array.isArray(arguments[i])) {
      arr.push.apply(arr, arguments[i]);
    } else {
      arr.push(arguments[i]);
    }
  }
  return new Token(this.expression.name, arr);
};