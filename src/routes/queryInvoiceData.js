const { pick } = require("lodash")

const createBaseRequest = require("../utils/createBaseRequest");
const sendRequest = require("../utils/sendRequest");
const { parseResponseXML } = require("../utils/xmlParsing")

module.exports = async function queryInvoiceData({
  userData,
  softwareData,
  invoiceDataParams,
  axios
}) {
  const requestType = "QueryInvoiceDataRequest";
  const responseType = "QueryInvoiceDataResponse";
  const responseDataType = "invoiceDataResult";

  const request = createBaseRequest({
    requestType,
    userData,
    softwareData
  })

  const invoiceNumberQuery = pick(invoiceDataParams, [
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
    route: "/queryInvoiceData"
  })

  if (response.error) return ({
      result: response.error.result,
      data: null,
      errors: response.error["technicalValidationMessages"]
    })
  // Case where the invoice doesn't actually exist (no data is sent back about it)
  if (!response[responseType][responseDataType]) return ({
    result: response[responseType].result,
    data: null,
    errors: null
  })
  // Forwarding the raw base64 data when the data is compressed.
  if (response[responseType][responseDataType].compressedContentIndicator) return ({
    result: response[responseType].result,
    data: {
      raw: response[responseType][responseDataType],
      formatted: null,
      length: 1,
      core: null
    },
    errors: null
  })

  // Converting the base64 string when no compression was applied
  const invoiceDataBase64 = response[responseType][responseDataType].invoiceData;
  const invoiceData = parseResponseXML(Buffer.from(invoiceDataBase64, "base64").toString("utf-8"));

  const formattedData = response[responseType][responseDataType]
  Object.assign(formattedData, {
    invoiceData
  });
  
  return ({
    result: response[responseType].result,
    data: {
      raw: response[responseType][responseDataType],
      formatted: formattedData,
      length: 1,
      core: formattedFata.invoiceData.InvoiceData
    },
    errors: null
  })
}