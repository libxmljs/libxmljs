var bindings = require('../build/Release/libxmljs');

bindings.SaxCallbacks = function() {
  var callbackList = {};

  function addCallback(name, callback) {
    if (!callbackList[name])
      callbackList[name] = [callback];
    else
      callbackList[name].push(callback);
  }

  this.callback = function() {
    var args = Array.prototype.slice.call(arguments);
    var name = args.shift();
    if (!(callback = callbackList[name]))
      return;

    callback.forEach(function(cb) {
      cb.apply(callback, args);
    });
  };

  this.onStartDocument = function(callback) {
    addCallback('startDocument', callback);
  };

  this.onEndDocument = function(callback) {
    addCallback('endDocument', callback);
  };

  this.onStartElementNS = function(callback) {
    addCallback('startElementNS', callback);
  };

  this.onEndElementNS = function(callback) {
    addCallback('endElementNS', callback);
  };

  this.onCharacters = function(callback) {
    addCallback('characters', callback);
  };

  this.onCdata = function(callback) {
    addCallback('cdata', callback);
  };

  this.onComment = function(callback) {
    addCallback('comment', callback);
  };

  this.onWarning = function(callback) {
    addCallback('warning', callback);
  };

  this.onError = function(callback) {
    addCallback('error', callback);
  };

  return this;
};

(function() {
  var setCallbacks = function(callback) {
    var callbacks = new bindings.SaxCallbacks();
    callback(callbacks);
    return callbacks;
  };

  bindings.SaxParser.prototype.setCallbacks = setCallbacks;
  bindings.SaxPushParser.prototype.setCallbacks = setCallbacks;
})();

module.exports.SaxParser = bindings.SaxParser;
module.exports.SaxPushParser = bindings.SaxPushParser;

