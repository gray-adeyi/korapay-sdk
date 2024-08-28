import RestClient, { HTTPMethod } from "./restClient.ts";

export default class KoraPayClient {
  client: RestClient;
  constructor(publicKey?: string, secretKey?: string, client?: RestClient) {
    if (client) {
      this.client = client;
    } else {
      this.client = new RestClient(publicKey, secretKey);
    }
  }

  chargeViaCard(){
    // 
  }

  authorizeCardCharge(){
    // 
  }

  resendCardOtp(){
    // 
  }

  chargeViaBankTransfer(){
    // 
  }

  createVirtualBankAccount(){
    // 
  }

  getVirtualBankAccount(){
    // 
  }

  getVirtualBankAccountTransactions(){}

  creditSandboxVirtualBankAccount(){}

  chargeViaMobileMoney(){}

  authorizeMobileMoneyCharge(){}

  resendMobileMoneyOtp(){}

  resendSkt(){}

  authorizeSkt(){}

  initiateCharge(){}

  getCharge(){}

  resolveBankAccount(){}

  getBalances() {
    return this.client.call("/merchant/api/v1/balances", HTTPMethod.GET);
  }

  getBanks() {
    //
  }

  getMmo() {
    //
  }

  payoutToBankAccount(){}

  payoutToMobileMoney(){}

  bulkPayoutToBankAccount(){}

  getPayouts(bulkReference: string){
    return this.client.call(`/api/v1/transactions/bulk/${bulkReference}/payout`, HTTPMethod.GET)
  }

  getBulkTransaction(bulkReference: string){
    return this.client.call(`/api/v1/transactions/bulk/${bulkReference}`, HTTPMethod.GET)
  }

  getPayoutTransaction(transactionReference: string){
    return this.client.call(`/merchant/api/v1/transactions/${transactionReference}`, HTTPMethod.GET)
  }
}
