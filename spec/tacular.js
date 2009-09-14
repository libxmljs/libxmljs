/*
 * spec/tacular
 *
 * A minimal spec library for node.js
 *
 * To run:
 *
 * 1. Place this file in your project's spec directory.
 * 2. Run with "node spec/tacular.js" to test all files beginning with the word "spec".
 *
 * Synopsis:
 *
 * var foo = require("../lib/foo.js"); // the file you are specing
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
 *   it("should do X", function() {
 *     // place code and assertions here
 *     // available: assert(x), assertEqual(x, y), assertNotEqual(x, y)
 *   });
 *
 * });
 *
 * Copyright 2009, Jon Crosby, MIT Licensed
 *
 */
(function() {
  var specCount    = 0;
  var specStack    = [];
  var specFailures = [];

  var describe = function(name, func) {
    specStack.push(name);
    specBeforeEach = specAfterEach = function() {};
    func();
    specStack.pop();
  };

  var it = function(name, func) {
    specCount++;
    specStack.push(name);
    specBeforeEach();
    func();
    specStack.pop();
    specAfterEach();
  };

  var specFail = function(message) {
    print("F");
    specFailures.push(specStack.join(" ") + "\n" + message);
  };

  var specPass = function() {
    print(".");
  };

  var inspectObject = function(obj) {
    if(obj === null) return "null";
    var elements = [];
    for(property in obj) {
      elements.push([property, inspect(obj[property])].join(":"));
    }
    return "{" + elements.join(",") + "}";
  };

  var inspectArray = function(arr) {
    var elements = [];
    for(i = 0; i < arr.length; i++) {
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
      return "undefined";
    }
  };

  var assert = function(value) {
    value ? specPass() : specFail("Expected " + value + " to be true");
  };

  var assertEqual = function(a, b) {
    a == b ? specPass() : specFail("Expected:\n" + inspect(a) + "\n\n" + "Found:\n" + inspect(b));
  };

  var assertNotEqual = function(a, b) {
    a != b ? specPass() : specFail("Expected:\n" + inspect(a) + "\n\nto not equal:\n" + inspect(b));
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

  var specDirectory = node.path.dirname(__filename);
  var files = node.fs.readdir(specDirectory).wait();
  var i;
  for(i = 0; i < files.length; i++) {
    var file = files[i];
    if(file.match(/^spec/)) {
      var content = node.fs.cat(specDirectory + "/" + file, "utf8").wait();
      eval(content);
    }
  }
  puts("\n");
  summarize();
})();
