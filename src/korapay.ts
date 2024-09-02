import { HTTPMethod, type Country, type Currency } from "./enums.ts";
import RestClient from "./restClient.ts";
import type {
  AuthorizeCardChargePayload,
  ChargeViaBankTransferPayload,
  ChargeViaCardPayload,
  ChargeViaMobileMoneyPayload,
  CreateVirtualBankAccountPayload,
  InitiateChargePayload,
  PayoutToBankAccountPayload,
  PayoutToMobileMoneyPayload,
} from "./types/global.ts";

export default class KorapayClient {
  client: RestClient;
  constructor(publicKey?: string, secretKey?: string, client?: RestClient) {
    if (client) {
      this.client = client;
    } else {
      this.client = new RestClient(publicKey, secretKey);
    }
  }

  async chargeViaCard(payload: ChargeViaCardPayload) {
    const chargeData = await this.client.encryptData(payload);
    return await this.client.call(
      "/merchant/api/v1/charges/card",
      HTTPMethod.POST,
      { chargeData },
    );
  }

  authorizeCardCharge(payload: AuthorizeCardChargePayload) {
    return this.client.call(
      "/merchant/api/v1/charges/card/authorize",
      HTTPMethod.POST,
      payload,
    );
  }

  resendCardOtp(transactionReference: string) {
    return this.client.call(
      "/merchant/api/v1/charges/card/resend-otp",
      HTTPMethod.POST,
      { transactionReference },
    );
  }

  chargeViaBankTransfer(payload: ChargeViaBankTransferPayload) {
    return this.client.call(
      "/merchant/api/v1/charges/bank-transfer",
      HTTPMethod.POST,
      payload,
    );
  }

  createVirtualBankAccount(payload: CreateVirtualBankAccountPayload) {
    return this.client.call(
      "/merchant/api/v1/virtual-bank-account",
      HTTPMethod.POST,
      payload,
    );
  }

  getVirtualBankAccount(accountReference: string) {
    return this.client.call(
      `/merchant/api/v1/virtual-bank-account/${accountReference}`,
      HTTPMethod.GET,
    );
  }

  getVirtualBankAccountTransactions(accountNumber: string) {
    return this.client.call(
      `/merchant/api/v1/virtual-bank-account/transactions?account_number=${accountNumber}`,
      HTTPMethod.GET,
    );
  }

  creditSandboxVirtualBankAccount(
    accountNumber: string,
    amount: number,
    currency: Currency,
  ) {
    return this.client.call(
      "/merchant/api/v1/virtual-bank-account/sandbox/credit",
      HTTPMethod.POST,
      { accountNumber, amount, currency },
    );
  }

  chargeViaMobileMoney(payload: ChargeViaMobileMoneyPayload) {
    return this.client.call(
      "/merchant/api/v1/charges/mobile-money",
      HTTPMethod.POST,
      payload,
    );
  }

  authorizeMobileMoneyCharge(reference: string, token: string) {
    return this.client.call(
      "/merchant/api/v1/charges/mobile-money/authorize",
      HTTPMethod.POST,
      { reference, token },
    );
  }

  resendMobileMoneyOtp(transactionReference: string) {
    return this.client.call(
      "/merchant/api/v1/charges/mobile-money/resend-otp",
      HTTPMethod.POST,
      { transactionReference },
    );
  }

  resendSkt(transactionReference: string) {
    return this.client.call(
      "/merchant/api/v1/charges/mobile-money/resend-stk",
      HTTPMethod.POST,
      { transactionReference },
    );
  }

  authorizeSkt(reference: string, pin: string) {
    return this.client.call(
      "/merchant/api/v1/charges/mobile-money/sandbox/authorize-stk",
      HTTPMethod.POST,
      { reference, pin },
    );
  }

  initiateCharge(payload: InitiateChargePayload) {
    return this.client.call(
      "/merchant/api/v1/charges/initialize",
      HTTPMethod.POST,
      payload,
    );
  }

  getCharge(reference: string) {
    return this.client.call(
      `/merchant/api/v1/charges/${reference}`,
      HTTPMethod.GET,
    );
  }

  resolveBankAccount(bankCode: string, accountNumber: string) {
    return this.client.call(
      "/merchant/api/v1/misc/banks/resolve",
      HTTPMethod.POST,
      { bank: bankCode, account: accountNumber },
    );
  }

  getBalances() {
    return this.client.call("/merchant/api/v1/balances", HTTPMethod.GET);
  }

  getBanks(country: Country) {
    return this.client.call(
      `/merchant/api/v1/misc/banks?countryCode=${country}`,
      HTTPMethod.GET,
      true
    );
  }

  getMmo(country: Country) {
    return this.client.call(
      `/merchant/api/v1/misc/mobile-money?countryCode=${country}`,
      HTTPMethod.GET,
    );
  }

  payoutToBankAccount(payload: PayoutToBankAccountPayload) {
    return this.client.call(
      "/merchant/api/v1/transactions/disburse",
      HTTPMethod.POST,
      payload,
    );
  }

  payoutToMobileMoney(payload: PayoutToMobileMoneyPayload) {
    return this.client.call(
      "/merchant/api/v1/transactions/disburse",
      HTTPMethod.POST,
      payload,
    );
  }

  bulkPayoutToBankAccount(payload: PayoutToBankAccountPayload) {
    return this.client.call(
      "/api/v1/transactions/disburse/bulk",
      HTTPMethod.POST,
      payload,
    );
  }

  getPayouts(bulkReference: string) {
    return this.client.call(
      `/api/v1/transactions/bulk/${bulkReference}/payout`,
      HTTPMethod.GET,
    );
  }

  getBulkTransaction(bulkReference: string) {
    return this.client.call(
      `/api/v1/transactions/bulk/${bulkReference}`,
      HTTPMethod.GET,
    );
  }

  getPayoutTransaction(transactionReference: string) {
    return this.client.call(
      `/merchant/api/v1/transactions/${transactionReference}`,
      HTTPMethod.GET,
    );
  }
}
