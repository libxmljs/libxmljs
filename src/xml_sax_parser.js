libxml.SaxCallbacks = function() {
  var callbackList = {};

  function addCallback(name, callback) {
    if (!callbackList[name])
      callbackList[name] = [callback];
    else
      callbackList[name].push(callback);
  };

  this.callback = function() {
    var name = arguments[0];
    if (!(callback = callbackList[name]))
      return;

    var args = [];
    for (i = 1; i < arguments.length; i++)
      args.push(arguments[i]);

    for (i = 0; i < callback.length; i++)
      callback[i].apply(callback, args);
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
    var callbacks = new libxml.SaxCallbacks();
    callback(callbacks);
    return callbacks;
  };

  libxml.SaxParser.prototype.setCallbacks = setCallbacks;
  libxml.SaxPushParser.prototype.setCallbacks = setCallbacks;
})();
