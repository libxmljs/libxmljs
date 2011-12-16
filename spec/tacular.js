/*
 * spec/tacular
 *
 * A minimal spec library for node.js for testing both syncronous and asyncronous code.
 *
 * To run:
 *
 * 1. Place this file in your project's spec directory.
 * 2. Run with "node spec/tacular.js" to test all files beginning with the word "spec".
 *
 * Options:
 *
 * "=verbose": Use verbose mode showing description, tests, and status for each spec.
 *
 * Synopsis:
 *
 * var foo = require("./../lib/foo"); // the file you are specing
 *
 * describe("A foo", function() {
 *   beforeEach(function() {
 *     // setup goes here
 *   });
 *
 *   afterEach(function() {
 *     // teardown goes here
 *   });
 *
 *   // Supply a function that takes no arguments for a syncronous test
 *   it("should do X", function() {
 *     // place code and assertions here
 *     // assert module is available
       assert.ok(true);
 *   });
 *
 *   // Supply a function that takes one argument, a promise, to
 *   // use an async test
 *   it("should fail async", function(promise){
 *     promise.addCallback(function(){
 *       assert.ok(false);
 *     })
 *     setTimeout(function(){ promise.emitSuccess() }, 500);
 *   });
 *
 * });
 *
 * Copyright 2009, Jon Crosby, MIT Licensed
 *
 */

(function() {
with(require('sys')) {
  if (typeof gc == 'undefined') var gc = function() {}
  if (process.argv) { process.ARGV = process.argv; }

  var assert = require('assert');
  var path = require('path');
  var fs = require('fs');
  var specCount    = 0;
  var specStack    = [];
  var specFailures = [];
    var specVerbose  = process.ARGV.join(";").match(/;(--verbose|-v)/);
  
  var describe = function(name, func) {
    specStack.push(name);
    if (specVerbose) print(name);
    specBeforeEach = specAfterEach = function() {};
    func();
    if (specVerbose) print("\n\n");
    specStack.pop();
    gc();
  };

  var it = function(name, func) {
    specCount++;
    specStack.push(name);
    if (specVerbose) print("\n  "+name+" : ");
    specBeforeEach();
    try {
      if ( func.length == 0 ){
        func();
      } else {
        var promise = new process.Promise();
        func(promise);
        promise.addErrback(function(e){ throw e });
        promise.wait();
      }
    }
    catch(e) { if (e != 'fail') specError(e); }
    specStack.pop();
    specAfterEach();
    gc();
  };

  var specError = function(message) {
    print(specVerbose ? "Error ("+message+") " : "E");
    specFailures.push(specStack.join(" ") + "\n" + message);
  };

  var specFail = function(message) {
    print(specVerbose ? "Fail " : "F");
    specFailures.push(specStack.join(" ") + "\n" + message);
  };

  var specPass = function() {
    print(specVerbose ? "Pass " : ".");
  };

  var inspectObject = function(obj) {
    if(obj === null) return "null";
    var elements = [], orderedProperties = [], i;
    for(property in obj) {
      orderedProperties.push(property);
    }
    orderedProperties = orderedProperties.sort();
    for(i = 0; i < orderedProperties.length; i++) {
      elements.push([orderedProperties[i], inspect(obj[orderedProperties[i]])].join(":"));
    }
    return "{" + elements.join(",") + "}";
  };

  var inspectArray = function(arr) {
    var elements = [];
    if(arr.length == 0) return "[]";
    for(var i = 0; i < arr.length; i++) {
      elements.push(inspect(arr[i]));
    }
    return "[" + elements.join(",") + "]";
  };

  var inspectDate = function(date) {
    return date.toString();
  };

  var inspectString = function(str) {
    return '"' + str + '"';
  };

  var inspectBoolean = function(bool) {
    return bool;
  };

  var inspectNumber = function(num) {
    return num;
  };

  var inspect = function(element) {
    switch(typeof(element)) {
    case "object":
      if(element instanceof Array) {
        return inspectArray(element);
      } else if (element instanceof Date) {
        return inspectDate(element);
      } else {
        return inspectObject(element);
      }
      break;
    case "string":
      return inspectString(element);
      break;
    case "number":
      return inspectNumber(element);
      break;
    case "boolean":
      return inspectBoolean(element);
      break;
    default:
      if(element === undefined) {
        return "undefined";
      } else {
        return element.toString();
      }
    }
  };

  var beforeEach = function(func) {
    specBeforeEach = func;
  };

  var afterEach = function(func) {
    specAfterEach = func;
  };

  var summarize = function() {
    var plural = function(word, isPlural) {
      return word + (isPlural ? "s" : "");
    };

    var specSummary = function() {
      return [specCount, plural("example", specCount != 1)].join(" ");
    };

    var failSummary = function() {
      return [specFailures.length, plural("failure", specFailures.length != 1)].join(" ");
    };

    var summary = function() {
      return [specSummary(), failSummary()].join(", ");
    };

    if(specFailures.length) {
      var i;
      for(i = 1; i <= specFailures.length; i++) {
        puts("" + i + ")");
        puts(specFailures[i-1]);
        puts("");
      }
    }
    puts(summary());
  };

  var specDirectory = path.dirname(__filename);
  var files = fs.readdirSync(specDirectory);
  var i;
  for(i = 0; i < files.length; i++) {
    var file = files[i];
    if(file.match(/^spec/)) {
      if (specVerbose) print(file+"\n");
      var content = fs.readFileSync(specDirectory + "/" + file, "utf8");
      eval(content);
    }
  }
  puts("\n");
  process.addListener("exit", function () {
    summarize();
  });
}
})();
