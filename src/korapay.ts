import { type Country, type Currency, HTTPMethod } from "./enums.ts";
import RestClient from "./restClient.ts";
import type {
  AuthorizeCardChargePayload,
  BulkPayoutToBankAccountPayload,
  ChargeViaBankTransferPayload,
  ChargeViaCardPayload,
  ChargeViaMobileMoneyPayload,
  CreateVirtualBankAccountPayload,
  InitiateChargePayload,
  KorapayResponse,
  PayoutToBankAccountPayload,
  PayoutToMobileMoneyPayload,
} from "./types/global.ts";

/**
 * A class for interfacing with Korapay API in your JS/TS project.
 */
export default class KorapayClient {
  private client: RestClient;

  /**
   * @constructor Instantiate a KorapayClient.
   *
   * @remarks When no params are passed in, the client will attempt to load the
   * publicKey, secretKey, and encryptionKey via their respective default
   * environmental variable name.  'KORAPAY_PUBLIC_KEY','KORAPAY_SECRET_KEY'
   * and 'KORAPAY_ENCRYPTION_KEY', If a client is passed in, the publicKey,
   * and secretKey are ignored
   *
   * @param publicKey - Your korapay integration public key. Omit if
   * 'KORAPAY_PUBLIC_KEY' is set in your environmental variables.
   * @param secretKey - Your korapay integration secret key. Omit if
   * 'KORAPAY_SECRET_KEY' is set in your environmental variables.
   * @param encryptionKey - Your korapay integration key. Omit if
   * 'KORAPAY_ENCRYPTION_KEY' is set in your environmental variables.
   * @param client A custom {@link RestClient} to use for making request to korapay.
   */
  constructor(
    publicKey?: string,
    secretKey?: string,
    encryptionKey?: string,
    client?: RestClient,
  ) {
    if (client) {
      this.client = client;
    } else {
      this.client = new RestClient(publicKey, secretKey, encryptionKey);
    }
  }

  /**
   * Accept debit card payments.
   *
   * @remarks No validation is done on the payload in the client, it is sent
   * as it is.
   *
   * @param payload - {@link ChargeViaCardPayload} is the data that is sent to korapay.
   *
   * @returns A promise containing a {@link KorapayResponse}
   */
  async chargeViaCard(payload: ChargeViaCardPayload): Promise<KorapayResponse> {
    const chargeData = await this.client.encryptData(payload);
    return await this.client.call(
      "/merchant/api/v1/charges/card",
      HTTPMethod.POST,
      { chargeData },
    );
  }

  /**
   * Authorize a pending charge on a debit card.
   *
   * @param payload {@link AuthorizeCardChargePayload} is the data sent to korapay
   *  to authorize a charge
   * @returns A promise containing a {@link KorapayResponse}
   */
  authorizeCardCharge(
    payload: AuthorizeCardChargePayload,
  ): Promise<KorapayResponse> {
    return this.client.call(
      "/merchant/api/v1/charges/card/authorize",
      HTTPMethod.POST,
      payload,
    );
  }

  /**
   * Resend one time password/pin for pending transaction.
   *
   * @param transactionReference The reference to the pending charge
   * returned as a response by korapay when the charge was initiated.
   * @returns A promise containing a {@link KorapayResponse}
   */
  resendCardOtp(transactionReference: string): Promise<KorapayResponse> {
    return this.client.call(
      "/merchant/api/v1/charges/card/resend-otp",
      HTTPMethod.POST,
      { transactionReference },
    );
  }

  /**
   * Accept payments via bank transfers.
   *
   * @param payload {@link ChargeViaBankTransferPayload} is the data sent to korapay
   * to initiate a charge via bank transfer
   * @returns A promise containing a {@link KorapayResponse}
   */
  chargeViaBankTransfer(
    payload: ChargeViaBankTransferPayload,
  ): Promise<KorapayResponse> {
    return this.client.call(
      "/merchant/api/v1/charges/bank-transfer",
      HTTPMethod.POST,
      payload,
    );
  }

  /**
   * Create a virtual bank account.
   *
   * @param payload {@link CreateVirtualBankAccountPayload} is the data sent to korapay to
   * create a virtual bank account.
   * @returns A promise containing a {@link KorapayResponse}
   */
  createVirtualBankAccount(
    payload: CreateVirtualBankAccountPayload,
  ): Promise<KorapayResponse> {
    return this.client.call(
      "/merchant/api/v1/virtual-bank-account",
      HTTPMethod.POST,
      payload,
    );
  }

  /**
   * Retrieve a virtual bank account.
   *
   * @param accountReference Your unique reference for the virtual bank account.
   * @returns A promise containing a {@link KorapayResponse}
   */
  getVirtualBankAccount(accountReference: string): Promise<KorapayResponse> {
    return this.client.call(
      `/merchant/api/v1/virtual-bank-account/${accountReference}`,
      HTTPMethod.GET,
    );
  }

  /**
   * Retrieve transactions associated with a virtual bank account.
   *
   * @param accountNumber The account number of the virtual account.
   * @returns A promise containing a {@link KorapayResponse}
   */
  getVirtualBankAccountTransactions(
    accountNumber: string,
  ): Promise<KorapayResponse> {
    return this.client.call(
      `/merchant/api/v1/virtual-bank-account/transactions?account_number=${accountNumber}`,
      HTTPMethod.GET,
    );
  }

  /**
   * Create a virtual bank account for testing/development.
   *
   * @param accountNumber This is the account number of the Fixed Virtual Bank Account.
   * @param amount This is the amount you want to credit to the account. The minimum
   * amount is NGN 100, and the maximum amount is NGN 10,000,000.
   * @param currency An enum representing the currency for the account. Only `Currency.NGN` is accepted
   * for now.
   * @returns A promise containing a {@link KorapayResponse}
   */
  creditSandboxVirtualBankAccount(
    accountNumber: string,
    amount: number,
    currency: Currency,
  ): Promise<KorapayResponse> {
    return this.client.call(
      "/merchant/api/v1/virtual-bank-account/sandbox/credit",
      HTTPMethod.POST,
      { accountNumber, amount, currency },
    );
  }

  /**
   * Accept payments via mobile money.
   *
   * @param payload {@link ChargeViaMobileMoneyPayload} is the data sent to korapay to
   * initiate a charge via mobile money
   * @returns A promise containing a {@link KorapayResponse}
   */
  chargeViaMobileMoney(
    payload: ChargeViaMobileMoneyPayload,
  ): Promise<KorapayResponse> {
    return this.client.call(
      "/merchant/api/v1/charges/mobile-money",
      HTTPMethod.POST,
      payload,
    );
  }

  /**
   * Authorize a payment via mobile money
   *
   * @param reference The reference to the transaction.
   * @param token the otp or token from the customer.
   * @returns A promise containing a {@link KorapayResponse}
   */
  authorizeMobileMoneyCharge(
    reference: string,
    token: string,
  ): Promise<KorapayResponse> {
    return this.client.call(
      "/merchant/api/v1/charges/mobile-money/authorize",
      HTTPMethod.POST,
      { reference, token },
    );
  }

  /**
   * Resend one time password/pin for a pending mobile money transaction.
   *
   * @param transactionReference The reference of the pending transaction.
   * @returns A promise containing a {@link KorapayResponse}
   */
  resendMobileMoneyOtp(transactionReference: string): Promise<KorapayResponse> {
    return this.client.call(
      "/merchant/api/v1/charges/mobile-money/resend-otp",
      HTTPMethod.POST,
      { transactionReference },
    );
  }

  /**
   * Resend SKT prompt.
   *
   * @param transactionReference The reference of the pending transaction.
   * @returns A promise containing a {@link KorapayResponse}
   */
  resendSkt(transactionReference: string): Promise<KorapayResponse> {
    return this.client.call(
      "/merchant/api/v1/charges/mobile-money/resend-stk",
      HTTPMethod.POST,
      { transactionReference },
    );
  }

  /**
   * Authorize SKT prompts in testing/development
   *
   * @param reference The reference of the pending transaction.
   * @param pin The simulated customer's pin
   * @returns A promise containing a {@link KorapayResponse}
   */
  authorizeSkt(reference: string, pin: string): Promise<KorapayResponse> {
    return this.client.call(
      "/merchant/api/v1/charges/mobile-money/sandbox/authorize-stk",
      HTTPMethod.POST,
      { reference, pin },
    );
  }

  /**
   * Initiate a charge on your customer supporting multiple payment channels
   *
   * @param payload {@link InitiateChargePayload} is the data sent to korapay to
   * initiate a charge.
   * @returns A promise containing a {@link KorapayResponse}
   */
  initiateCharge(payload: InitiateChargePayload): Promise<KorapayResponse> {
    return this.client.call(
      "/merchant/api/v1/charges/initialize",
      HTTPMethod.POST,
      payload,
    );
  }

  /**
   * Retrieve a charge.
   *
   * @param reference The reference of the charge.
   * @returns A promise containing a {@link KorapayResponse}
   */
  getCharge(reference: string): Promise<KorapayResponse> {
    return this.client.call(
      `/merchant/api/v1/charges/${reference}`,
      HTTPMethod.GET,
    );
  }

  /**
   * Resolves a bank account.
   *
   * @param bankCode The code for the bank the account number belongs to.
   * @param accountNumber The account number to be resolved.
   * @returns A promise containing a {@link KorapayResponse}
   */
  resolveBankAccount(
    bankCode: string,
    accountNumber: string,
  ): Promise<KorapayResponse> {
    return this.client.call(
      "/merchant/api/v1/misc/banks/resolve",
      HTTPMethod.POST,
      { bank: bankCode, account: accountNumber },
    );
  }
  /**
   * Retrieve all your pending and available balances
   *
   * @returns A promise containing a {@link KorapayResponse}
   */
  getBalances(): Promise<KorapayResponse> {
    return this.client.call("/merchant/api/v1/balances", HTTPMethod.GET);
  }

  /**
   * Retrieve a list of all banks supported by Korapay and their properties.
   *
   * @param country An enum representing the country to retrieve the banks from.
   * E.g., `Country.NIGERIA`.
   * @returns A promise containing a {@link KorapayResponse}
   */
  getBanks(country: Country): Promise<KorapayResponse> {
    return this.client.call(
      `/merchant/api/v1/misc/banks?countryCode=${country}`,
      HTTPMethod.GET,
      undefined,
      true,
    );
  }

  /**
   * Retrieve a list of all mobile money operators supported by Korapay and their properties.
   *
   * @param country An enum representing the country to retrieve the MMOs from. E.g., `Country.GHANA`.
   * @returns A promise containing a {@link KorapayResponse}
   */
  getMmo(country: Country): Promise<KorapayResponse> {
    return this.client.call(
      `/merchant/api/v1/misc/mobile-money?countryCode=${country}`,
      HTTPMethod.GET,
    );
  }

  /**
   * Initiate a single disbursement to a bank account.
   *
   * @param payload {@link PayoutToBankAccountPayload} is the data sent to korapay to
   * initiate a payout to bank account
   * @returns A promise containing a {@link KorapayResponse}
   */
  payoutToBankAccount(
    payload: PayoutToBankAccountPayload,
  ): Promise<KorapayResponse> {
    return this.client.call(
      "/merchant/api/v1/transactions/disburse",
      HTTPMethod.POST,
      payload,
    );
  }
  /**
   * Initiate a single disbursement to a mobile money account.
   *
   * @param payload {@link PayoutToMobileMoneyPayload} is the data sent to korapay
   * to initiate a payout to mobile money
   * @returns A promise containing a {@link KorapayResponse}
   */
  payoutToMobileMoney(
    payload: PayoutToMobileMoneyPayload,
  ): Promise<KorapayResponse> {
    return this.client.call(
      "/merchant/api/v1/transactions/disburse",
      HTTPMethod.POST,
      payload,
    );
  }
  /**
   * Initiate a bulk payout to bank accounts.
   *
   * @param payload {@link BulkPayoutToBankAccountPayload} is the data sent to korapay
   * to initiate a bulk payout to bank accounts
   * @returns A promise containing a {@link KorapayResponse}
   */
  bulkPayoutToBankAccount(
    payload: BulkPayoutToBankAccountPayload,
  ): Promise<KorapayResponse> {
    return this.client.call(
      "/api/v1/transactions/disburse/bulk",
      HTTPMethod.POST,
      payload,
    );
  }

  /**
   * Retrieve a bulk payout
   *
   * @param bulkReference - The reference of the bulk payout to retrieve.
   * @returns A promise containing a {@link KorapayResponse}
   */
  getPayouts(bulkReference: string): Promise<KorapayResponse> {
    return this.client.call(
      `/api/v1/transactions/bulk/${bulkReference}/payout`,
      HTTPMethod.GET,
    );
  }
  /**
   * Retrieve the transactions in a bulk payout.
   *
   * @param bulkReference - The reference of the bulk payout whose transactions you to retrieve.
   * @returns A promise containing a {@link KorapayResponse}
   */
  getBulkTransaction(bulkReference: string): Promise<KorapayResponse> {
    return this.client.call(
      `/api/v1/transactions/bulk/${bulkReference}`,
      HTTPMethod.GET,
    );
  }
  /**
   * Retrieve the status and details of a disbursement through the reference.
   *
   * @param transactionReference - The transaction reference of the payout.
   * @returns
   */
  getPayoutTransaction(transactionReference: string): Promise<KorapayResponse> {
    return this.client.call(
      `/merchant/api/v1/transactions/${transactionReference}`,
      HTTPMethod.GET,
    );
  }
}
