import { InvoiceDataType } from "./InvoiceDataType"

type InvoiceDataResultType = {
  invoiceData: string,
  auditData: AuditDataType,
  compressedContentIndicator: boolean 
}

type AuditDataType = {
  insDate: string,
  insCusUser: string,
  source: ["WEB", "XML", "M2M", "OPG"],
  transactionId?: string,
  index?: number,
  batchIndex?: number,
  originalRequestVersion: string
}

export type InvoiceDataResults_RAW = InvoiceDataResultType
export type InvoiceDataResults_FORMATTED = InvoiceDataResultType & {
  invoiceData: {
    InvoiceData: InvoiceDataType
  }
}
export type InvoiceDataResults_CORE = InvoiceDataType