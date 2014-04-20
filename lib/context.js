
/**
 * Expose `Context`.
 */

module.exports = Context;

/**
 * Parsing context.
 *
 * @api private
 */

function Context(grammar) {
  this.grammar = grammar;
  this.pos = 0;
  // stacks
  this.expressions = [ grammar.root ];
  this.expression = this.expressions[0];
  this.matchers = this.expression.matchers;
  this.matcher = this.matchers[0];
  this.tokens = this.matcher.tokens;
  this.token = this.tokens[0];
  this.count = [ this.tokens.length ];
  this.matcherIndex = 0;
  this.tokenIndex = 0;
  this.result = [];
}

/**
 * Parse the string.
 */

Context.prototype.parse = function(str){
  var token;
  var val;

  while (token = this.nextToken()) {
    val = token.parse(str, this);

    if (val) {
      this.result.push(val);
      // matched a full matcher
      if (!--this.count[this.matcherIndex]) {
        this.count.pop();

        var subset = this.result.splice(
          this.result.length - this.tokens.length, 
          this.tokens.length
        );
        this.matcher.apply(this, subset);
      }
    } else {
      this.count.pop();
      this.nextMatcher();
    }
  }
};

/**
 * Get next token.
 *
 * @return {Token}
 */

Context.prototype.nextToken = function(){
  this.token = this.tokens[this.tokenIndex++];
  if (!this.token) this.nextMatcher();
  return this.token;
};

/**
 * Go to next matcher.
 */

Context.prototype.nextMatcher = function(){
  this.tokenIndex = 0;
  this.matcher = this.matchers[this.matcherIndex++];
  if (!this.matcher) this.nextExpression();
  if (!this.matcher) return;
  this.tokens = this.matcher.tokens;
  this.token = this.tokens[0];
  this.count[this.matcherIndex] = this.tokens.length;
};

/**
 * Go to next expression.
 */

Context.prototype.nextExpression = function(){
  this.matcherIndex = 0;
  this.expression = this.expressions.pop();
  if (!this.expression) {
    this.matchers = [];
    this.matcher = null;
    this.tokens = [];
    this.token = null;
    return; // complete!
  }
  this.matchers = this.expression.matchers;
  // XXX: handle if there are no matchers
  this.matcher = this.matchers[0];
}