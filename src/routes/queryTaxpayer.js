const createBaseRequest = require("../utils/createBaseRequest");
const sendRequest = require("../utils/sendRequest");

const { parseResponseXML } = require("../utils/xmlParsing");

module.exports = async function queryTaxpayer({
  userData,
  softwareData,
  taxpayerParams,
  axios,
}) {
  const requestType = "QueryTaxpayerRequest";
  const responseType = "QueryTaxpayerResponse";
  const responseDataType = "taxpayerData";

  const request = createBaseRequest({
    requestType,
    userData,
    softwareData,
  });
  const { taxNumber } = taxpayerParams;

  Object.assign(request[requestType], {
    taxNumber
  });

  const response = await sendRequest({
    request,
    axios,
    route: "/queryTaxpayer",
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
      raw: response[responseType][responseDataType] || null,
      formatted: response[responseType][responseDataType] || null,
      length: 1,
      core: response[responseType].taxpayerValidity || false
    },
    errors: null,
  };
};
