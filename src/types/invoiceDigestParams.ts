// Mandatory Query Params
type InvoiceDigestMandatoryIssueDate = {
  invoiceIssueDate: {
    dateFrom: string,
    dateTo: string
  }
}

type InvoiceDigestMandatoryInsDate = {
  insDate: {
    dateFrom: string,
    dateTo: string
  }
}

type InvoiceDigestMandatoryInvoiceNum = {
  originalInvoiceNumber: string
}

type InvoiceDigestMandatoryParams = InvoiceDigestMandatoryInsDate | InvoiceDigestMandatoryInvoiceNum | InvoiceDigestMandatoryIssueDate
// Additional Query Params

type InvoiceDigestAdditionalParams = {
  taxNumber?: string,
  groupMemberTaxNumber?: string,
  name?: string,
  invoiceCategory?: ["NORMAL", "SIMPLIFIED", "AGGREGATE"],
  paymentMethod?: ["TRANSFER", "CASH", "CARD", "VOUCHER", "OTHER"],
  invoiceAppearence?: ["PAPER", "ELECTRONIC", "EDI", "UNKNOWN"],
  source?: ["WEB", "XML", "MGM", "OPG"],
  currency?: string
}

type QueryOperatorType = ["EQ", "GT", "GTE", "LT", "LTE"]

// Relational Query Params
type InvoiceDigestRelationalParams = {
  invoiceDelivery?: {
    queryOperator: QueryOperatorType,
    queryValue: string
  },
  paymentDate?: {
    queryOperator: QueryOperatorType,
    queryValue: string
  },
  invoiceNetAmount?: {
    queryOperator: QueryOperatorType,
    queryValue: number
  },
  invoiceNetAmountHUF?: {
    queryOperator: QueryOperatorType,
    queryValue: string
  },
  invoiceVatAmount?: {
    queryOperator: QueryOperatorType,
    queryValue: string
  },
  invoiceVatAmountHUF?: {
    queryOperator: QueryOperatorType,
    queryValue: string
  }
}

// Transaction Query Params
type InvoiceDigestTransactionParams = {
  transactionId?: string,
  index?: string,
  invoiceOperation?: ["CREATE", "MODIFY", "STORNO"]
}

interface InvoiceDigestParams {
  page: number,
  invoiceDirection: ["INBOUND", "OUTBOUND"],
  mandatory: InvoiceDigestMandatoryParams,
  additional?: InvoiceDigestAdditionalParams,
  relational?: InvoiceDigestRelationalParams,
  transaction?: InvoiceDigestTransactionParams
}

export default InvoiceDigestParams