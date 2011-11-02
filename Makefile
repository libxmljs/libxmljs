
target=./build/Release/libxmljs.node

all: $(target)

$(target): src/*.cc src/*.h
	node-waf configure build

clean:
	rm -rf build

test-verbose: $(target)
	node --expose_gc spec/tacular.js --verbose

test: $(target)
	node --expose_gc spec/tacular.js
