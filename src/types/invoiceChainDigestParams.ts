type InvoiceChainDigestParams = {
  page: number,
  invoiceNumber: string,
  invoiceDirection:  "INBOUND" | "OUTBOUND",
  taxnumber?: string
}

export default InvoiceChainDigestParams