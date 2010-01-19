SCONS=scons

node:
	@$(SCONS) libxmljs.node

node-debug:
	@$(SCONS) libxmljs.node debug=1

clean:
	@$(SCONS) -c
	@$(SCONS) -c libxmljs.node

test:
	node spec/tacular.js
