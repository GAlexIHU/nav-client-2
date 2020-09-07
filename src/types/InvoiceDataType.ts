export type InvoiceDataType = {
  invoiceNumber: string,
  invoiceIssueDate: string,
  invoiceMain: {
    invoice: InvoiceType
  }
}

export type InvoiceType = {
  invoiceHead: InvoiceHead,
  invoiceLines: InvoiceLines,
  productFeeSummary?: ProductFeeSummary,
  invoiceSummary: InvoiceSummary
}

type InvoiceHead = {
  supplierInfo: SupplierInfoType,
  customerInfo?: CustomerInfoType,
  fiscalRepresentativeInfo?: FiscalRepresentativeInfoType,
  invoiceDetail: InvoiceDetailType
}

type InvoiceLines = {
  line: LineType | Array<LineType>
}

type ProductFeeSummary = {
  productFeeOperation: ["REFUND", "DEPOSIT"],
  productFeeData: ProductFeeDataType | Array<ProductFeeDataType>,
  productChargeSum: number,
  paymentEvidenceDocumentData?: {
    ecidenceDocumentNo: string,
    evidenceDocumentDate: string,
    obligatedName: string,
    obligatedAddress: AddressType,
    obligatedTaxNumber: TaxNumberType
  }

}

type InvoiceSummary = {
  summaryNormal: SummaryNormalType
} | {
  sumamrySimplified: SummarySimplifiedType
}

// Invoice Head Types

type SupplierInfoType = ({
  supplierTaxNumber: TaxNumberType
} | {
  groupMemberTaxNumber: TaxNumberType
} | {
  communityVatNumber: string
}) & {
  supplierName: string,
  supplierAddress: AddressType,
  supplierBankAcountNumber?: string,
  individualExemption?: boolean,
  exciseLicenceNum?: string
}

type CustomerInfoType = ({
  customerTaxNumber: TaxNumberType
} | {
  groupMemberTaxNumber: TaxNumberType
} | {
  communityVatNumber: string
}) & {
  thirdStateTaxId?: string,
  customerName: string,
  customerAddress: AddressType,
  customerBankAccountNumber: string
}

type FiscalRepresentativeInfoType = {
  fiscalRepresentativeTaxNumber: TaxNumberType,
  fiscalRepresentativeName: string,
  fiscalRepresentativeAddress: AddressType,
  fiscaRepresentativeBankAcountNumber?: string
}

type InvoiceDetailType = {
  invoiceCategory: ["NORMAL", "SIMPLIFIED", "AGGREGATE"],
  invoiceDeliveryDate: string,
  invoiceDeliveryPeriodStart?: string,
  invoiceDeliveryPeriodEnd?: string,
  invoiceAccountingDeliveryDate?: string,
  periodicalSettlement?: boolean,
  smallBusinessIndicator?: boolean,
  currencyCode: string,
  exchangeRate: number,
  selfBillingIndicator?: boolean,
  paymentMethod?: ["TRANSFER", "CASH", "CARD", "VOUCHER", "OTHER"],
  paymentDate?: string,
  cashAccountingIndicator?: boolean,
  invoiceAppearance?: ["PAPER", "ELECTRONIC", "EDI", "UNKNOWN"],
  electronicInvoiceHash?: string,
  additionalInvoiceData?: AdditionalDataType
}

// Line Type
type LineType = {
  lineNumber: number,
  lineModificationReference?: LineModificationReference,
  referencesToOtherLines?: ReferencesToOtherLines,
  advanceIndicator?: boolean,
  productCodes?: {
    productCode: ProductCodeType
  } | Array<{
    productCode: ProductCodeType
  }>,
  lineExpressionIndicator?: boolean,
  lineNatureIndicator?: ["PRODUCT", "SERVICE", "OTHER"],
  lineDescription: string,
  quantity: number,
} & ({
  unitOfMeasure: [
    "PIECE",
    "KILOGRAM",
    "TON",
    "KWH",
    "DAY",
    "HOUR",
    "MINUTE",
    "MONTH",
    "LITER",
    "KILOMETER",
    "CUBIC_METER",
    "METER",
    "LINEAR_METER",
    "CARTON",
    "PACK"
  ]
} | {
  unitOfMeasure: "OWN",
  unitOfMeasureOwn: string
}) & {
  unitPrice: number,
  unitPriceHUF: number,
  lineDiscountData?: DiscountDataType,
  intermediatedService?: boolean,
  aggregateInvoiceLineData?: {
    lineExchangeRate?: number,
    lineDeliveryDate: string
  },
  newTransportMean?: NewTransportMeantype,
  depositIndicator?: boolean,
  marginSchemaIndicator?: [
    "TRAVEL_AGENCY",
    "SECOND_HAND",
    "ARTWORK",
    "ANTIQUES"
  ],
  ekaerIds?: string | Array<string>,
  obligatedForProductFee?: boolean,
  GPCExcise?: number,
  dieselOilPurchase?: DieselOilPurchaseType,
  netaDeclaration?: boolean,
  productFreeClause?: ProductFeeClauseType,
  lineProductFeeContent?: ProductFeeDataType,
  additionalLineData?: AdditionalDataType
} & ({
  lineAmountsNormal: LineAmountsNormalType
} | {
  lineAmountsSimplified: LineAmountsSimplifiedType
})

// Summary Type

type SummaryType = {
  summaryGrossData?: {
    invoiceGrossAmount: number,
    invoiceGrossAmountHUF: number
  }
} & ({
  summaryNormal: SummaryNormalType
} | {
  summarySimplified: SummarySimplifiedType | Array<SummarySimplifiedType>
})

// partial types

export type TaxNumberType = {
  taypayerId: string,
  vatCode?: string,
  countyCode?: string 
}

type SimpleAddressType = {
  countryCode: string,
  region?: string,
  postalCode: string | "0000",
  city: string,
  additionalAddressDetail: string
}

export type DetailedAddressType = Omit<SimpleAddressType,"additionalAddressDetail"> & {
  streetName: string,
  publicPlaceCategory: string,
  number?: string,
  building?: string,
  staircase?: string,
  floor?: string,
  door?: string,
  lotNumber?: string 
}

export type AddressType = {
  detailedAddress: DetailedAddressType
} | {
  simpleAddress: SimpleAddressType
}

type AdditionalDataType = {
  dataName: string,
  dataDescription: string,
  dataValue: string
}

type LineModificationReference = {
  lineNumberReference: number,
  lineOperation: ["CREATE", "MODIFY"]
}

type ReferencesToOtherLines = {
  referenceToOtherLine: number
} | Array<{
  referenceToOtherLine: number
}>

type ProductCodeType = {
  productCodeCategory: [
    "VTSZ",
    "SZJ",
    "KN",
    "AHK",
    "CSK",
    "KT",
    "EJ",
    "TESZOR",
    "OWN",
    "OTHER"
  ],
  productCodeValue: string,
  productCodeOwnValue: string
}

type DiscountDataType = {
  discountDescription?: string,
  discountValue?: number,
  discountRate?: number
}

type NewTransportMeantype = {
  brand?: string,
  serialNum?: string,
  enginenum?: string,
  firstEntryIntoService: string,
  vehicle?: {
    engineCapacity: number,
    enginePower: number,
    kms: number
  },
  vessel?: {
    length: number,
    activityReferred: boolean,
    sailedHours: number
  },
  aircraft?: {
    takeOffWeight: number,
    airCargo: boolean,
    operationHours: number,
  }
}

type DieselOilPurchaseType = {
  purchaseLocation: SimpleAddressType,
  purchaseDate: string,
  vehicleRegistrationNumber: string,
  dieselOilQuantity?: number
}

type ProductFeeClauseType = {
  productFeeTakeoverData: {
    takeoverReason: [
      "01",
      "02_aa",
      "02_ab",
      "02_b",
      "02_c",
      "02_d",
      "02_ea",
      "02_eb",
      "02_fa",
      "02_fb",
      "02_ga",
      "02_gb"
    ],
    takeoverAmount?: number
  },
  customerDeclaration: {
    productStream: string,
    productFreeWeight?: number
  }
}

type ProductFeeDataType = {
  productFeeCode: ProductCodeType,
  productFeeQuantity: number,
  productFeeMeasureUnit: string,
  productFeeRate: number,
  productFeeAmount: number
}

type LineAmountsNormalType = {
  lineNetAmountData: {
    lineNetAmount: number,
    lineNetAmountHUF: number
  },
  lineVatRate: VatRateType,
  lineVatData?: {
    lineVatAmount: number,
    lineVatAmountHUF: number
  },
  lineGrossAmountData?: {
    lineGrossAmountNormal: number,
    lineGrossAmountNormalHUF: number
  }
}

type VatRateType = {
  vatPercentage: number
} | {
  vatExamption: string
} | {
  vatOutOfScope: boolean
} | {
  vatDomesticReverseCharge: boolean
} | {
  marginSchemeVat: boolean
} | {
  marginSchemeNoVat: boolean
}

type LineAmountsSimplifiedType = {
  lineVatContent?: number,
  lineGrossAmountSimplified: number,
  lineGrossAmountSimplifiedHUF: number
}

type SummaryNormalType = {
  invoiceNetAmount: number,
  invoiceNetAmountHUF: number,
  invoiceVatAmount: number,
  invoiceVatAmountHUF: number,
  summaryByVatRate: SummaryByVatRateType 
}

type SummaryByVatRateType = {
  vatRate: VatRateType,
  vatRateNetData: {
    vatRateNetAmount: number,
    vatRateNetAmountHUF: number
  },
  vatRateVatData: {
    vatRateVatAmount: number,
    vatRateVatAmountHUF: number
  },
  vatRateGrossData?: {
    vatRateGrossAmount: number,
    vatRateGrossAmountHUF: number
  }
}

type SummarySimplifiedType = {
  vatRate: number,
  vatContentGrossAmount: number,
  vatContentGrossAmountHUF: number
}