# nav-client-2

Node.js module that provides an instantiable client-interface for communicating with the NAV Online API of the National Tax and Customs Authority of Hungary.

This module is based on the [specifications](https://onlineszamla.nav.gov.hu/api/files/container/download/Online%20Szamla_Interfesz%20specifik%C3%A1ci%C3%B3_EN_v2.0.pdf) of the V2 API.

Type definitions are included for all the parameter and response types.

**This module doesn't do any type conversions. This module uses fast-xml-parser for conversion between objects and the XML code the API communicates with. The simple types in the type definitions are based on the expected behaviour. All the exact format-constraints can be found in the official documentations.**

## Example Setup
```js

const userSettings = {
  login: "loginName",
  password: "plainTextPassword",
  taxNumber: "12345678",
  signatureKey: "my-secret-signature-key",
};

const softwareSettings = {
  softwareId: "123456789123456789",
  softwareName: "NavClient",
  softwareOperation: "LOCAL_SOFTWARE",
  softwareMainVersion: "1.0",
  softwareDevName: "NavClientDev",
  softwareDevContact: "NavClientDevEmail",
  softwareDevCountryCode: "HU",
  softwareDevTaxNumber: "12345678"
}
/* Creating the client instance. */
const client = new NavClient({
  userData: userSettings,
  softwareData: softwareSettings,
  sandbox: false,
  timeout: 60000
})
/* All the client methods are asynchronous. */
(async () => {
  // You can test connection to the NAV API by the testConnection method. 
  // You can specify how many attempts the client should make at obtaining connection in case the first one fails (default is just one). 
  // This method return the boolean value of the success of the operation.
  const canConnect = await client.testConnection();
  console.log(canConnect ? "Connection sucsessfully established!" : "There is a service downage or a network error!");

  /* Example of sending an invoice to the NAV API. */
  // The invoceOperationList object should conform with the InvoiceOperationListType type.
  // The list cannot be empty, nor can have more than a 100 items in it.
  // The total size of the final request XML cannot be over 10MB!
  const invoiceOperationList = [{
    index: 1,
    invoiceOperation: "CREATE",
    invoiceData: "base64 encoded XML string of the invoice data"
  }]

  const response = await client.manageInvoice(invoiceOperationList);
  
  // All methods return a representation of the GeneralResponse interface.
  // The module shouldn't normally throw, only in case of some 'critical error'.
  // General error handling should look approximately like this.

  if (response.result.funcCode === "ERROR") {
    // Handle the error here
    // Dummy example

    // response.errors holds an array of the technical error messages returned from the API.
    // A more general error description can usually be found in response.result.errorCode and response.result.message
    response.errors ? console.log(response.errors) : console.log(response.result)
    
    return
  } 

  // All requests sent to the API are represented as transactions. 
  // A single transaction can contain multiple actions.
  // In manageInvoice and manageAnnulment operations, all data properties (except length) return the transactionId (for response comformity, as nothing else is sent back).
  const transactionId = response.data.core;

  const transactionStatusResponse = await client.queryTransactionStatus({
    transactionId
  });

  if ( transactionStatusResponse.result.funcCode === "ERROR" ) {
    // ...do error handling
    return
  }

  // queryTransactionStatus might return an OK funcCode with no data in case the request was formally correct, but the requested transaction doesn't exist
  if ( !transactionStatusResponse.data ) {
    // ...do error handling
    return
  }
  transactionStatusResponse.data.core.forEach(processingResult => {
    if (processingResult.invoiceStatus === "DONE") {
      console.log("Processing succeeded!")
    } else if (processingResult.invoiceStatus === "ABORTED") {
      // The specific error information (when present) can be found in either technicalValidationMessages or businessValidationMessages
      console.log("Processing has been aborted, an error might have occured!")
    } else {
      console.log("Still processing...")
    }
  })


})()

```

## NavClient API

### Full list of methods

NavClient API methods

* manageAnnulment
* manageInvoice
* queryInvoiceChainDigest
* queryInvoiceCheck
* queryInvoiceData
* queryInvoiceDigest
* queryTaxpayer
* queryTransactionList
* queryTransactionStatus
* testConnection

Type definitions are provided for all the parameters and the return values.

### NavClient

The class representing the NAV Online API.

```js
/**
 * The Class representing the NavClient API.
 * All public endpoints of the NAV Online API are matched to the methods of this class.
 * All class methods are asynchronous, and their result implement the NavClient.GeneralResponse interface.
 * 
 * @param {NavClient.UserData} userData The user specific data (the technical user's data provided by the service)
 * @param {NavClient.SoftwareData} softwareData The descriptor data of the software / program that communicates with the API. Has a fallback when not provided.
 * @param {number} [timeout = 60000] The timeout of the calls. Should be left unchanged for avoiding both infinitely pending respons on outages and dropped responses.
 * @param {boolean} [sandbox = false] Decides whether to use the development testing API or the production API of the service.
 */

const client = new NavClient({ userData: userSettings, sandbox: false});

```

### manageAnnulment

Method that allows for annulment of invoices, can be used with multiple invoices at a time.

```js
/**
 * The operation is used for submitting technical annulment codes. 
 * Technical annulment can only be submitted for data reports that have already been received and given the DONE status by NAV.  
 * @param {number} maxNumberOfRetries By default is one, and should be an integer.
 * @returns {object} All parameters of the GeneralResponseType (except for length) are equal to the transactionId sent back from the API.
 * 
 * The annulmentOperationList cannot be longer than a 100 entries, nor can be empty, and should adhere to the AnnulmentOperationList type!
 * Compression of the annulmentData is not supported in this client! The total size limit of the request is 10MB!
 */

const response = await client.manageAnnulment(annulmentOperationList);
const transactionId = response.data.core;

```

Example for annulmenOperationList parameter:

```js
const annulmentOperationList = [{
  index: 1, // Increasing sequential integers, starting at 1, not exceeding 100.
  annulmentOperation: "ANNUL", // Only possible value.
  invoiceAnnulment: "base64 string of the annulment XML" // See the official documentation for it's makeup.
}]

```

### manageInvoice

Method that allows for sending invoices to the NAV Online service.

```js
/**
 * The operation used for submitting the reported invoice data to NAV, which includes those for the original, modifying or cancelling invoices. 
 * @param {number} maxNumberOfRetries By default is one, and should be an integer.
 * @returns {object} All parameters of the GeneralResponseType (except for length) are equal to the transactionId sent back from the API.
 * 
 * The invoiceOperationList cannot be longer than a 100 entries, nor can be empty, and should adhere to the InvoiceOperationList type!
 * Compression of the invoiceData is not supported in this client! The total size limit of the request is 10MB!
 */

const response = await client.manageInvoice(invoiceOperationList);
const transactionId = response.data.core;
```

Example for invoiceOperationList parameter:

```js
const invoiceOperationList = [{
  index: 1, // Increasing sequential integers, starting at 1, not exceeding 100.
  invoiceOperation: "CREATE", // Possible values are CREATE, MODIFY, STORNO.
  invoiceData: "base64 encoded XML string of the invoice data" // See the official documentation for it's makeup. (The InvoiceDataType type definition is also included in this module.)
}]

```

Although the NAV Online service does support gzip compression of the invoice data, this client doesnt.
**Do not insert the compressed data into the invoiceData property, as it is guaranteed to cause a processing error!**

### queryInvoiceData

Method that allows for retrieving the complete stored data-set of an already processed invoice.

```js
const response = await client.queryInvoiceData(invoiceDataParams);
const { auditData, compressedContentIndicator, invoiceData } = response.data.raw; // Returns the raw, unparsed base64 invoiceData.
const parsedInvoiceData = response.data.core; // Might be null in case the invoice was compressed.
```

**This module doesn't internally handle decompression of the invoices.**

Type definition for the invoiceDataParams:

```ts
type NavClient.InvoiceDataParams = {
    invoiceNumber: string;
    invoiceDirection: "INBOUND" | "OUTBOUND";
    batchIndex?: number;
    supplierTaxNumber?: string;
}
```

Example use:
```js
const response = await client.queryInvoiceData({
  invoiceDirection: "INBOUND",
  invoiceNumber: "invoice-number"
})

// invoiceMain holds the actual invoice object, the other two sort of speak for themselves.
const { invoiceIssueDate, invoiceMain, invoiceNumber } = response.data.core;

```

### queryInvoiceDigest

Method that allows for querying the invoices stored in the NAV Online service.

```js
/**
 * The operation returns a pageable invoice list matching the query parameters provided. The response will not contain all of the business data contained in the invoices, but only a digest.
 * If required, the queryInvoiceData operation can be used to query the full data content of any of the invoices in the list, searching by invoice number.
 */

const response = await client.queryInvoiceDigest(invoiceDigestParams);
const invoicesFound = response.data.core;
```

There might not be any invoices found, in that case the formatted response presents an empty Array.

Type definition for the invoiceDigestParams:

```ts
interface InvoiceDigestParams {
  page: number,
  invoiceDirection: ["INBOUND", "OUTBOUND"],
  mandatory: InvoiceDigestMandatoryParams,
  additional?: InvoiceDigestAdditionalParams,
  relational?: InvoiceDigestRelationalParams,
  transaction?: InvoiceDigestTransactionParams
}
// See src/types/invoiceDigestParams.ts for more details.
```

Example use:

```js
/* First basic alternative */
const response = await client.queryInvoiceDigest({
  invoiceDirection: "INBOUND",
  page: 1,
  mandatory: {
    invoiceIssueDate: {
      dateFrom: "2020-08-01",
      dateTo: "2020-08-30"
    }
  }
})

/* Second basic alternative */
const response = await client.queryInvoiceDigest({
  invoiceDirection: "INBOUND",
  page: 1,
  mandatory: {
    insDate: {
      dateFrom: (new Date( Date.now() - 30 * 24 * 60 * 60 * 1000 )).toISOString(),
      dateTo: (new Date()).toISOString()
    }
  }
})

/* Third basic alternative */
const response = await client.queryInvoiceDigest({
  invoiceDirection: "OUTBOUND",
  page: 1,
  mandatory: {
    originalInvoiceNumber: "original invoice number"
  }
})


// Printing out the insertion timestamps of the retrieved invoices.
const invoiceDigestArray = response.data.core;
invoiceDigestArray.forEach(invoiceDigest => console.log(invoiceDigest.insDate))

```

Alongside the mandatory parameters, you can narrow your search using an abundance of query parameters, the details of which can be found in the type definitions (src/types/invoiceDigestParams.ts).

## queryTaxpayer

Method that allows for checking a vat number's validity and retrieving the taxpayer details.

```js

const response = await client.queryTaxpayer({
  taxNumber: "12345678"
});

const { infoDate, taxpayerValidity } = response.data.core;
// Only the first two properties are guaranteed to have a value.
const { taxpayerName, taxNumberDetail, taxpayerShortName, taxpayerAddressList, vatGroupMembership } = response.data.formatted;

```

**Taxpayer validity should always be checked, as if that's not true, there might be no data sent back under response.data.formatted and response.data.raw!**

## queryTransactionStatus

Method that allows for querying the status and result of the invoice data reporting process.

See the example in the beggining of this README!

## Maintenance

This repository is maintained by a single person, done in his free-time. 

PRs, fixes, ideas are welcome!