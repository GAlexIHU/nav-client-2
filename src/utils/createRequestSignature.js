const crypto = require("crypto")

/**
 * Creates the required signature. Used in all operations, except for manageInvoice and manageAnnulment.
 * @param {string} requestId 
 * @param {Date} date 
 * @param {string} signatureKey 
 */
exports.createPartialRequestSignature = (requestId, date, signatureKey) => {
  // The timestamp is the ISO date to seconds precision with the non-numeric characters removed (as a string)
  const timestamp = `${ date.toISOString().split('.')[0].replace(/[-:T]/g,"") }`;
  const hash = crypto.createHash('sha3-512');
  const concatenatedString = `${requestId}${timestamp}${signatureKey}`;
  
  hash.update(concatenatedString);
  // The hash is expected to be in hex, all uppercase
  return hash.digest("hex").toUpperCase();
}

/**
 * Creates the required signature in the manageInvoice and manageAnnulment operations.
 */
exports.createFullRequestSignature = () => {

}