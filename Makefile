
#
# Default target.
#

default: test

#
# Clean.
#

clean:
	@-rm -rf node_modules npm-debug.log

#
# Test.
#

test: node_modules
	@mocha -R spec test/index.js

#
# Phony targets.
#

.PHONY: test

#
# Target for `node_modules` folder.
#

node_modules: package.json
	@npm install