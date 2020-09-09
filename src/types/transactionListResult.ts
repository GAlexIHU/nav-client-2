export type TransactionListResult_RAW = TransactionListResultType;
export type TransactionListResult_FORMATTED = TransactionListResultType;
export type TransactionListResult_CORE = TransactionType | Array<TransactionType> | null;

type TransactionListResultType = {
  currentPage: number;
  availablePage: number;
  transaction?: TransactionType | Array<TransactionType>;
};

type TransactionType = {
  insDate: string;
  insCusUser: string;
  source: "WEB" | "XML" | "M2M" | "OPG";
  transactionId: string;
  originalRequestVersion: string;
  itemCount: number;
};
