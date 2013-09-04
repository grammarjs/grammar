
/**
 * Module dependencies.
 */

var slice = [].slice;

/**
 * Expose `expression`.
 */

exports = module.exports = expression;

/**
 * Expose `collection`.
 */

exports.collection = {};

/**
 * Get or define an expression.
 *
 * @param {String} name
 * @return {Expression}
 * @api public
 */

function expression(name) {
  return exports.has(name)
    ? exports.collection[name]
    : exports.collection[name] = new Expression(name);
}

/**
 * Check if expression exists.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

exports.has = function(name) {
  return exports.collection.hasOwnProperty(name);
};

/**
 * Instantiate a new `Expression`.
 *
 * @api private
 */

function Expression(name) {
  this.name = name;
  this.matchers = [];
}

/**
 * Patterns to match against.
 *
 * @chainable
 * @api public
 */

Expression.prototype.match = function(){
  var args = slice.call(arguments);
  
  // function to return match result
  var fn = 'function' === typeof args[args.length - 1]
    ? args.pop()
    : identityFn;

  args = normalize(args);

  // final function

  function exec(str, data) {
    var result = [];
    // going to set back to initial pos if it doesn't match.
    var pos = data.pos;
    for (var i = 0, n = args.length; i < n; i++) {
      var val = args[i](str, data);
      if (null == val) {
        // set it back to original since it failed.
        data.pos = pos;
        return;
      }
      result.push(val);
    }
    return fn.apply(this, result);
  }

  this.matchers.push(exec);
  
  return this;
};

/**
 * Parse input string into object
 * using all of the expression's matchers.
 *
 * @param {String} str Input string.
 * @param {Function} [fn] Callback function.
 * @api public
 */

Expression.prototype.parse = function(str, fn){
  var data = { pos: 0, failures: 0 };
  var result = this._parse(str, data);
  if (data.pos < str.length) {
    var val = str.length > 20 ? str.substr(data.pos, 20) + '...' : str;
    var msg = 'Expected end of input but "' + val + '" found';
    var err = new SyntaxError(msg);
    if (fn) return fn(err);
    throw err;
  }
  return result;
};

/**
 * Internal parse.
 *
 * @param {String} str Input string.
 * @param {Object} [data] Parent (starting) expression data.
 * @api private
 */

Expression.prototype._parse = function(str, data){
  var matchers = this.matchers;
  var result;

  for (var i = 0, n = matchers.length; i < n; i++) {
    result = matchers[i](str, data);
    // blank string '' also counts
    if (result != null) return result;
  }
};

/**
 * Function returning its parameter.
 *
 * @param {Mixed} val
 * @return {Mixed} val
 * @api private
 */

function identityFn(val) {
  // return slice.call(arguments);
  return val;
}

/**
 * Return's a function to match exact
 * string against input string starting at 
 * parser's current position.
 *
 * @param {String} val
 * @return {Function} exec
 * @api private
 */

function stringFn(val) {
  var len = val.length;

  function exec(str, data) {
    if (val === str.substr(data.pos, len)) {
      data.pos += len;
      return val;
    }
  }

  return exec;
}

/**
 * RegExp function.
 *
 * @param {String} val
 * @return {Function} exec
 * @api private
 */

function regExpFn(val) {
  var val = val.source;
  var oneOrMore = '+' === val.substr(val.length - 1);
  var zeroOrMore = '*' === val.substr(val.length - 1);
  var many = oneOrMore || zeroOrMore;
  //var optional = '?' === val.substr(val.length - 1);
  if (many) val = val.substr(0, val.length - 1);
  var pattern = new RegExp(val);

  if (many) {
    var exec = function exec(str, data) {
      var result = [];
      while (pattern.test(str.charAt(data.pos))) {
        result.push(str.charAt(data.pos));
        data.pos++;
      }

      return result.length
        ? result.join('')
        : (zeroOrMore ? '' : undefined);
    }
  } else {
    var exec = function exec(str, data) {
      if (pattern.test(str.charAt(data.pos))) {
        data.pos++;
        return str.charAt(data.pos - 1);
      }
    }
  }

  return exec;
}

/**
 * Return's a function to execute a named expression
 * on the input string.
 *
 * @param {String} val Name of expression
 * @return {Function} exec
 * @api private
 */

function namedFn(val) {
  var name = val.split(':')[1];
  var oneOrMore = '+' === name.substr(name.length - 1);
  var zeroOrMore = '*' === name.substr(name.length - 1);
  var many = oneOrMore || zeroOrMore;
  var optional = '?' === name.substr(name.length - 1);
  if (many || optional)
    name = name.substr(0, name.length - 1);
  
  if (many) {
    return function exec(str, data) {
      var results = [];
      var result = expression(name)._parse(str, data);
      
      while (result != null) {
        results.push(result);
        result = expression(name)._parse(str, data);
      }

      return results;
      // XXX: 1 or more, but length is zero case.
    }
  } else {
    return function exec(str, data) {
      var result = expression(name)._parse(str, data);
      return result;
      //return result
      //  ? result
      //  : (optional ? '' : result);
    }
  }
}

/**
 * Convert `.match` arguments into a standard format.
 *
 * @param {Array} args
 * @api private
 */

function normalize(args) {
  for (var i = 0, n = args.length; i < n; i++) {
    var val = args[i];
    
    // XXX: here we go through all the parsing expression types:
    // https://github.com/dmajda/pegjs#parsing-expression-types

    if (val.source) {
      // val instanceof RegExp
      val = regExpFn(val);
    } else if (/^:\w/.test(val)) {
      // :named-expression
      val = namedFn(val);
    } else {
      // exact match
      val = stringFn(val);
    }

    // set it to the compiled val
    args[i] = val;
  }

  return args;
}