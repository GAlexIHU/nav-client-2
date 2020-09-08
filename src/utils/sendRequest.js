const { createRequestXML, parseResponseXML } = require("./xmlParsing");

/**
 * Handles the actual sending of the request, the conversions between XMl and JsObjects, and the error-handling.
 * ```
 * IT CURRENTLY DOESNT SUPPORT GZIPPING, NOR HAS COMPLETE ERROR HANDLING IN PLACE!
 * ```
 */
module.exports = async function sendRequest({ request, axios, route }) {
  const requestXml = createRequestXML(request);
  try {
    const response = await axios.post(route, requestXml);
    const data = parseResponseXML(response.data);
    return data;
  } catch (error) {
    // In the magical case that it's not an axios error
    if (!error.isAxiosError) return returnUnknownError("XML parsing error")
    // When there was a timeout error
    if (error.code === "ECONNABORTED") return returnUnknownError("Connection aborted, timeout possibly exceeded")
    // When there was no response or there is no connection
    if (!error.response) return returnUnknownError("Connection error")
    const { response } = error;
    const errorXML = response.data;

    // When no XML comes back
    if (!errorXML) {
      const errorData = {
        result: {},
        technicalValidationMessages: [],
      };
      return {
        error: errorData,
      };
    }
    const errorObj = parseResponseXML(errorXML);

    // Normalizing the error
    const generalErrorResponse = errorObj.GeneralErrorResponse;
    const generalExceptionResponse = errorObj.GeneralExceptionResponse;
    const errorData = generalErrorResponse || generalExceptionResponse;

    if (generalErrorResponse)
      return {
        error: errorData,
      };
    if (generalExceptionResponse)
      return {
        error: {
          result: generalExceptionResponse,
          technicalValidationMessages: null,
        },
      };
    // This line never ought to be reached, but it's here in case the API were to change in the future
    return returnUnknownError("Unknown error, the API has changed!")
  }
}

const returnUnknownError = (message = "Unknown error! (created by the lib)") => ({
  error: {
    result: {
      funcCode: "ERROR",
      message
    },
    technicalValidationMessages: null
  },
});
