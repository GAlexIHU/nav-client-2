const cuid = require("cuid")
const crypto = require("crypto")
const { pick } = require("lodash")

const { createPartialRequestSignature } = require("./createRequestSignature")

/**
 * Creates the Request object implementing the BaseRequestType interface. 
 */
module.exports = function createBaseRequest({
  requestType,
  userData,
  softwareData
}) {
  // I decided to use the cuid library for the entityId generation, because it fits the required schema comfortably.
  // (Otherwise it's completely arbitrary, anything else should do just as well)
  const date = new Date();
  const requestId = cuid();

  // Assembling the User data
  const { login, password, taxNumber, signatureKey } = userData;
  const passwordHash = crypto
    .createHash("sha512")
    .update(password)
    .digest("hex")
    .toUpperCase();
  
  // Even though the last two properties are not required I decided to include them here.
  const software = pick({...defaultSoftwareData, ...softwareData}, [
    "softwareId",
    "softwareName",
    "softwareOperation",
    "softwareMainVersion",
    "softwareDevName",
    "softwareDevContact",
    "softwareDevCountryCode",
    "softwareDevTaxNumber"
  ])

  // Getting the partial signature
  const requestSignature = createPartialRequestSignature(requestId, date, signatureKey)

  return {
    [requestType]: {
      $: {
        xmlns: 'http://schemas.nav.gov.hu/OSA/2.0/api',
      },
      header: {
        requestId,
        timestamp: date.toISOString(),
        requestVersion: "2.0",
        headerVersion: "1.0"
      },
      user: {
          login,
          passwordHash,
          taxNumber,
          requestSignature
      },
      software
    }
  }
}

// Default fallback gibberish for softwaredata (softwaredata is never actually checked or evaluated by the API)
const defaultSoftwareData = {
  softwareId: "123456789123456789",
  softwareName: "NavClient",
  softwareOperation: "LOCAL_SOFTWARE",
  softwareMainVersion: "1.0",
  softwareDevName: "NavClientDev",
  softwareDevContact: "NavClientDevEmail",
  softwareDevCountryCode: "HU",
  softwareDevTaxNumber: "12345678"
}
