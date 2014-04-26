
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
  this.prevPos = 0;
  this.frame = new Frame(grammar.root);
  this.stack = [ this.frame ];
}

/**
 * Parse the string.
 */

Parser.prototype.parse = function(str){
  var token;
  var val;

  while (token = this.next()) {
    //console.log(token);
    if (token.isLast) {
      val = this.frame.rule.apply(this, this.frame.value);
      if (this.frame.parent) {
        this.frame.parent.value.push(val);
      }
      continue;
    }

    if (token.isExpression) {
      this.push(this.grammar.expressions[token.name]);
      continue;
    }

    val = token.parse(str, this);

    if (val) {
      this.frame.offset += (this.pos - this.prevPos);
      this.prevPos = this.pos;
      this.frame.value.push(val);
    } else {
      //console.log('skip');
      // has to undo all the way up through the parent
      this.skip();
    }
  }

  return val;
};

/**
 * Get next token.
 *
 * @return {Token}
 */

Parser.prototype.next = function(){
  this.frame.token = this.frame.rule.tokens[this.frame.tokenIndex++];

  while (!this.frame.token) {
    this.frame.rule = this.frame.expression.rules[++this.frame.ruleIndex];

    while (!this.frame.rule) {
      this.pop();
      if (!this.frame) return; // done
    }

    this.frame.token = this.frame.rule.tokens[this.frame.tokenIndex++];
  }

  return this.frame.token;
};

/**
 * Go to next rule.
 */

Parser.prototype.skip = function(){
  // in here, if the parent token was :expression* or :expression?
  // it could still qualify as a match.
  
  this.pos = this.prevPos = this.pos - this.frame.offset;
  this.frame.offset = 0;
  this.frame.value.length = 0;
  this.frame.tokenIndex = 0;
  this.frame.rule = this.frame.expression.rules[++this.frame.ruleIndex];

  while (!this.frame.rule) {
    this.pop();
    // here it needs to tell the current frame to go to the next rule too, since it failed.
    // basically, the failure needs to bubble up.
    if (!this.frame) return; // done

    this.pos = this.prevPos = this.pos - this.frame.offset;
    this.frame.offset = 0;
    this.frame.value.length = 0;
    this.frame.tokenIndex = 0;
    this.frame.rule = this.frame.expression.rules[++this.frame.ruleIndex];
  }
};

/**
 * Pop the current frame.
 */

Parser.prototype.pop = function(){
  if (this.frame.parent) {
    this.frame.parent.offset += this.frame.offset;
  }

  this.frame = this.frame.parent;
  this.stack.pop();
};

/**
 * Push.
 */

Parser.prototype.push = function(expression){
  this.frame = new Frame(expression, this.frame);
  this.stack.push(this.frame);
};