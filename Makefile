
target=./build/Release/xmljs.node

all: $(target)

build/:
	node-gyp configure

$(target): build/ src/*.cc src/*.h
	node-gyp build

clean:
	rm -rf build

test: clean $(target)
	npm test

.PHONY: test clean
