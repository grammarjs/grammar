
#
# Task helpers.
#

TEST_BROWSER = test/index.html
TEST_NODE = test/index.js
COMPONENT = component
SRC = index.js

#
# Build.
#

build: build-node build-browser

#
# Build node.
#

build-node: install-node

#
# Build browser.
#

build-browser: components $(SRC)
	@$(COMPONENT) build --dev

#
# Clean.
#

clean: clean-node clean-browser

#
# Clean node.
#

clean-node: 
	@-rm -rf node_modules npm-debug.log

#
# Clean browser.
#

clean-browser:
	@-rm -rf components build

#
# Install.
#

install: install-node install-browser

#
# Install node.
#

install-node: package.json node_modules

#
# Install browser.
#

install-browser: component.json components

#
# Test.
#

test: build test-node test-browser

#
# Test node.
#

test-node: node_modules
	@mocha -R spec $(TEST_NODE)

#
# Test browser.
#

test-browser: components
	@open $(TEST_BROWSER)

#
# Phony targets.
#

.PHONY: clean
.PHONY: clean-node
.PHONY: clean-browser
.PHONY: test
.PHONY: test-node
.PHONY: test-browser

#
# Target for `components` folder.
#

components: component.json
	@$(COMPONENT) install --dev

#
# Target for `node_modules` folder.
#

node_modules: package.json
	@npm install