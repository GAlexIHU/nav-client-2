const { createRequestXML, parseResponseXML } = require("./xmlParsing");

/**
 * Handles the actual sending of the request, the conversions between XMl and JsObjects, and the error-handling.
 * ```
 * IT CURRENTLY DOESNT SUPPORT NEITHER GZIPPING, NOR HAS COMPLETE ERROR HANDLING IN PLACE!
 * ``` 
 */
module.exports = async function sendRequest({ request, axios, route }) {
  const requestXml = createRequestXML(request);
  try {
    const response = await axios.post(route, requestXml);
    const data = parseResponseXML(response.data);
    return data;
  } catch (error) {
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

    // safeguard
    return {
      error: {
        result: {
          funcCode: "ERROR",
        },
        technicalValidationMessages: [
          {
            validationResultCode: "ERROR",
            message: "Unknown error! (created by the lib)",
          },
        ],
      },
    };
  }
};
