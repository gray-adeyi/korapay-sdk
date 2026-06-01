import { assertEquals } from "@std/assert";
import { Country, Currency, HTTPMethod } from "../src/enums.ts";
import KorapayClient from "../src/korapay.ts";
import type RestClient from "../src/restClient.ts";
import type { KorapayResponse } from "../src/types/global.ts";
import type { Balance, Bank, MMO } from "../src/types/responseModels.ts";

type CallRecord = {
  endpoint: string;
  method: HTTPMethod;
  data?: unknown;
  noAuth: boolean;
};

function createMockClient(responseData: unknown = { ok: true }) {
  const calls: CallRecord[] = [];

  return {
    calls,
    async encryptData(data: unknown) {
      calls.push({
        endpoint: "encryptData",
        method: HTTPMethod.POST,
        data,
        noAuth: false,
      });
      return "encrypted-payload";
    },
    async call(
      endpoint: string,
      method: HTTPMethod,
      data?: unknown,
      noAuth = false,
    ): Promise<KorapayResponse<unknown>> {
      calls.push({ endpoint, method, data, noAuth });
      return {
        statusCode: 200,
        status: true,
        message: "success",
        data: responseData,
      };
    },
  };
}

function createClient(mock: ReturnType<typeof createMockClient>) {
  return new KorapayClient(
    "pk_live_dummy",
    "sk_live_dummy",
    "01234567890123456789012345678901",
    mock as unknown as RestClient,
    true,
  );
}

Deno.test("KorapayClient delegates balances requests to the secure client", async () => {
  const balanceData = {
    ngn: { availableBalance: 100, pendingBalance: 0 },
    kes: { availableBalance: 0, pendingBalance: 0 },
    ghs: { availableBalance: 0, pendingBalance: 0 },
    usd: { availableBalance: 0, pendingBalance: 0 },
  } satisfies Balance;
  const mock = createMockClient(balanceData);
  const client = createClient(mock);

  const response = await client.getBalances();

  assertEquals(mock.calls[0], {
    endpoint: "/merchant/api/v1/balances",
    method: HTTPMethod.GET,
    data: undefined,
    noAuth: false,
  });
  assertEquals(response.data, balanceData);
});

Deno.test("KorapayClient uses the public auth path for bank lookup endpoints", async () => {
  const banks = [
    {
      name: "Guaranty Trust Bank",
      slug: "gtbank",
      code: "058",
      nibssBankCode: "058",
      country: Country.NIGERIA,
    },
  ] satisfies Bank[];
  const mock = createMockClient(banks);
  const client = createClient(mock);

  const response = await client.getBanks(Country.NIGERIA);

  assertEquals(mock.calls[0], {
    endpoint: "/merchant/api/v1/misc/banks?countryCode=NG",
    method: HTTPMethod.GET,
    data: undefined,
    noAuth: true,
  });
  assertEquals(response.data, banks);
});

Deno.test("KorapayClient uses the public auth path for mobile money lookup endpoints", async () => {
  const mmos = [
    {
      name: "MTN Ghana",
      slug: "mtn-gh",
      country: Country.GHANA,
      code: "mtn-gh",
      min: 1,
      max: 100000,
    },
  ] satisfies MMO[];
  const mock = createMockClient(mmos);
  const client = createClient(mock);

  const response = await client.getMmo(Country.GHANA);

  assertEquals(mock.calls[0], {
    endpoint: "/merchant/api/v1/misc/mobile-money?countryCode=GH",
    method: HTTPMethod.GET,
    data: undefined,
    noAuth: true,
  });
  assertEquals(response.data, mmos);
});

Deno.test("KorapayClient encrypts card payloads before sending them", async () => {
  const mock = createMockClient({ reference: "ref_001" });
  const client = createClient(mock);

  await client.chargeViaCard({
    reference: "ref_001",
    customer: {
      name: "Ada Lovelace",
      email: "ada@example.com",
    },
    card: {
      number: "5399831111111111",
      cvv: "100",
      expiryMonth: "10",
      expiryYear: "31",
    },
    amount: 5000,
    currency: Currency.NGN,
  });

  assertEquals(mock.calls[0], {
    endpoint: "encryptData",
    method: HTTPMethod.POST,
    data: {
      reference: "ref_001",
      customer: {
        name: "Ada Lovelace",
        email: "ada@example.com",
      },
      card: {
        number: "5399831111111111",
        cvv: "100",
        expiryMonth: "10",
        expiryYear: "31",
      },
      amount: 5000,
      currency: Currency.NGN,
    },
    noAuth: false,
  });
  assertEquals(mock.calls[1], {
    endpoint: "/merchant/api/v1/charges/card",
    method: HTTPMethod.POST,
    data: {
      chargeData: "encrypted-payload",
    },
    noAuth: false,
  });
});
