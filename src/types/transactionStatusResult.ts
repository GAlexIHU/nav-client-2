export type ProcessingStatusResults_RAW = ProcessingResultListType;
export type ProcessingStatusResults_FORMATTED = ProcessingResultListType & {
  processingResult: ProcessingResultType_FORMATTED | Array<ProcessingResultType_FORMATTED>;
};
export type ProcessingStatusResults_CORE =
  | ProcessingResultType_FORMATTED
  | Array<ProcessingResultType_FORMATTED>;

type ProcessingResultListType = {
  processingResult: ProcessingResultType | Array<ProcessingResultType>;
  originalRequestVersion: string;
  annulmentData?: AnnulmentDataType;
};

type ProcessingResultType = {
  index: number;
  batchIndex?: number;
  invoiceStatus: "RECEIVED" | "PROCESSING" | "SAVED" | "DONE" | "ABORTED";
  technicalValidationMessages?:
    | TechnicalValidationMessageType
    | Array<TechnicalValidationMessageType>;
  businessValidationMessages?: BusinessValidationMessageType | Array<BusinessValidationMessageType>;
  compressedContentIndicator: boolean;
  originalRequest?: string;
};

type ProcessingResultType_FORMATTED = ProcessingResultType & {
  originalRequest: string | any | null;
};

type AnnulmentDataType = {
  annulmentVerificationStatus:
    | "NOT_VERIFIABLE"
    | "VERIFICATION_PENDING"
    | "VERIFICATION_DONE"
    | "vERIFICATION_REJECTED";
  annulmentDecisionDate?: string;
  annulmentDecisionUser?: string;
};

type TechnicalValidationMessageType = {
  validationResultCode: string;
  validationErrorCode?: string;
  message?: string;
};

type BusinessValidationMessageType = TechnicalValidationMessageType & {
  pointer?: {
    value: string;
    line: number;
    originalInvoiceNumber: string;
    tag: string;
  };
};
