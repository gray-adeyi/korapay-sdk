import type { Currency, MobileMoneyOperator, PaymentChannel } from "../enums.ts";

type Authorization = {
  readonly pin?: string;
  readonly otp?: string;
  readonly avs?: string;
};

/**
 * A representation of a card
 */
export type Card = {
  /**
   * The debit card number.
   */
  readonly number: string;
  /**
   * The card's verification value.
   */
  readonly cvv: string;
  /**
   * The card's expiry month e.g., 08
   */
  readonly expiryMonth: string;
  /**
   * The card's expiry year e.g., 24
   */
  readonly expiryYear: string;
  /**
   * The card owner's name
   */
  readonly name?: string;
  /**
   * The card's pin
   */
  readonly pin?: string;
};


/**
 * A representation of the data sent to korapay to 
 * initiate a charge via card
 */
export type ChargeViaCardPayload = {
  /**
   * A unique reference for the payment. 
   * The reference must be at least 8 characters long.
   */
  readonly reference: string;
  /**
   * Customer information
   */
  readonly customer: {
    /**
     * The name of your customer.
     */
    readonly name: string;
    /**
     * The email of your customer.
     */
    readonly email: string;
  };
  /**
   * Your customer's card information
   */
  readonly card: Card;
  /**
   * Amount for the charge
   */
  readonly amount: number;
  /**
   * An enum representing the currency for the 
   * charge. E.g., `Currency.NGN`
   */
  readonly currency: Currency;
  /**
   * A URL to which we can redirect your customer 
   * after their payment is complete.
   */
  readonly redirectUrl?: string;
  /**
   * An object with a maximum of 5 fields/keys for storing additional 
   * information. Empty dictionaries are not allowed. Each field name 
   * (i.e., dictionary keys) can have a maximum length of 20 characters. 
   * Allowed characters: A-Z, a-z, 0-9, and -.
   */
  // deno-lint-ignore no-explicit-any
  readonly metadata?: Record<string, any>;
};

export type AuthorizeCardChargePayload = {
  readonly transactionReference: string;
  readonly authorization: Authorization;
};

/**
 * A representation of the data sent to korapay to initiate a
 * charge via bank transfer
 */
export type ChargeViaBankTransferPayload = {
  /**
   * A unique reference for the payment. 
   * The reference must be at least 8 characters long.
   */
  readonly reference: string;
  /**
   * The customer's information
   */
  readonly customer: {
    /**
     * The name of your customer.
     */
    readonly name?: string;
    /**
     * The email of your customer.
     */
    readonly email: string;
  };
  /**
   * The amount for the charge
   */
  readonly amount: number;
  /**
   * An enum representing the currency for the charge. 
   * E.g., `Currency.NGN`. Currently, the
   * only supported currency is `Currency.NGN`
   */
  readonly currency: Currency;
  /**
   * The account name that should be displayed 
   * when the account number is resolved.
   */
  readonly accountName?: string;
  /**
   * Information/narration about the transaction.
   */
  readonly narration?: string;
  /**
   * A URL to which we can send the webhook 
   * notification for the transaction.
   */
  readonly notificationUrl?: string;
  /**
   * This sets who bear the fees of the transaction. If it 
   * is set to `True`,the merchant will bear the fee. If 
   * it is set to `False`, the customer will bear the fee.
   * By default, it is `False`.
   */
  readonly merchantBearsCost?: string;
  /**
   * An object with a maximum of 5 fields/keys for storing 
   * additional information. Empty dictionaries are not allowed. 
   * Each field name (i.e., dictionary keys) can have a maximum 
   * length of 20 characters. Allowed characters: A-Z, a-z, 0-9, and -.
   */
  // deno-lint-ignore no-explicit-any
  readonly metadata?: Record<string, any>;
};

/**
 * A representation of the data sent to korapay to create a 
 * virtual bank account.
 */
export type CreateVirtualBankAccountPayload = {
  /**
   * The name of the Virtual Bank account.
   */
  readonly accountName: string;
  /**
   * Your unique reference to identify a virtual bank account.
   */
  readonly accountReference: string;
  /**
   * This is the bank code of the bank providing the virtual 
   * bank account. E.g., `035` is the code for Wema Bank. Use 
   * `000` to create a virtual bank account in the sandbox environment.
   */
  readonly bankCode: string;
  /**
   * Customer's information
   */
  readonly customer: {
    /**
     * The customer's name.
     */
    readonly name: string;
    /**
     * The customer's email.
     */
    readonly email?: string;
  };
  /**
   * Know your customer information
   */
  readonly kyc: {
    /**
     * The Bank Verification Number (BVN) of the customer.
     */
    readonly bvn: string;
    /**
     * The National Identity Number (NIN) of your customer.
     */
    readonly nin?: string;
  };
  readonly permanent?: boolean;
};

/**
 * A representation of the data sent to korapay to initiate a
 * charge via mobile money
 */
export type ChargeViaMobileMoneyPayload = {
  /**
   * A unique reference for the payment. 
   * The reference must be at least 8 characters long.
   */
  readonly reference: string;
  /**
   * Customer's information
   */
  readonly customer: {
    /**
     * The name of your customer
     */
    name?: string;
    /**
     * The email of your customer
     */
    email: string;
  };
  /**
   * The amount for the charge
   */
  readonly amount: number;
  /**
   * mobile money information
   */
  readonly mobileMoney: {
    /**
     * The mobile number of the customer to be charged e.g., 254700000000.
     */
    readonly number: number;
  };
  /**
   * An enum representing the currency the payment should be made in e.g., `Currency.KES`.
   */
  readonly currency: Currency;
  /**
   * The webhook URL to be called when the transaction is complete.
   */
  readonly notificationUrl?: string;
  /**
   * A URL to which we can redirect your customer after their payment is complete.
   */
  readonly redirectUrl?: string;
  /**
   * This sets who bear the fees of the transaction. If it is set to `True`,
   * the merchant will bear the fee. If it is set to `False`, the customer will bear the fee.
   * By default, it is `False`.
   */
  readonly merchantBearsCost?: boolean;
  /**
   * Information/narration about the transaction.
   */
  readonly description?: string;
  /**
   * An object with a maximum of 5 fields/keys for storing additional information.
   * Empty dictionaries are not allowed. Each field name (i.e., dictionary keys) can have a
   * maximum length of 20 characters. Allowed characters: A-Z, a-z, 0-9, and -.
   */
  // deno-lint-ignore no-explicit-any
  readonly metadata?: Record<string, any>;
};

/**
 * A representation of the data sent to korapay to
 * initiate a charge
 */
export type InitiateChargePayload = {
  /**
   * Your transaction reference. Must be unique for every transaction.
   */
  readonly reference: string;
  /**
   * The amount to charge the customer.
   */
  readonly amount: number;
  /**
   * An enum representing the currency to charge the 
   * customer in. E.g., `Currency.GHS`.
   */
  readonly currency: Currency;
  /**
   * The description of the transaction.
   */
  readonly narration: string;
  /**
   * The webhook URL to be called when the transaction is complete.
   */
  readonly notificationUrl: string;
  /**
   * Customer's information
   */
  readonly customer: {
    /**
     * The customer's name
     */
    readonly name?: string;
    /**
     * The customer's email
     */
    readonly email: string;
  };
  /**
   * An array of `PaymentChannel` enum representing the payment channels 
   * you want to support for accepting the payments. E.g., 
   * `[PaymentChannel.CARD, PaymentChannel.BANK_TRANSFER]`
   */
  readonly channels?: PaymentChannel[];
  /**
   * A enum representing the preferred payment channel when multiple 
   * payment channels are supported. E.g., `PaymentChannel.MOBILE_MONEY`
   */
  readonly defaultChannel?: PaymentChannel;
  /**
   * The URL to redirect your customer when the transaction is complete.
   */
  readonly redirectUrl?: string;
};

/**
 * A representation of the data sent to korapay to initiate a payout
 * to bank account
 */
export type PayoutToBankAccountPayload = {
  /**
   * Unique transaction reference.
   */
  readonly reference: string;
  /**
   * The transaction amount.
   */
  readonly amount: number;
  /**
   * A enum representing the currency to disburse in. E.g., `Currency.NGN`
   */
  readonly currency: Currency;
  /**
   * The Recipient bank code. Bank_codes on testmode with Test keys to simulate
   * a successful transaction are 044, 033, 058 i.e., Access, UBA and GTB respectively,
   * other banks would simulate a failed transaction on testmode with testkeys.
   */
  readonly bankCode: string;
  /**
   * The recipient's account number.
   */
  readonly accountNumber: string;
  /**
   * Customer's information
   */
  readonly customer: {
    /** The customer's name */
    readonly name?: string;
    /** The customer's email */
    readonly email: string;
  };
  /**
   * The transaction's narration or description.
   */
  readonly narration: string;
};

/**
 * A representation of the data sent to korapay to initiate a
 * payout to mobile money.
 */
export type PayoutToMobileMoneyPayload = {
  /**
   * Unique transaction reference.
   */
  readonly reference: string;
  readonly destination: {
    readonly type: "mobile_money";
    /**
     * The transaction amount
     */
    readonly amount: number;
    /**
     * A enum representing the currency to disburse in. E.g., `Currency.NGN`
     */
    readonly currency: Currency;
    readonly mobileMoney: {
      /**
       * An enum or str representing the mobile money operator. E.g.,
       * MobileMoneyOperator.AIRTEL_KENYA`.
       */
      readonly operator: MobileMoneyOperator;
      /**
       * The recipient's mobile money number.
       */
      readonly mobileNumber: string;
    };
    /**
     * The transaction's narration or description.
     */
    readonly narration?: string;
    /**
     * customer information
     */
    readonly customer: {
      /**
       * customer's name
       */
      readonly name?: string;
      /**
       * customer's email
       */
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

/**
 * A model representation of the data sent to korapay to initiate
 * a bulk payout to multiple bank accounts
 */
export type BulkPayoutToBankAccountPayload = {
  /**
   * A reference used to identify the batch.
   */
  readonly batchReference: string;
  /**
   * A narration for the batch.
   */
  readonly description: string;
  /**
   * This sets who bear the fees of the transaction. If it is set to `True`
   * the merchant will bear the fee. If it is set to `False`, the customer will bear the fee.
   * By default, it is `False`.
   */
  readonly merchantBearsCost: boolean;
  /**
   * A enum representing the currency to disburse in. E.g., `Currency.NGN`
   */
  readonly currency: Currency;
  /**
   * An array of `PayoutOrder` which is an objet representing individual recipient
   * information in the bulk payout.
   */
  readonly payouts: PayoutOrder[];
};

/**
 * A representation of the response returned as a result of 
 * making a request to korapay
 */
export type KorapayResponse = {
  /**
   * The HTTP status code of the response
   */
  statusCode: number;
  /**
   * The status fo the response
   */
  status: boolean;
  /**
   * The message of the response
   */
  message: string;
  /**
   * The data returned in the response
   */
  // deno-lint-ignore no-explicit-any
  data: Record<string, any> | any[] | null;
};
