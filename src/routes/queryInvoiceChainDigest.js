const { pick } = require("lodash");

const createBaseRequest = require("../utils/createBaseRequest");
const sendRequest = require("../utils/sendRequest");

module.exports = async function queryInvoiceChainDigest({
  userData,
  softwareData,
  invoiceChainDigestParams,
  axios,
}) {
  // Descriptors of the XML schema used while communicating with the endpoint
  const requestType = "QueryInvoiceChainDigestRequest";
  const responseType = "QueryInvoiceChainDigestResponse";
  const responseDataType = "invoiceChainDigestResult";

  const { page } = invoiceChainDigestParams;

  const request = createBaseRequest({
    requestType,
    userData,
    softwareData,
  });

  // Normalizing the properties according to the schema in the documentation
  const invoiceChainQuery = pick(invoiceChainDigestParams, [
    "invoiceNumber",
    "invoiceDirection",
    "taxNumber",
  ]);

  Object.assign(request[requestType], {
    page,
    invoiceChainQuery,
  });

  const response = await sendRequest({
    request,
    axios,
    route: "/queryInvoiceChainDigest",
  });

  if (response.error) {
    return {
      result: response.error.result,
      data: null,
      errors: response.error["technicalValidationMessages"],
    };
  }

  return {
    result: response[responseType].result,
    data: {
      raw: response[responseType][responseDataType],
      formatted: response[responseType][responseDataType],
      length: !response[responseType][responseDataType].invoiceChainElement
        ? 0
        : Array.isArray(response[responseType][responseDataType].invoiceChainElement)
        ? response[responseType][responseDataType].invoiceChainElement.length
        : 1,
      core: response[responseType][responseDataType].invoiceChainElement || null,
    },
    errors: null,
  };
};
