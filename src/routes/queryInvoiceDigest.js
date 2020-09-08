const { pick } = require("lodash");

const createBaseRequest = require("../utils/createBaseRequest");
const sendRequest = require("../utils/sendRequest");

module.exports = async function queryInvoiceDigest({
  userData,
  softwareData,
  invoiceDigestParams,
  axios,
}) {
  const requestType = "QueryInvoiceDigestRequest";
  const responseType = "QueryInvoiceDigestResponse";
  const responseDataType = "invoiceDigestResult";

  const request = createBaseRequest({
    requestType,
    userData,
    softwareData,
  });

  const { page, invoiceDirection } = invoiceDigestParams;
  const namedInvoiceDigestParams = {
    mandatoryQueryParams: invoiceDigestParams.mandatory,
    additionalQueryParams: invoiceDigestParams.additional,
    realtionalQueryParams: invoiceDigestParams.relational,
    transactionQueryParams: invoiceDigestParams.transaction,
  };
  const invoiceQueryParams = pick(namedInvoiceDigestParams, [
    "mandatoryQueryParams",
    "additionalQueryParams",
    "realtionalQueryParams",
    "transactionQueryParams",
  ]);

  Object.assign(request[requestType], {
    page,
    invoiceDirection,
    invoiceQueryParams,
  });

  const response = await sendRequest({
    request,
    axios,
    route: "/queryInvoiceDigest",
  });

  if (response.error)
    return {
      result: response.error.result,
      data: null,
      errors: response.error["technicalValidationMessages"],
    };
  // Case where the invoice doesn't actually exist (no data is sent back about it)
  if (!response[responseType][responseDataType])
    return {
      result: response[responseType].result,
      data: null,
      errors: null,
    };

  return {
    result: response[responseType].result,
    data: {
      raw: response[responseType][responseDataType],
      formatted: response[responseType][responseDataType],
      length: !response[responseType][responseDataType].invoiceDigest
        ? 0
        : Array.isArray(response[responseType][responseDataType].invoiceDigest)
        ? response[responseType][responseDataType].invoiceDigest.length
        : 1,
      core: response[responseType][responseDataType].invoiceDigest,
    },
    errors: null,
  };
};
