libxml.SaxCallbacks = function() {
  var callbackList = {};

  function addCallback(name, callback) {
    if (!callbackList[name])
      callbackList[name] = [callback];
    else
      callbackList[name].push(callback);
  };

  this.callback = function() {
    if (!(callback = callbackList[name]))
      return;

    var name = arguments[0];
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
