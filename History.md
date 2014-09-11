
0.5.0 / 2014-09-10
==================

 * refactored token so it now has special types, which makes it easier to build the parse tree. we can come back to it later and change/simplify how it works before 1.0
 * simplify test setup
 * remove component.json and npmignore for now

0.4.0 / 2014-09-10
==================

 * make all `.match` calls return tokens, so you don't need to pass functions by default.
 * however, `match` only contains simple strings, it will just return those as strings, not tokens. these are then "leaf" nodes.

0.3.2 / 2014-09-09
==================

 * pass flags to regexp

0.3.0 / 2014-09-09
==================

 * add better operator/advancing support (and refactor)

0.2.0 / 2014-09-09
==================

 * create single grammarjs/grammar repo with all the stuff it needs
