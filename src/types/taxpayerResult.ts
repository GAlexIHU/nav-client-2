import { TaxNumberType, DetailedAddressType } from "./InvoiceDataType"

export type Taxpayer_CORE = {
  taxpayerValidity: boolean,
  infoDate: string | null
}
export type Taxpayer_RAW = TaxpayerDataType | null
export type Taxpayer_FORMATTED = TaxpayerDataType | null


type TaxpayerDataType = {
  taxpayerName: string,
  taxpayerShortName?: string,
  taxNumberDetail: TaxNumberType,
  vatGroupMembership?: string,
  taxpayerAddressList?: {
    taxpayerAddressItem: TaxpayerAddressItemType | Array<TaxpayerAddressItemType>
  }

}

type TaxpayerAddressItemType = {
  taxpayerAddressType: ["HQ", "SITE", "BRANCH"],
  taxpayerAddress: DetailedAddressType
}