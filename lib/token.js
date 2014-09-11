
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