const crypto = require("crypto");
const { pick } = require("lodash");

const createBaseRequest = require("../utils/createBaseRequest");
const sendRequest = require("../utils/sendRequest");

/**
 * This operation gets and decyphers the exchangetoken used in manageInvoice and manageAnnulment operations.
 * If the call to the server fails, the optional maxNumberOfRetries parameter can allow for recursive attempts (disabled by default)
 * 
 * The reason recursion is allowed is because this tokenExchange operation is crucial in both manageInvoice and manageAnnulment, and should not fail if possible.  
 */
module.exports = async function tokenExchange({
  userData,
  softwareData,
  axios,
  maxNumberOfRetries = 1
}) {
  const requestType = "TokenExchangeRequest";
  const responseType = "TokenExchangeResponse";

  const request = createBaseRequest({
    requestType,
    userData,
    softwareData,
  });

  const response = await sendRequest({
    request,
    axios,
    route: "/queryInvoiceCheck",
  });

  // The recursive attempts
  if (response.error) {
    if (maxNumberOfRetries === 1 || maxNumberOfRetries > 20) {
      return {
        result: response.error.result,
        data: null,
        errors: response.error["technicalValidationMessages"],
      }
    } else {
      return await tokenExchange({
        userData,
        softwareData,
        axios,
        maxNumberOfRetries: maxNumberOfRetries - 1
      })
    }
  }
  // Formatting the data
  const responseDataRaw = pick(response[responseType], [
    "encodedExchangeToken",
    "tokenValidityFrom",
    "tokenValidityTo",
  ]);
  // Decyphering the token
  const decypher = crypto.createDecipheriv("aes-128-gcm", userData.signatureKey, "");
  let decodedExchangeToken = decypher.update(responseDataRaw.encodedExchangeToken, "base64", "utf8");
  decodedExchangeToken += decypher.final("utf8");

  const responseData = {
    ...responseDataRaw,
    encodedExchangeToken: decodedExchangeToken
  }

  return {
    result: response[responseType].result,
    data: {
      raw: responseDataRaw,
      formatted: responseData,
      length: 1,
      core: decodedExchangeToken,
    },
    errors: null,
  };
};
