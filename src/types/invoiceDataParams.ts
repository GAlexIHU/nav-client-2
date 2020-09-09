type InvoiceDataParams = {
  invoiceNumber: string,
  invoiceDirection: "INBOUND" | "OUTBOUND",
  batchIndex?: number,
  supplierTaxNumber?: string
}

export default InvoiceDataParams