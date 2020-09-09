const createBaseRequest = require("../utils/createBaseRequest");
const sendRequest = require("../utils/sendRequest");

module.exports = async function queryTransactionList({
  userData,
  softwareData,
  transactionListParams,
  axios,
}) {
  const requestType = "QueryTransactionListRequest";
  const responseType = "QueryTransactionListResponse";
  const responseDataType = "transactionListResult";

  const request = createBaseRequest({
    requestType,
    userData,
    softwareData,
  });
  const { page, insDate } = transactionListParams;

  Object.assign(request[requestType], {
    page,
    insDate
  });

  const response = await sendRequest({
    request,
    axios,
    route: "/queryTransactionList",
  });

  if (response.error)
    return {
      result: response.error.result,
      data: null,
      errors: response.error["technicalValidationMessages"],
    };
  
  // Normalizing the transaction property to an Array
  const formattedResponseData = {
    ...response[responseType][responseDataType],
    transaction: !response[responseType][responseDataType].transaction
      ? []
      : Array.isArray(response[responseType][responseDataType].transaction)
      ? response[responseType][responseDataType].transaction
      : [ response[responseType][responseDataType].transaction ]
  }

  return {
    result: response[responseType].result,
    data: {
      raw: response[responseType][responseDataType],
      formatted: formattedResponseData,
      length: formattedResponseData.transaction.length,
      core: formattedResponseData.transaction
    },
    errors: null,
  };
};
