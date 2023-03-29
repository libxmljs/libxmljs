%import "stl.i"
%import "std_string.i"
%import "std_pair.i"
%import "std_map.i"
%import "std_vector.i"
%import "exception.i"
%import "std_except.i"
%include "helpers.i"
%include "memory.i"
%include "guards.i"
%include "refcounting.i"
%include "casting.i"
%include "threads.i"
%include "errors.i"
%include "sax.i"

// %exception {
// 	try {
// 		$function
// 	} catch(std::runtime_error e) {
// 		SWIG_exception(SWIG_RuntimeError, e.what());
// 	}
// }

// %typemap(in, numinputs=1) (const char *buffer, int size) (int result, char* buffer, size_t size) {
//   result = SWIG_AsCharPtrAndSize(args[0], &buffer, &size, 0);

//   if (!SWIG_IsOK(result)) {
//     SWIG_exception_fail(SWIG_ArgError(result), "Couldn't convert to string");
//   }

//   int length = (size - 1); // exclude null-termination character

//   if (length < 0) {
//     SWIG_exception_fail(0, "Input length < 1");
//   }

//   if (length > std::numeric_limits<int>::max()) {
//     SWIG_exception_fail(0, "Input too large");
//   }

//   $1 = reinterpret_cast< char * >(buffer);
//   $2 = ((int) length & std::numeric_limits<int>::max());
// }

%typemap(in, noblock=1) char* (int res, char *buf = 0, size_t size = 0, int alloc = 0), const char* (int res, char *buf = 0, size_t size = 0, int alloc = 0) {
  if ($input->IsNull()) {
    $1 = NULL;
  } else if (node::Buffer::HasInstance($input)) {
    $1 = node::Buffer::Data(Nan::To<v8::Object>($input).ToLocalChecked());
    // printf("data: %s - %i\n", $1, strlen($1));
  } else {
    res = SWIG_AsCharPtrAndSize($input, &buf, &size, &alloc);

    if (!SWIG_IsOK(res)) {
      %argument_fail(res,"$type",$symname, $argnum);
    }

    $1 = %reinterpret_cast(buf, $1_ltype);
  }
}

%typemap(freearg, noblock=1) char*, const char* {
  // free($1);
}

%typemap(in, noblock=1) xmlChar* (int res, char *buf = 0, size_t size = 0, int alloc = 0) {
  if ($input->IsNull()) {
    $1 = NULL;
  } else {
    res = SWIG_AsCharPtrAndSize($input, &buf, &size, &alloc);

    if (!SWIG_IsOK(res)) {
      %argument_fail(res,"$type",$symname, $argnum);
    }

    $1 = %reinterpret_cast(buf, $1_ltype);
  }
}

// %typemap(freearg, noblock=1, match="in") (xmlChar*) {
//   if (alloc$argnum == SWIG_NEWOBJ) SWIG_DeleteCharArray(buf$argnum);
// }

%typemap(out) xmlNodeSet* {
  $result = SWIGV8_ARRAY_NEW(0);

  for (int index = 0; $1 != NULL && index < $1->nodeNr; index++) {
    // SWIGV8_AppendOutput($result, SWIG_NewPointerObj(SWIG_as_voidptr($1->nodeTab[index]), SWIGTYPE_p__xmlNode, 0 |  0 ));
    xmlNode* node = ((xmlNode*) $1->nodeTab[index]);
    SWIGV8_AppendOutput($result, createWrap(node, xmlNodeGetSwigPtrInfo(node)));
  }
}

%typemap(out) xmlNsPtr* {
  $result = SWIGV8_ARRAY_NEW(0);

  for (int index = 0; $1 != NULL && $1[index] != NULL; index++) {
    // SWIGV8_AppendOutput($result, SWIG_NewPointerObj(SWIG_as_voidptr($1[index]), SWIGTYPE_p__xmlNs, 0 |  0 ));
    SWIGV8_AppendOutput($result, createWrap(((xmlNode*) $1[index]), SWIGTYPE_p__xmlNs));
  }
  
  xmlFree($1);
}

%typemap(out) char** (char* temp) {
  temp = (char*) $1;
  $result = SWIGV8_STRING_NEW2(temp, strlen(temp));
}

%typemap(in, noblock=1) void* {
    $1 = getSwigCObjectPtr($input);
}

%typemap(out) xmlChar* {
  $result = SWIGV8_STRING_NEW2((char*)$1, xmlStrlen($1));

  // int source_chars = xmlUTF8Strlen($1);
  // int target_chars = $result->ToString()->Length();

  // int source_bytes = xmlStrlen($1);
  // int target_bytes = SWIGV8_UTF8_LENGTH($result->ToString());

  // if (source_chars != target_chars || source_bytes != target_bytes) {
  //   SWIG_exception_fail(0, "Error writing to String");
  // }
}

%ignore _xmlGlobalState;
%rename("%(regex:/^xmlTextWriterWriteV([A-Z][a-z]+)(.*)/$ignore/)s") "";
%rename("%(regex:/^xmlStrV([A-Z][a-z]+)(.*)/$ignore/)s") "";

%include "config.h"
%include "libxml/xmlversion.h"

%include "parser.h"
%include "xmlerror.h"

%include "tree.h"
%include "xpath.h"
%include "xpathInternals.h"

// %include "buf.h"
%include "catalog.h"
%include "chvalid.h"
%include "dict.h"
%include "encoding.h"
%include "entities.h"
%include "globals.h"
%include "hash.h"
%include "HTMLparser.h"
%include "HTMLtree.h"
%include "list.h"
%include "parserInternals.h"
%include "pattern.h"
%include "relaxng.h"
%include "SAX2.h"
%include "SAX.h"
%include "threads.h"
%include "uri.h"
%include "valid.h"
%include "xinclude.h"
%include "xlink.h"
%include "xmlIO.h"
%include "xmlmemory.h"
%include "xmlmodule.h"
%include "xmlreader.h"
%include "xmlregexp.h"
%include "xmlsave.h"
%include "xmlschemas.h"
%include "xmlschemastypes.h"
%include "xmlstring.h"
%include "xmlunicode.h"
%include "xmlwriter.h"
%include "xpointer.h"

%begin %{
  #include "nan.h"

  #include "config.h"
  #include "libxml/xmlversion.h"
  #include "buf.h"
  #include "catalog.h"
  #include "chvalid.h"
  #include "dict.h"
  #include "encoding.h"
  #include "entities.h"
  #include "globals.h"
  #include "hash.h"
  #include "HTMLparser.h"
  #include "HTMLtree.h"
  #include "list.h"
  #include "parser.h"
  #include "parserInternals.h"
  #include "pattern.h"
  #include "relaxng.h"
  #include "SAX2.h"
  #include "SAX.h"
  #include "tree.h"
  #include "threads.h"
  #include "uri.h"
  #include "valid.h"
  #include "xinclude.h"
  #include "xlink.h"
  #include "xmlIO.h"
  #include "xmlmemory.h"
  #include "xmlmodule.h"
  #include "xmlreader.h"
  #include "xmlregexp.h"
  #include "xmlsave.h"
  #include "xmlschemas.h"
  #include "xmlschemastypes.h"
  #include "xmlstring.h"
  #include "xmlunicode.h"
  #include "xmlwriter.h"
  #include "xpath.h"
  #include "xpathInternals.h"
  #include "xpointer.h"
  
  #include "xml_sax_parser.h"
%}

%init %{
  libxmljs::XmlSaxParser::Initialize(exports_obj);
%}