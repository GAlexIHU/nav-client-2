const createBaseRequest = require("../utils/createBaseRequest");
const sendRequest = require("../utils/sendRequest");

const { parseResponseXML } = require("../utils/xmlParsing");

module.exports = async function queryTransactionStatus({
  userData,
  softwareData,
  transactionStatusParams,
  axios,
}) {
  const requestType = "QueryTransactionStatusRequest";
  const responseType = "QueryTransactionStatusResponse";
  const responseDataType = "processingResults";

  const request = createBaseRequest({
    requestType,
    userData,
    softwareData,
  });
  const { transactionId, returnOriginalRequest } = transactionStatusParams;

  Object.assign(request[requestType], {
    transactionId,
    returnOriginalRequest,
  });

  const response = await sendRequest({
    request,
    axios,
    route: "/queryTransactionStatus",
  });

  if (response.error)
    return {
      result: response.error.result,
      data: null,
      errors: response.error["technicalValidationMessages"],
    };
  // Case when the transaction doesn't actually exist (no data is sent back about it)
  if (!response[responseType][responseDataType])
    return {
      result: response[responseType].result,
      data: null,
      errors: null,
    };
  // Case when there's actually a meaningful response
  const formattedResponseData = formatRawData(response[responseType][responseDataType]);

  return {
    result: response[responseType].result,
    data: {
      raw: response[responseType][responseDataType],
      formatted: formattedResponseData,
      length: formattedResponseData,
      core: formattedResponseData.processingResult,
    },
    errors: null,
  };
};

/**
 * Handles the formatting of the results object (base64=>xml=>jsObj)
 * 
 * DOESN'T CURRENTLY HANDLE COMPRESSED DATA! (this inserts much type uncertainty!)
 */
const formatRawData = (processingResults) => ({
  ...processingResults,
  processingResult: Array.isArray(processingResults.processingResult)
    ? processingResults.processingResult.map((item) => ({
        ...item,
        originalRequest: item.compressedContentIndicator
          ? item.originalRequest
          : item.originalRequest
          ? parseResponseXML(Buffer.from(item.originalRequest, "base64").toString("utf-8"))
          : null,
      }))
    : [{
        ...processingResults.processingResult,
        originalRequest: processingResults.processingResult.compressedContentIndicator
          ? processingResults.processingResult.originalRequest
          : processingResults.processingResult.originalRequest
          ? parseResponseXML(
              Buffer.from(processingResults.processingResult.originalRequest, "base64").toString(
                "utf-8"
              )
            )
          : null,
      }],
});