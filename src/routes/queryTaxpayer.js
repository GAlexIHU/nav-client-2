const createBaseRequest = require("../utils/createBaseRequest");
const sendRequest = require("../utils/sendRequest");

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

  /**
   * A little explanation here.
   * In other methods i usually checked for whether actual data was sent back.
   * In this case i decided however that it would be easier to simply fall back to null values (in case of undefined).
   * The reason for this is that i wanted to guarantee data.core / taxpayerValidity to have a value.
   */
  return {
    result: response[responseType].result,
    data: {
      raw: response[responseType][responseDataType] || null,
      formatted: response[responseType][responseDataType] || null,
      length: 1,
      core: {
        taxpayerValidity: response[responseType].taxpayerValidity || false,
        infoDate: response[responseType].infoDate || null
      } 
    },
    errors: null,
  };
};
