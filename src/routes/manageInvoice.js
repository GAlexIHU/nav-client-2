const createBaseRequest = require("../utils/createBaseRequest");
const sendRequest = require("../utils/sendRequest");
const { createFullRequestSignature } = require("../utils/createRequestSignature");

module.exports = async function manageInvoice({
  userData,
  softwareData,
  invoiceOperationList,
  exchangeKey,
  axios,
}) {
  const requestType = "ManageInvoiceRequest";
  const responseType = "ManageInvoiceResponse";

  const request = createBaseRequest({
    requestType,
    userData,
    softwareData,
  });

  // Creating and updating the required signature
  const requestSignature = createFullRequestSignature(
    request[requestType].header.requestId,
    request[requestType].header.timestamp,
    userData.signatureKey,
    invoiceOperationList
  )

  Object.assign(request[requestType].user, {
    requestSignature
  })
  // This client doesnt handle compressed content! (YET)
  Object.assign(request[requestType], {
    exchangeKey,
    invoiceOperations: {
      compressedContent: false,
      invoiceOperation: invoiceOperationList
    }
  });

  const response = await sendRequest({
    request,
    axios,
    route: "/manageInvoice",
  });

  if (response.error)
    return {
      result: response.error.result,
      data: null,
      errors: response.error["technicalValidationMessages"],
    };
  return {
    result: response[responseType].result,
    data: {
      raw: response[responseType].transactionId,
      formatted: response[responseType].transactionId,
      length: 1,
      core: response[responseType].transactionId,
    },
    errors: null,
  };
};
