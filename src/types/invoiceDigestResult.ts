export type QueryInvoiceDigestResults_RAW = InvoiceDigestResultType
export type QueryInvoiceDigestResults_FORMATTED = InvoiceDigestResultType
export type QueryInvoiceDigestResults_CORE = InvoiceDigestType | Array<InvoiceDigestType>

type InvoiceDigestResultType = {
  currentPage: number,
  availablePage: number,
  invoiceDigest?: InvoiceDigestType | Array<InvoiceDigestType>
}

type InvoiceDigestType = {
  invoiceNumber: string,
  batchIndex?: number,
  invoiceOperation: [
    "CREATE",
    "MODIFY",
    "STORNO"
  ],
  invoiceCategory: {
    "NORMAL",
    "SIMPLIFIED",
    "AGGREGATE"
  },
  invoiceIssueDate: string,
  supplierTaxNumber: string,
  supplierGroupTaxNumber?: string,
  supplierName: string,
  customerTaxNumber?: string,
  customerGroupTaxNumber?: string,
  customerName?: string,
  paymentMethod?: [
    "TRANSFER",
    "CASH",
    "CARD",
    "VOUCHER",
    "OTHER"
  ],
  paymentDate?: string,
  invoiceAppearance?: [
    "PAPER",
    "ELECTRONIC",
    "EDI",
    "UNKNOWN"
  ],
  source?: [
    "WEB",
    "XML",
    "MGM",
    "OPG"
  ],
  invoiceDeliveryDate?: string,
  currency?: string,
  invoiceNetAmount?: number,
  invoiceNetAmountHUF?: number,
  invoiceVatAmount?: number,
  invoiceVatAmountHUF?: number,
  transactionId?: string,
  index?: number,
  originalInvoiceNumber?: string,
  modificatonIndex?: number,
  insDate: string
}