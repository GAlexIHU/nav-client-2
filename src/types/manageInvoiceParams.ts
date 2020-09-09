type InvoiceOperationList = Array<{
  index: number,
  invoiceOperation: "CREATE" | "MODIFY" | "STORNO",
  invoiceData: string
}>

export default InvoiceOperationList