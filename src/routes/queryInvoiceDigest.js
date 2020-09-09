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

  // Normalizing the invoiceDigest property to an Array
  const formattedResponseData = {
    ...response[responseType][responseDataType],
    invoiceDigest: !response[responseType][responseDataType].invoiceDigest
      ? []
      : Array.isArray(response[responseType][responseDataType].invoiceDigest)
      ? response[responseType][responseDataType].invoiceDigest
      : [response[responseType][responseDataType].invoiceDigest],
  };

  return {
    result: response[responseType].result,
    data: {
      raw: response[responseType][responseDataType],
      formatted: formattedResponseData,
      length: formattedResponseData.invoiceDigest.length,
      core: formattedResponseData.invoiceDigest,
    },
    errors: null,
  };
};
