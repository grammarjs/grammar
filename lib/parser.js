
/**
 * Module dependencies.
 */

var Frame = require('./frame');

/**
 * Expose `Parser`.
 */

module.exports = Parser;

/**
 * Parsing context.
 *
 * @api private
 */

function Parser(grammar) {
  this.grammar = grammar;
  this.pos = 0;
  this.frame = new Frame(grammar.root);
  this.stack = [ this.frame ];
}

/**
 * Parse the string.
 */

Parser.prototype.parse = function(str){
  var token;
  var val;

  while (token = this.nextToken()) {
    if (token.isLast) {
      val = this.frame.matcher.apply(this, this.frame.value);
      if (this.frame.parent) {
        this.frame.parent.value.push(val);
      }
      continue;
    }

    if (token.isExpression) {
      this.frame = new Frame(this.grammar.expressions[token.name], this.frame);
      this.stack.push(this.frame);
      continue;
    }

    val = token.parse(str, this);

    if (val) {
      this.frame.value.push(val);
    } else {
      this.clearFrame();
      this.nextMatcher();
    }
  }

  return val;
};

/**
 * Get next token.
 *
 * @return {Token}
 */

Parser.prototype.nextToken = function(){
  this.frame.token = this.frame.matcher.tokens[this.frame.tokenIndex++];

  while (!this.frame.token) {
    this.frame.matcher = this.frame.expression.matchers[this.frame.matcherIndex++];

    while (!this.frame.matcher) {
      this.removeFrame();
      if (!this.frame) return; // done
    }

    this.frame.token = this.frame.matcher.tokens[this.frame.tokenIndex++];
  }

  return this.frame.token;
};

/**
 * Go to next matcher.
 */

Parser.prototype.nextMatcher = function(){

};

/**
 * Pop the current frame.
 */

Parser.prototype.removeFrame = function(){
  this.frame = this.frame.parent;
  this.stack.pop();
};

/**
 * Clear the current frame.
 */

Parser.prototype.clearFrame = function(){
  this.frame.value.length = 0;
};