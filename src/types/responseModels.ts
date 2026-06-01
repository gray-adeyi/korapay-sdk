import type {
  AuthModel,
  CardStatus,
  CardType,
  Country,
  Currency,
  MobileMoneyOperator,
  PaymentChannel,
  TransactionStatus,
} from "../enums.ts";

export type PaginationInfo = {
  readonly totalItems: number;
  readonly pageSize: number;
  readonly current: number;
  readonly count: number;
};

export type Metadata = {
  readonly gatewayCode?: string;
  readonly canResendOtp?: boolean;
  readonly otpAttemptsLeft?: number;
  readonly supportMessage?: string;
};

export type CardInfo = {
  readonly cardType: CardType;
  readonly firstSix: string;
  readonly lastFour: string;
  readonly expiry: string;
};

export type Customer = {
  readonly name: string;
  readonly email?: string;
  readonly phone?: string | null;
};

export type BankAccount = {
  readonly accountName: string;
  readonly accountNumber: string;
  readonly bankName: string;
  readonly bankCode?: string;
  readonly expiryDateInUtc?: string;
};

export type Charge = {
  readonly amount: number;
  readonly amountCharged: number;
  readonly authModel: AuthModel;
  readonly currency: Currency;
  readonly fee: number;
  readonly vat: number;
  readonly responseMessage: string;
  readonly paymentReference: string;
  readonly status: TransactionStatus;
  readonly transactionReference: string;
  readonly authorization?: {
    readonly requiredFields: string[];
  };
  readonly metadata?: Metadata;
  readonly card: CardInfo;
};

export type ResendCardOtpData = {
  readonly status: TransactionStatus;
  readonly responseMessage: string;
  readonly metadata: Metadata;
};

export type ChargeViaBankTransferData = {
  readonly currency: Currency;
  readonly amount: number;
  readonly amountExpected: number;
  readonly fee: number;
  readonly vat: number;
  readonly reference: string;
  readonly paymentReference: string;
  readonly status: TransactionStatus;
  readonly narration: string;
  readonly merchantBearsCost: boolean;
  readonly bankAccount: BankAccount;
  readonly customer: Customer;
};

export type VirtualBankAccount = {
  readonly accountName: string;
  readonly accountNumber: string;
  readonly accountStatus: string;
  readonly accountReference: string;
  readonly uniqueId: string;
  readonly bankName: string;
  readonly bankCode: string;
  readonly currency: Currency;
  readonly createdAt: string;
  readonly customer: Customer;
};

export type Transaction = {
  readonly reference: string;
  readonly status: string;
  readonly amount: string;
  readonly fee: string;
  readonly currency: Currency;
  readonly description: string;
  readonly payerBankAccount: BankAccount;
};

export type GetVirtualBankAccountTransactionData = {
  readonly totalAmountReceived: number;
  readonly accountNumber: string;
  readonly currency: Currency;
  readonly transactions: Transaction[];
  readonly pagination: {
    readonly page: number;
    readonly total: number;
    readonly pageCount: number;
    readonly totalPages: number;
  };
};

export type MobileMoneyCharge = {
  readonly amount: number;
  readonly amountExpected: number;
  readonly currency: Currency;
  readonly fee: number;
  readonly vat: number;
  readonly authModel: AuthModel;
  readonly transactionReference: string;
  readonly paymentReference: string;
  readonly status: TransactionStatus;
  readonly narration: string;
  readonly message: string;
  readonly mobileMoney: {
    readonly number: string;
  };
  readonly customer: Customer;
};

export type InitiateChargeData = {
  readonly reference: string;
  readonly checkoutUrl: string;
};

export type BankCharge = {
  readonly currency: Currency;
  readonly amount: number;
  readonly fee: number;
  readonly vat: number;
  readonly transactionReference: string;
  readonly paymentReference: string;
  readonly status: TransactionStatus;
  readonly merchantBearsCost: boolean;
  readonly customer: Customer;
  readonly narration: string;
  readonly authorization: {
    redirectUrl: string;
  };
  readonly bankAccount: {
    readonly bankName: string;
  };
  readonly message: string;
};

export type UnifiedCharge = {
  readonly reference: string;
  readonly status: TransactionStatus;
  readonly amount: number;
  readonly amountPaid: number;
  readonly fee: number;
  readonly currency: Currency;
  readonly description: string;
  readonly createdAt: string;
  readonly metadata?: Metadata;
  readonly payerBankAccount?: {
    readonly accountNumber: string;
    readonly accountName: string;
    readonly bankName: string;
  };
  readonly paymentAttempts?: {
    readonly reference: string;
    readonly status: TransactionStatus;
    readonly channel: PaymentChannel;
    readonly message: string;
  }[];
  readonly card?: CardInfo;
  readonly mobileMoney?: {
    readonly mobileNumber: string;
    readonly operator: MobileMoneyOperator;
  };
};

export type Payin = {
  readonly pointer: string;
  readonly reference: string;
  readonly status: TransactionStatus;
  readonly amount: number;
  readonly amountPaid: number;
  readonly fee: number | null;
  readonly currency: Currency;
  readonly description: string;
  readonly paymentMethod: PaymentChannel;
  readonly message: string;
  readonly dateCreated: string;
  readonly dateCompleted: string | null;
  readonly paymentSources: {
    readonly amountPaid: string;
    readonly narration: string;
    readonly paymentSourceType: PaymentChannel;
    readonly message: string;
    readonly status: TransactionStatus;
  };
};

export type GetPayinsData = {
  readonly hasMore: boolean;
  readonly payins: Payin[];
};

export type Refund = {
  readonly refundReference: string;
  readonly refundDate: string;
  readonly status: TransactionStatus;
  readonly paymentReference: string;
  readonly reason: string;
  readonly amountReturned: number;
  readonly channel: PaymentChannel;
  readonly currency: Currency;
};

export type RefundDetail = {
  readonly amount: number;
  readonly status: TransactionStatus;
  readonly currency: Currency;
  readonly destination: string;
  readonly reference: string;
  readonly reason: string;
  readonly paymentReference: string;
  readonly transactionAmount: string;
  readonly paymentMethod: PaymentChannel;
  readonly createdAt: string;
  readonly completedAt: string | null;
};

export type GetRefundHistoryData = {
  readonly hasMore: boolean;
  readonly refunds: Refund[];
};

export type Payout = {
  readonly amount: number;
  readonly fee: number;
  readonly currency: Currency;
  readonly status: TransactionStatus;
  readonly reference: string;
  readonly narration: string;
  readonly customer: Customer;
  readonly traceId?: string;
  readonly message?: string;
};

export type BulkPayout = {
  readonly status: TransactionStatus;
  readonly totalChargeableAmount: number;
  readonly merchantBearsCost: boolean;
  readonly currency: Currency;
  readonly reference: string;
  readonly description: string;
  readonly createdAt: string;
};

export type BatchPayout = {
  readonly reference: string;
  readonly amount: number;
  readonly currency: Currency;
  readonly narration: string;
  readonly status: TransactionStatus;
  readonly batchReference: string;
  readonly type: string;
  readonly customer: Customer;
  readonly bankAccount: {
    readonly bankCode: string;
    readonly accountNumber: string;
  };
};

export type GetPayoutsInBulkPayoutToBankAccountData = {
  readonly data: BatchPayout[];
  readonly paging: PaginationInfo;
};

export type BulkPayoutTransaction = {
  readonly amount: number;
  readonly currency: Currency;
  readonly reference: string;
  readonly status: TransactionStatus;
  readonly description: string;
  readonly failedTransactions: number;
  readonly successfulTransactions: number;
  readonly pendingTransactions: number;
  readonly processingTransactions: number;
};

export type UnifiedPayout = {
  readonly pointer: string;
  readonly reference: string;
  readonly status: TransactionStatus;
  readonly amount: number;
  readonly fee: number;
  readonly currency: Currency;
  readonly narration: string;
  readonly traceId: string;
  readonly message: string;
  readonly paymentDestination: string;
  readonly customerName: string;
  readonly customerEmail: string;
  readonly dateCreated: string;
  readonly dateCompleted: string;
};

export type GetPayoutsData = {
  hasMore: boolean;
  payouts: UnifiedPayout[];
};

export type Balance = Record<"ghs" | "kes" | "ngn" | "usd", {
  readonly pendingBalance: number;
  readonly availableBalance: number;
}>;

export type BalanceHistory = {
  readonly pointer: string;
  readonly amount: number;
  readonly currency: Currency;
  readonly balanceBefore: string;
  readonly balanceAfter: string;
  readonly date: string;
  readonly description: string;
  readonly direction: string;
  readonly source: string;
  readonly sourceReference: string;
};

export type GetBalanceHistoryData = {
  readonly hasMore: boolean;
  readonly history: BalanceHistory[];
};

export type InitiateCurrencyConversionData = {
  readonly fromCurrency: Currency;
  readonly toCurrency: Currency;
  readonly fromAmount: number;
  readonly toAmount: number;
  readonly rate: number;
  readonly reference: string;
  readonly expiryInSeconds: string;
  readonly expiryDate: string;
};

export type CompleteCurrencyConversionData = {
  readonly convertedAmount: number;
  readonly sourceAmount: number;
  readonly destinationCurrency: Currency;
  readonly exchangeRate: number;
  readonly reference: string;
  readonly sourceCurrency: Currency;
  readonly status: TransactionStatus;
};

export type ExchangeRate = {
  sourceCurrency: Currency;
  destinationCurrency: Currency;
  exchangeRate: number;
  sourceAmount: number;
  convertedAmount: number;
  status: TransactionStatus;
  reference: string;
  channel: string;
  customerName: string;
  customerEmail: string;
  narration: string;
  transactionDate: string;
  account?: {
    name: string;
    email: string;
  };
};

export type GetRateConversionsData = {
  history: ExchangeRate[];
};

export type CreateCardData = {
  readonly reference: string;
  readonly currency: Currency;
  readonly type: string;
  readonly status: TransactionStatus;
  readonly holderName: string;
};

export type GetCardData = {
  readonly reference: string;
  readonly type: string;
  readonly firstSix: string;
  readonly lastFour: string;
  readonly brand: CardType;
  readonly pan: string;
  readonly cvv: string;
  readonly expiryMonth: string;
  readonly expiryYear: string;
  readonly currency: Currency;
  readonly balance: number;
  readonly status: CardStatus;
  readonly billing: {
    readonly address1: string;
    readonly city: string;
    readonly state: string;
    readonly country: Country;
    readonly zipCode: string;
  };
  readonly cardHolder: {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly address: {
      readonly city: string;
      readonly state: string;
      readonly street: string;
      readonly country: Country;
      readonly zipCode: string;
    };
  };
  readonly dateCreated: string;
  readonly category: string;
};

export type CardDetail = {
  readonly reference: string;
  readonly type: string;
  readonly firstSix: string;
  readonly lastFour: string;
  readonly brand: CardType;
  readonly pan: string;
  readonly cvv: string;
  readonly expiryMonth: string;
  readonly expiryYear: string;
  readonly currency: Currency;
  readonly balance: number;
  readonly status: CardStatus;
  readonly holderName: string;
  readonly merchantName: string;
  readonly label: string;
  readonly dateCreated: string;
};

export type GetCardsData = {
  readonly data: CardDetail[];
};

export type CardFund = {
  readonly cardReference: string;
  readonly transactionReference: string;
  readonly amount: number;
  readonly fee: number;
  readonly currency: Currency;
  readonly type: "card_funding";
  readonly status: TransactionStatus;
};

export type CardWithdrawal = {
  readonly cardReference: string;
  readonly transactionReference: string;
  readonly amount: number;
  readonly fee: number;
  readonly currency: Currency;
  readonly type: "card_withdrawal";
  readonly status: TransactionStatus;
};

export type CardHolder = {
  readonly reference: string;
  readonly validationStatus: "pending" | "failed" | "success";
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly dateOfBirth: string;
  readonly address: {
    readonly street: string;
    readonly city: string;
    readonly state: string;
    readonly country: Country;
    readonly zipCode: string;
  };
  readonly countryIdentity: {
    readonly type: string;
    readonly number: string;
    readonly country: Country;
  };
  readonly identity: {
    readonly type: string;
    readonly number: string;
    readonly country: Country;
    readonly image: string;
  };
};

export type CardTransaction = {
  readonly reference: string;
  readonly amount: number;
  readonly fee: number;
  readonly currency: Currency;
  readonly crossCurrency: boolean;
  readonly cardHolderName: string;
  readonly description: string;
  readonly balanceAfter: number;
  readonly type: number;
  readonly status: TransactionStatus;
  readonly date: string;
};

export type GetCardTransactionsData = {
  data: CardTransaction[];
};

export type Bank = {
  readonly name: string;
  readonly slug: string;
  readonly code: string;
  readonly nibssBankCode: string;
  readonly country: Country;
};

export type MMO = {
  readonly name: string;
  readonly slug: string;
  readonly country: Country;
  readonly code: string;
  readonly min: number;
  readonly max: number;
};
