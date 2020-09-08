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
  
  return {
    result: response[responseType].result,
    data: {
      raw: response[responseType][responseDataType],
      formatted: response[responseType][responseDataType],
      length: !response[responseType][responseDataType].transaction
        ? 0
        : Array.isArray(response[responseType][responseDataType].transaction)
        ? response[responseType][responseDataType].transaction.length
        : 1,
      core: response[responseType][responseDataType].transaction || null
    },
    errors: null,
  };
};
