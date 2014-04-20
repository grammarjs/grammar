
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
  this.matcherIndex = 0; // already went to this one
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

        val = this.matcher.apply(this, subset);
      }
    } else {
      this.count.pop();
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

Context.prototype.nextToken = function(){
  this.token = this.tokens[this.tokenIndex++];

  tokens:
  while (!this.token) {
    this.matcher = this.matchers[++this.matcherIndex];

    matchers:
    while (!this.matcher) {
      this.expressions.pop();
      this.expression = this.expressions[this.expressions.length - 1];
      if (!this.expression) return; // done!
      this.matchers = this.expression.matchers;
      this.matcher = this.matchers[0];
      this.matcherIndex = 0;
    }

    this.tokens = this.matcher.tokens;
    this.token = this.tokens[0];
    this.tokenIndex = 0;

    //TODO: how to handle ExpressionToken?
    if (this.token && this.token.expression) {
      this.expression = this.grammar.expressions[this.token.expression];
      this.expressions.push(this.expression);
      this.matchers = this.expression.matchers;
      this.matcher = this.matchers[0];
      this.matcherIndex = 0;
    }

    this.tokens = this.matcher.tokens;
    this.token = this.tokens[0];
  }

  return this.token;
};

/**
 * Go to next matcher.
 */

Context.prototype.nextMatcher = function(){
  while (!this.matcher) {
    this.expressions.pop();
    this.expression = this.expressions[this.expressions.length - 1];
    if (!this.expression) return; // done!
    this.matchers = this.expression.matchers;
    this.matcher = this.matchers[0];
    this.matcherIndex = 0;
  }

  this.tokens = this.matcher.tokens;
  this.token = this.tokens[0];
  this.tokenIndex = 0;
};

/**
 * Go to next expression.
 */

Context.prototype.nextExpression = function(){
  this.matcherIndex = 0;
  this.expressions.pop();
  this.expression = this.expressions[this.expressions.length - 1];
}