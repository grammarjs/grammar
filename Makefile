
#
# Helpers.
#

MOCHA = ./node_modules/.bin/mocha

#
# Default target.
#

default: test

#
# Clean.
#

clean:
	@-rm -rf build components node_modules npm-debug.log
	@npm cache clean

#
# Test.
#

test: node_modules
	@$(MOCHA) -R spec test.js

#
# Phony targets.
#

.PHONY: test

#
# Target for `node_modules` folder.
#

node_modules: package.json
	@npm install
	@touch node_modules