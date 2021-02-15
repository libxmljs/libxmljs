#!/bin/bash

ROOT="$(dirname "${BASH_SOURCE[0]}")/.."

COMMAND="swig";

if [[ "$OSTYPE" == "linux-gnu" ]]; then
  SOURCE="$ROOT/src/libxml2.i"
  TARGET="$ROOT/src/libxml2.cc"
elif [[ "$OSTYPE" == "darwin"* ]]; then
  SOURCE="$ROOT/src/libxml2.i"
  TARGET="$ROOT/src/libxml2.cc"
else
  SOURCE="$ROOT/src/libxml2.i"
  TARGET="$ROOT/src/libxml2.cc"
  COMMAND="C:\swig.exe"
fi


#
# Extra debugging options
#
# INCLUDE="-importall"
# INCLUDE="-includeall"
# -I/usr/include \
# -I/usr/local/include \
# -I/opt/local/include \
# -I/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/include \
# -I"/Library/Developer/CommandLineTools/usr/lib/clang/5.1/include" \
# -I"/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.11.sdk/usr/include" \
# -I"/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/include/c++/v1" \
# -I"/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/lib/swift-migrator/sdk/MacOSX.sdk/usr/include" \
# -debug-typemap

rm -f $TARGET
rm -rf swig.xml

#  -I`node -e "require('nan')"` \
$COMMAND -I"$ROOT/vendor/libxml2/" \
     -I"$ROOT/vendor/libxml2/include/" \
     -I"$ROOT/vendor/libxml2/include/libxml/" \
     -I"$ROOT/vendor/libxml2.config/" \
     -w-205,-503,-201 \
     -cpperraswarn -xmlout swig.xml -includeall -ignoremissing -javascript -node -module libxml2 -c++ -v -o $TARGET $SOURCE
