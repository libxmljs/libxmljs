CFLAGS := $(shell node --cflags) -I/usr/local/include/libxml2 -I/usr/local/include
LIBS := -lv8 -lxml2
NODEJS = $(shell which node)

all: libxmljs.a

node: libxmljs.a
	rm -f libxmljs.node
	ln -s libxmljs.a libxmljs.node

libxmljs.a: src/libxmljs.o src/parser.o src/sax_parser.o Makefile
	g++ -bundle -bundle_loader ${NODEJS} ${LIBS} src/libxmljs.o src/parser.o src/sax_parser.o -o libxmljs.a

src/natives.h: src/sax_parser.js Makefile
	tools/build_natives.py src/sax_parser.js src/natives.h

src/libxmljs.o: src/libxmljs.cc src/natives.h Makefile
	g++ ${CFLAGS} src/libxmljs.cc -c -o src/libxmljs.o

src/parser.o: src/parser.cc Makefile
	g++ ${CFLAGS} src/parser.cc -c -o src/parser.o

src/sax_parser.o: src/sax_parser.cc Makefile
	g++ ${CFLAGS} src/sax_parser.cc -c -o src/sax_parser.o

clean:
	rm -f src/*.{o,a}
	rm -f src/natives.h
	rm -f libxmljs.a libxmljs.node

test: node
	node spec/tacular.js

.PHONY: clean
