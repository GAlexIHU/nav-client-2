type InvoiceCheckParams = {
  invoiceNumber: string,
  invoiceDirection: "INBOUND" | "OUTBOUND",
  batchIndex?: number,
  supplierTaxNumber?: string
}

export default InvoiceCheckParams