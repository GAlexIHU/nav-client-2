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
  return {
    result: response[responseType].result,
    data: {
      raw: response[responseType][responseDataType],
      formatted: formatRawData(response[responseType][responseDataType]),
      length: getResultsLength(response[responseType][responseDataType]),
      core: formatRawData(response[responseType][responseDataType]).processingResult,
    },
    errors: null,
  };
};

// As the formatting is quite complex and ugly here, i decided to extract it to this function
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
    : {
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
      },
});

const getResultsLength = (processingResults) =>
  Array.isArray(processingResults.processingResult) ? processingResults.processingResult.length : 1;
