// Copyright 2009, Squish Tech, LLC.
#ifndef SRC_LIBXMLJS_H_
#define SRC_LIBXMLJS_H_

#include <v8.h>
#include <node.h>
#include "nan.h"

#define LIBXMLJS_ARGUMENT_TYPE_CHECK(arg, type, err)                          \
  if (!arg->type()) {                                                         \
    return NanThrowTypeError(err);                                            \
  }

namespace libxmljs {

#ifdef LIBXML_DEBUG_ENABLED
static const bool debugging = true;
#else
static const bool debugging = false;
#endif

// Ensure that libxml is properly initialised and destructed at shutdown
class LibXMLJS {
public:
    LibXMLJS();
    virtual ~LibXMLJS();

private:
    static LibXMLJS instance;
};

// An object of the following class must be created on the main V8 thread
// and be kept alive during the execution of a worker thread,
// to be eventually destroyed on the main V8 thread again.
// Only a single worker is allowed per parent.
class WorkerParent {
public:
    WorkerParent();
    virtual ~WorkerParent();
private:
    friend void adjustMem(ssize_t);
    ssize_t memAdjustments;
};

// An object of the following class must be created in the worker thread,
// and kept alive as long as the worker interfaces with libxmljs.
// It must eventually be destroyed while still in the worker thread.
class WorkerSentinel {
public:
    WorkerSentinel(WorkerParent& parent);
    virtual ~WorkerSentinel();
private:
    friend void adjustMem(ssize_t);
    WorkerParent& parent;
};

}  // namespace libxmljs

#endif  // SRC_LIBXMLJS_H_
