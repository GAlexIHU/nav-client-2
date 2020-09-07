export type InvoiceChainDigestResult_RAW = InvoiceChainDigestResultType
export type InvoiceChainDigestResult_FORMATTED = InvoiceChainDigestResultType
export type InvoiceChainDigestResult_CORE = InvoiceChainElementType | Array<InvoiceChainElementType> | null

type InvoiceChainDigestResultType = {
  currentPage: number,
  availablePage: number,
  invoiceChainElement: InvoiceChainElementType | Array<InvoiceChainElementType>
}

type InvoiceChainElementType = {
  invoiceChainDigest: InvoiceChainDigestType,
  invoiceLines: {
    maxLineNumber: number,
    newCreatedLines?: any
  },
  invoiceReferenceData?: {
    originalInvoiceNumber: string,
    modifyWithoutMaster: boolean
  }

}

type InvoiceChainDigestType = {
  invoiceNumber: number,
  batchIndex?: number,
  invoiceOperation: ["CREATE", "MODIFY", "STORNO"] | string,
  supplierTaxNumber: string,
  customertaxNumber: string,
  insDate: string,
  originalRequestVersion: string
}

