var sys = require('sys'),
    libxml = require('../libxmljs'),
    http = require("http");

function escapeHTML(html) {
  return html;
};

function idsSoapRequestBody(layoutScript, parameters) {
  var doc = new libxml.Document(function(n) {
    n.node("Envelope", function(n) {
      n.namespace('env', "http://schemas.xmlsoap.org/soap/envelope/");
      n.node("Header");
      n.node("Body", function(n) {
        n.node("RunScript", function(n) {
          n.namespace('IDSP', "http://ns.adobe.com/InDesign/soap/");
          n.node("runScriptParameters", function(n) {
            n.node("scriptText", escapeHTML(layoutScript));
            n.node("scriptLanguage", "javascript");
            n.node("attrs", parameters);
            if (parameters) {
              for (var p in parameters) {
                n.node("scriptArgs", function(n) {
                  n.node("name", p);
                  n.node("value", parameters[p].toString());
                });
              }
            }
          });
        });
      });
    });
  });

  // var doc2 = new libxml.Document();
  // doc.node('Envelope');
  return doc.toString(); // + doc2.toString();
}

var times = 2000;
for (var i = 0; i <= times; ++i ) {
// while (true) {
  var str = idsSoapRequestBody('some text', {foo: 'bar', bar: 'foo'});
}
