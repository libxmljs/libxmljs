SCONS=scons

node:
	@$(SCONS) libxmljs.node

node-debug:
	@$(SCONS) libxmljs.node debug=1

clean:
	@$(SCONS) -c
	@$(SCONS) -c libxmljs.node

test-verbose:
	node --expose_gc spec/tacular.js --verbose

test:
	node --expose_gc spec/tacular.js
