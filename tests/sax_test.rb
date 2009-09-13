require 'rubygems'
require 'nokogiri'

class SAXParser
  def initialize
    @parser = Nokogiri::XML::SAX::Parser.new self
  end

  def parse(str)
    @parser.parse str
  end

  def method_missing(method, *args, &block)
    puts({method => args}.inspect)
  end
end

p = SAXParser.new
p.parse(
  '<?xml-warning?>'+
  '<error>'+
  '<stream:stream xmlns="jabber:client" xmlns:stream="http://etherx.jabber.org/streams" to="example.com" version="1.0">'+
    '<!-- comment -->'+
    '<message type="chat" to="n@d" from="n@d/r" id="id1">'+
      '<![CDATA[ some cdata ]]>'+
      '<body>exit</body>'+
      '<html xmlns="http://jabber.org/protocol/xhtml-im">'+
        '<body xmlns="http://www.w3.org/1999/xhtml">exit</body>'+
      '</html>'+
      '<stream:prefixed />'+
    '</message>'+
  '</stream:stream>'
)