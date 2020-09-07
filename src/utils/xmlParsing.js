const parser = require("fast-xml-parser");
const JsToxml = parser.j2xParser;
const jsToxml = new JsToxml({ 
  ignoreAttributes: false, 
  format: true, 
  attributeNamePrefix: "", 
  attrNodeName: "$"
});
/**
 * Simply converts the request object to XML 
 */
exports.createRequestXML = function (requestObject) {
  return jsToxml.parse(requestObject);
};
/**
 * Simply parses the response XMl into the response object 
 */
exports.parseResponseXML = function (responseData) {
  return parser.parse(responseData);
};
