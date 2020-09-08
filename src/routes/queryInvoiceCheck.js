const { pick } = require("lodash")

const createBaseRequest = require("../utils/createBaseRequest");
const sendRequest = require("../utils/sendRequest");

module.exports = async function queryInvoiceCheck({
  userData,
  softwareData,
  invoiceCheckParams,
  axios
}) {
  const requestType = "QueryInvoiceCheckRequest";
  const responseType = "QueryInvoiceCheckResponse";
  const responseDataType = "invoiceCheckResult";

  const request = createBaseRequest({
    requestType,
    userData,
    softwareData
  })

  const invoiceNumberQuery = pick(invoiceCheckParams, [
    "invoiceNumber",
    "invoiceDirection",
    "batchIndex",
    "supplierTaxNumber"
  ])

  Object.assign(request[requestType], {
    invoiceNumberQuery
  })

  const response = await sendRequest({
    request,
    axios,
    route: "/queryInvoiceCheck"
  })

  if (response.error) {
    return {
      result: response.error.result,
      data: null,
      errors: response.error["technicalValidationMessages"]
    }
  }

  return {
    result: response[responseType].result,
    data: {
      raw: response[responseType][responseDataType],
      formatted: response[responseType][responseDataType],
      length: 1,
      core: response[responseType][responseDataType] 
    },
    errors: null
  }
}