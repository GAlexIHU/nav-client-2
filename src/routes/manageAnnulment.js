const createBaseRequest = require("../utils/createBaseRequest");
const sendRequest = require("../utils/sendRequest");
const { createFullRequestSignature } = require("../utils/createRequestSignature");

module.exports = async function manageAnnulment({
  userData,
  softwareData,
  annulmentOperationList,
  exchangeKey,
  axios,
}) {
  const requestType = "ManageAnnulmentRequest";
  const responseType = "ManageAnnulmentResponse";

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
    annulmentOperationList
  )

  Object.assign(request[requestType].user, {
    requestSignature
  })

  Object.assign(request[requestType], {
    exchangeKey,
    annulmentOperations: {
      annulmentOperation: annulmentOperationList
    }
  });

  const response = await sendRequest({
    request,
    axios,
    route: "/manageAnnulment",
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
