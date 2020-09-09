// PARAMS
import InvoiceChainDigestOptions from "./types/invoiceChainDigestParams";
import InvocieCheckOptions from "./types/invoiceCheckParams";
import InvoiceDataOptions from "./types/invoiceDataParams";
import InvoiceDigestOptions from "./types/invoiceDigestParams";
import TransactionListOptions from "./types/transcationListParams";
import TransactionStatusOptions from "./types/transactionStatusParams";
import TaxpayerOptions from "./types/taxpayerParams";
import AnnulmentOperationList from "./types/manageAnnulmentParams";
import InvoiceOperationList from "./types/manageInvoiceParams";

// RESPONSES
import {
  InvoiceChainDigestResult_CORE as ICDR_CORE,
  InvoiceChainDigestResult_FORMATTED as ICDR_FORMATTED,
  InvoiceChainDigestResult_RAW as ICDR_RAW,
} from "./types/invoiceChainDigestResult";
import {
  InvoiceCheckResults_CORE as ICR_CORE,
  InvoiceCheckResults_FORMATTED as ICR_FORMATTED,
  InvoiceCheckResults_RAW as ICR_RAW,
} from "./types/invoiceCheckResult";
import {
  InvoiceDataResults_CORE as IDR_CORE,
  InvoiceDataResults_FORMATTED as IDR_FORMATTED,
  InvoiceDataResults_RAW as IDR_RAW,
} from "./types/invoiceDataResult";
import {
  QueryInvoiceDigestResults_CORE as QIDR_CORE,
  QueryInvoiceDigestResults_FORMATTED as QIDR_FORMATTED,
  QueryInvoiceDigestResults_RAW as QIDR_RAW,
} from "./types/invoiceDigestResult";
import {
  Taxpayer_CORE as T_CORE,
  Taxpayer_FORMATTED as T_FORMATTED,
  Taxpayer_RAW as T_RAW,
} from "./types/taxpayerResult";
import {
  TransactionListResult_CORE as TLR_CORE,
  TransactionListResult_FORMATTED as TLR_FORMATTED,
  TransactionListResult_RAW as TLR_RAW,
} from "./types/transactionListResult";
import {
  ProcessingStatusResults_CORE as PSR_CORE,
  ProcessingStatusResults_FORMATTED as PSR_FORMATTED,
  ProcessingStatusResults_RAW as PSR_RAW,
} from "./types/transactionStatusResult";

declare class NavClient {
  /**
   * The Class representing the NavClient API.
   * All public endpoints of the NAV Online API are matched to the methods of this class.
   * All class methods are asynchronous, and their result implement the NavClient.GeneralResponse interface.
   * 
   * When errorChecking the results, one should always test the response.result.validationResultCode property.
   * ```js
   * const client = new NavClient(NavClientOptions);
   * client.queryInvoiceCheck(invoiceCheckParams)
   *  .then(resp => {
   *    if (resp.result.validationResultCode === "ERROR") {
   *       resp.errors ? console.log(resp.errors) : console.log(resp.result)
   *    } else {
   *      console.log(resp)
   *    }
   *  })
   *  .catch(e => console.log(e))
   * ```
   */
  constructor(NavClientOptions: {
    userData: NavClient.UserData;
    softwareData: NavClient.SoftwareData;
    timeount?: number;
    sandbox?: boolean;
  });
  /**
   * The operation is used for submitting technical annulment codes. 
   * Technical annulment can only be submitted for data reports that have already been received and given the DONE status by NAV.  
   * @param {number} maxNumberOfRetries By default is one, and should be an integer.
   * @returns {object} All parameters of the GeneralResponseType (except for length) are equal to the transactionId sent back from the API.
   * 
   * The annulmentOperationList cannot be longer than a 100 entries, nor can be empty, and should adhere to the AnnulmentOperationList type!
   * Compression of the annulmentData is not supported in this client! The total size limit of the request is 10MB!
   */
  manageAnnulment(
    annulmentOperationList: NavClient.AnnulmentOperationListType,
    maxNumberOfRetries?: number
  ): Promise<NavClient.GeneralResponse<string, string, string>>;
  /**
   * The operation used for submitting the reported invoice data to NAV, which includes those for the original, modifying or cancelling invoices. 
   * @param {number} maxNumberOfRetries By default is one, and should be an integer.
   * @returns {object} All parameters of the GeneralResponseType (except for length) are equal to the transactionId sent back from the API.
   * 
   * The invoiceOperationList cannot be longer than a 100 entries, nor can be empty, and should adhere to the InvoiceOperationList type!
   * Compression of the invoiceData is not supported in this client! The total size limit of the request is 10MB!
   */
  manageInvoice(
    invoiceOperationList: NavClient.InvoiceOperationListType,
    maxNumberOfRetries?: number
  ): Promise<NavClient.GeneralResponse<string, string, string>>
  /**
   * The operation returns a pageable invoice list matching the query parameters provided.
   * The items in the list are the items in the invoice chain for the specified base invoice.
   */
  queryInvoiceChainDigest(
    invoiceChainDigestParams: NavClient.InvoiceChainDigestParams
  ): Promise<NavClient.GeneralResponse<ICDR_RAW, ICDR_FORMATTED, ICDR_CORE>>;

  /**
   * The operation checks whether a data report exists in the system for the invoice number provided, without returning the entire data content of the invoice.
   */
  queryInvoiceCheck(
    invoiceCheckParams: NavClient.InvoiceCheckParams
  ): Promise<NavClient.GeneralResponse<ICR_RAW, ICR_FORMATTED, ICR_CORE>>;
  /**
   * The operation returns the entire data content of the invoice for the invoice number given.
   */
  queryInvoiceData(
    invoiceDataParams: NavClient.InvoiceDataParams
  ): Promise<NavClient.GeneralResponse<IDR_RAW, IDR_FORMATTED, IDR_CORE>>;
  /**
   * The operation returns a pageable invoice list matching the query parameters provided. The response will not contain all of the business data contained in the invoices, but only a digest.
   * If required, the queryInvoiceData operation can be used to query the full data content of any of the invoices in the list, searching by invoice number.
   */
  queryInvoiceDigest(
    invoiceDigestParams: NavClient.InvoiceDigestParams
  ): Promise<NavClient.GeneralResponse<QIDR_RAW, QIDR_FORMATTED, QIDR_CORE>>;
  /**
   * The operation is used to list the invoice data services sent for the technical user’s tax number within the time interval specified in the request.
   */
  queryTransactionList(
    transcationListParams: NavClient.TransactionListParams
  ): Promise<NavClient.GeneralResponse<TLR_RAW, TLR_FORMATTED, TLR_CORE>>;
  /**
   * The operation is used for the querying the status and results of the invoice data reporting process.
   */
  queryTransactionStatus(
    transactionStatusParams: NavClient.TransactionStatusParams
  ): Promise<NavClient.GeneralResponse<PSR_RAW, PSR_FORMATTED, PSR_CORE>>;
  /**
   * operation can report data on the authenticity and validity of tax numbers based on the NAV database
   */
  queryTaxpayer(
    taxpayerParams: NavClient.TaxpayerParams
  ): Promise<NavClient.GeneralResponse<T_RAW, T_FORMATTED, T_CORE>>;
  /**
   * Attempts to obtain connection to the server, and returns whether it was succesful.
   * @param maxNumberOfRetries Decides how many attempts the client should make in total at obtaining connection to the server. Default is one, should be an integer.
   */
  testConnection(
    maxNumberOfRetries?: number
  ): Promise<boolean>
}

declare namespace NavClient {
  export type UserData = {
    login: string;
    password: string;
    taxNumber: string;
    signatureKey: string;
  };
  export type SoftwareData = {
    softwareId: string;
    softwareName: string;
    softwareOperation: string;
    softwareMainVersion: string;
    softwareDevName: string;
    softwareDevContact: string;
  };
  export type ApiResponseResult = {
    funcCode: ["OK", "ERROR"];
    errorCode?: string;
    message?: string;
  };
  export type ApiValidationError = {
    validationResultCode: string;
    validationErrorCode?: string;
    message?: string;
  };
  export interface GeneralResponse<RawType, FormattedType, CoreType> {
    result: ApiResponseResult;
    data: null | {
      raw: RawType;
      formatted: FormattedType;
      length: number;
      core: CoreType;
    };
    errors: null | ApiValidationError | Array<ApiValidationError>;
  }
  export type InvoiceChainDigestParams = InvoiceChainDigestOptions;
  export type InvoiceCheckParams = InvocieCheckOptions;
  export type InvoiceDataParams = InvoiceDataOptions;
  export type InvoiceDigestParams = InvoiceDigestOptions;
  export type TransactionListParams = TransactionListOptions;
  export type TransactionStatusParams = TransactionStatusOptions;
  export type TaxpayerParams = TaxpayerOptions;
  export type InvoiceOperationListType = InvoiceOperationList;
  export type AnnulmentOperationListType = AnnulmentOperationList;
}

export = NavClient;
