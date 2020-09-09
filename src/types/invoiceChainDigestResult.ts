export type InvoiceChainDigestResult_RAW = InvoiceChainDigestResultType & {
  invoiceChainElement: undefined | null | InvoiceChainElementType | Array<InvoiceChainElementType>
}
export type InvoiceChainDigestResult_FORMATTED = InvoiceChainDigestResultType
export type InvoiceChainDigestResult_CORE = Array<InvoiceChainElementType> | []

type InvoiceChainDigestResultType = {
  currentPage: number,
  availablePage: number,
  invoiceChainElement: Array<InvoiceChainElementType> | []
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
  invoiceOperation: "CREATE" | "MODIFY" | "STORNO" | string,
  supplierTaxNumber: string,
  customertaxNumber: string,
  insDate: string,
  originalRequestVersion: string
}

