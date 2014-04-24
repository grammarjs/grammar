
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
    if (token.isExpression) {
      this.frame = new Frame(this.grammar.expressions[token.name], this.frame);
      this.stack.push(this.frame);
      continue;
    }

    val = token.parse(str, this);

    if (val) {
      this.frame.result.push(val);
      // matched a full matcher
      if (!--this.frame.count) {
        val = this.frame.matcher.apply(this, this.frame.result.splice(
          this.frame.result.length - this.frame.total, 
          this.frame.total
        ));
        this.frame.result.push(val);
        if (this.frame.parent) {
          this.frame.parent.result.push(this.frame.result);
        }
        this.removeFrame();
      }
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
  this.frame.result.length = 0;
};

/**
 * Initialize a new `Frame`.
 *
 * @param {Expression} expression
 */

function Frame(expression, parent) {
  this.parent = parent;
  this.expression = expression;
  this.matcher = expression.matchers[0];
  this.matcherIndex = 0;
  this.tokenIndex = 0;
  this.result = [];
  this.token = null;
  this.total = this.matcher.tokens.length;
  this.count = this.total;
}