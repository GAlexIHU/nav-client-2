const axios = require("axios");

// The NAV Online API's production and sandbox endpoints
const defaultUrl = "https://api.onlineszamla.nav.gov.hu/invoiceService/v2/";
const sandboxUrl = "https://api-test.onlineszamla.nav.gov.hu/invoiceService/v2/";

// Route / action imports
const queryInvoiceChainDigest = require("./routes/queryInvoiceChainDigest");
const queryInvoiceCheck = require("./routes/queryInvoiceCheck");
const queryInvoiceData = require("./routes/queryInvoiceData");
const queryInvoiceDigest = require("./routes/queryInvoiceDigest");
const queryTransactionList = require("./routes/queryTransactionList");
const queryTransactionStatus = require("./routes/queryTransactionStatus");
const queryTaxpayer = require("./routes/queryTaxpayer");

// The Class Representing the NavClient API
module.exports = class NavClient {
  constructor({ userData, softwareData, timeout = 60000, sandbox = false }) {
    this.userData = userData;
    this.softwareData = softwareData;
    this.axios = axios.create({
      baseURL: sandbox ? sandboxUrl : defaultUrl,
      timeout,
      headers: {
        "content-type": "application/xml",
        accept: "application/xml",
        encoding: "UTF-8",
      },
    });
  }

  async queryInvoiceChainDigest(invoiceChainDigestParams) {
    return await queryInvoiceChainDigest({
      userData: this.userData,
      softwareData: this.softwareData,
      invoiceChainDigestParams,
      axios: this.axios,
    });
  }

  async queryInvoiceCheck(invoiceCheckParams) {
    return await queryInvoiceCheck({
      userData: this.userData,
      softwareData: this.softwareData,
      invoiceCheckParams,
      axios: this.axios,
    });
  }

  async queryInvoiceData(invoiceDataParams) {
    return await queryInvoiceData({
      userData: this.userData,
      softwareData: this.softwareData,
      invoiceDataParams,
      axios: this.axios,
    });
  }

  async queryInvoiceDigest(invoiceDigestParams) {
    return await queryInvoiceDigest({
      userData: this.userData,
      softwareData: this.softwareData,
      invoiceDigestParams,
      axios: this.axios,
    });
  }

  async queryTransactionList(transactionListParams) {
    return await queryTransactionList({
      userData: this.userData,
      softwareData: this.softwareData,
      transactionListParams,
      axios: this.axios,
    });
  }

  async queryTransactionStatus(transactionStatusParams) {
    return await queryTransactionStatus({
      userData: this.userData,
      softwareData: this.softwareData,
      transactionStatusParams,
      axios: this.axios,
    });
  }

  async queryTaxpayer(taxpayerParams) {
    return await queryTaxpayer({
      userData: this.userData,
      softwareData: this.softwareData,
      taxpayerParams,
      axios: this.axios,
    });
  }
};
