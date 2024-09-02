import type { Currency, MobileMoneyOperator, PaymentChannel } from "../enums.ts";

type Authorization = {
  readonly pin?: string;
  readonly otp?: string;
  readonly avs?: string;
};

export type Card = {
  readonly number: string;
  readonly cvv: string;
  readonly expiryMonth: string;
  readonly expiryYear: string;
  readonly name?: string;
  readonly pin?: string;
};

/**
 * Represents the data sent to korapay to charge via card.
 */
export type ChargeViaCardPayload = {
  /** A unique reference for the payment   */
  readonly reference: string;
  readonly customer: {
    readonly name: string;
    readonly email: string;
  };
  readonly card: Card;
  readonly amount: number;
  readonly currency: Currency;
  readonly redirectUrl?: string;
  // deno-lint-ignore no-explicit-any
  readonly metadata?: Record<string, any>;
};

export type AuthorizeCardChargePayload = {
  readonly transactionReference: string;
  readonly authorization: Authorization;
};

export type ChargeViaBankTransferPayload = {
  readonly reference: string;
  readonly customer: {
    readonly name?: string;
    readonly email: string;
  };
  readonly amount: number;
  readonly currency: Currency;
  readonly accountName?: string;
  readonly narration?: string;
  readonly notificationUrl?: string;
  readonly merchantBearsCost?: string;
  // deno-lint-ignore no-explicit-any
  readonly metadata?: Record<string, any>;
};

export type CreateVirtualBankAccountPayload = {
  readonly accountName: string;
  readonly accountReference: string;
  readonly bankCode: string;
  readonly customer: {
    readonly name: string;
    readonly email?: string;
  };
  readonly kyc: {
    readonly bvn: string;
    readonly nin?: string;
  };
  readonly permanent?: boolean;
};

export type ChargeViaMobileMoneyPayload = {
  readonly reference: string;
  readonly customer: {
    name?: string;
    email: string;
  };
  readonly amount: number;
  readonly mobileMoney: {
    readonly number: number;
  };
  readonly currency: Currency;
  readonly notificationUrl?: string;
  readonly redirectUrl?: string;
  readonly merchantBearsCost?: boolean;
  readonly description?: string;
  // deno-lint-ignore no-explicit-any
  readonly metadata?: Record<string, any>;
};

export type InitiateChargePayload = {
  readonly reference: string;
  readonly amount: number;
  readonly currency: Currency;
  readonly narration: string;
  readonly notificationUrl: string;
  readonly customer: {
    readonly name?: string;
    readonly email: string;
  };
  readonly channels?: PaymentChannel[];
  readonly defaultChannel?: PaymentChannel;
  readonly redirectUrl?: string;
};

export type PayoutToBankAccountPayload = {
  readonly reference: string;
  readonly amount: number;
  readonly currency: Currency;
  readonly bankCode: string;
  readonly accountNumber: string;
  readonly customer: {
    readonly name?: string;
    readonly email: string;
  };
  readonly narration: string;
};

export type PayoutToMobileMoneyPayload = {
  readonly reference: string;
  readonly destination: {
    readonly type: "mobile_money";
    readonly amount: number;
    readonly currency: Currency;
    readonly mobileMoney: {
      readonly operator: MobileMoneyOperator;
      readonly mobileNumber: string;
    };
    readonly narration?: string;
    readonly customer: {
      readonly name?: string;
      readonly email: string;
    };
  };
};

export type PayoutOrder = {
  readonly reference: string;
  readonly amount: number;
  readonly bankAccount: {
    readonly bankCode: string;
    readonly accountNumber: string;
  };
  readonly customer: {
    readonly name?: string;
    readonly email: string;
  };
  readonly narration?: string;
  readonly type: "bank_account";
};

export type BulkPayoutToBankAccountPayload = {
  readonly batchReference: string;
  readonly description: string;
  readonly merchantBearsCost: boolean;
  readonly currency: Currency;
  readonly payouts: PayoutOrder[];
};

export type KorapayResponse = {
  statusCode: number;
  status: boolean;
  message: string;
  // deno-lint-ignore no-explicit-any
  data: Record<string, any> | any[] | null;
};
