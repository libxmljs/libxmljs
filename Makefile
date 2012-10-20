
target=./build/Release/libxmljs.node

all: $(target)

build/:
	node-gyp configure

$(target): build/ src/*.cc src/*.h
	node-gyp build

clean:
	rm -rf build

check test: $(target)
	npm test

.PHONY: test clean
