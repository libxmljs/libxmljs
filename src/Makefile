all: libxmljs.a
 
CFLAGS := $(shell node --cflags) -I/usr/local/include/libxml2 -I/usr/local/include
LIBS := -lv8 -lxml2
NODEJS = $(shell which node)

natives.h: sax_parser.js Makefile
	../tools/build_natives.py

libxmljs.o: libxmljs.cc natives.h Makefile
	g++ ${CFLAGS} libxmljs.cc -c -o libxmljs.o

parser.o: parser.cc Makefile
	g++ ${CFLAGS} parser.cc -c -o parser.o

sax_parser.o: sax_parser.cc Makefile
	g++ ${CFLAGS} sax_parser.cc -c -o sax_parser.o

libxmljs.a: libxmljs.o parser.o sax_parser.o Makefile
	g++ -bundle -bundle_loader ${NODEJS} ${LIBS} libxmljs.o parser.o sax_parser.o -o libxmljs.a

clean:
	rm -f *.{o,a}
	rm -f natives.h

.PHONY: clean
