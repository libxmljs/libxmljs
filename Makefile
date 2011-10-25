
all: ./build/Release/libxmljs.node

./build/Release/libxmljs.node: src/*.cc src/*.h
	node-waf configure build

clean:
	rm -rf build

test-verbose:
	node --expose_gc spec/tacular.js --verbose

test:
	node --expose_gc spec/tacular.js
