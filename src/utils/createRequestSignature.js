const crypto = require("crypto");

/**
 * Creates the required signature. Used in all operations, except for manageInvoice and manageAnnulment.
 * @param {string} requestId
 * @param {Date} date
 * @param {string} signatureKey
 */
exports.createPartialRequestSignature = (requestId, date, signatureKey) => {
  // The timestamp is the ISO date to seconds precision with the non-numeric characters removed (as a string)
  const timestamp = `${date.toISOString().split(".")[0].replace(/[-:T]/g, "")}`;
  const hash = crypto.createHash("sha3-512");
  const concatenatedString = `${requestId}${timestamp}${signatureKey}`;

  hash.update(concatenatedString);
  // The hash is expected to be in hex, all uppercase
  return hash.digest("hex").toUpperCase();
};

/**
 * Creates the required signature in the manageInvoice and manageAnnulment operations.
 * @param {Array<object>} actionList The list of actions executed by the operation.
 */
exports.createFullRequestSignature = (requestId, timestamp, signatureKey, actionList) => {
  const partial = `${requestId}${timestamp}${signatureKey}`;
  const actionHashes = actionList.reduce((previousString, action) => {
    const operation = action.invoiceOperation || action.annulmentOperation;
    const data = action.invoiceData || action.invoiceAnnulment;
    const actionHash = crypto
      .createHash("sha3-512")
      .update(`${operation}${data}`)
      .digest("hex")
      .toUpperCase();
    return `${previousString}${actionHash}`;
  }, "");

  return crypto
    .createHash("sha3-512")
    .update(`${partial}${actionHashes}`)
    .digest("hex")
    .toUpperCase();
};
