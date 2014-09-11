
/**
 * Expose `Token`.
 */

exports = module.exports = Token;

/**
 * Initialize a new `Token`.
 *
 * @param {String} type
 * @param {String|Array|Token} content
 * @param {String} [name]
 * @api public
 */

function Token(type, content, name) {
  this.type = type;
  if (name) this.name = name;
  this.content = content;
}