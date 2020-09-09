export type TransactionListResult_RAW = TransactionListResultType & {
  transaction: undefined | null | TransactionType | Array<TransactionType> 
};
export type TransactionListResult_FORMATTED = TransactionListResultType;
export type TransactionListResult_CORE = Array<TransactionType> | [];

type TransactionListResultType = {
  currentPage: number;
  availablePage: number;
  transaction: Array<TransactionType> | [];
};

type TransactionType = {
  insDate: string;
  insCusUser: string;
  source: "WEB" | "XML" | "M2M" | "OPG";
  transactionId: string;
  originalRequestVersion: string;
  itemCount: number;
};
