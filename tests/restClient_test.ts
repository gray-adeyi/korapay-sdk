import { assert, assertEquals, assertRejects } from "@std/assert";
import { HTTPMethod } from "../src/enums.ts";
import { KorapayClientError } from "../src/errors.ts";
import RestClient from "../src/restClient.ts";

function createResponse(
  status: number,
  data: Record<string, unknown>,
) {
  return { status, data };
}

Deno.test("RestClient transforms nested camelCase payloads to snake_case", () => {
  const data = {
    firstName: "john",
    accountDetails: {
      bankCode: "058",
      nestedItems: [{ itemName: "one" }, { itemName: "two" }],
    },
    DOB: "2024-08-30",
  };

  const got = RestClient.camelToSnakeCaseTransformer(data);

  assertEquals(got, {
    first_name: "john",
    account_details: {
      bank_code: "058",
      nested_items: [{ item_name: "one" }, { item_name: "two" }],
    },
    dob: "2024-08-30",
  });
});

Deno.test("RestClient transforms nested snake_case payloads to camelCase", () => {
  const data = {
    first_name: "john",
    account_details: {
      bank_code: "058",
      nested_items: [{ item_name: "one" }, { item_name: "two" }],
    },
    dob: "2024-08-30",
  };

  const got = RestClient.snakeToCamelCaseTransformer(data);

  assertEquals(got, {
    firstName: "john",
    accountDetails: {
      bankCode: "058",
      nestedItems: [{ itemName: "one" }, { itemName: "two" }],
    },
    dob: "2024-08-30",
  });
});

Deno.test("RestClient builds the correct auth headers for open and secure clients", () => {
  const client = new RestClient(
    "pk_test",
    "sk_test",
    "01234567890123456789012345678901",
  );
  const openHeaders = (client as any).openHeaders;
  const secureHeaders = (client as any).secureHeaders;

  assertEquals(openHeaders.Authorization, "Bearer pk_test");
  assertEquals(secureHeaders.Authorization, "Bearer sk_test");
  assertEquals(openHeaders["User-Agent"], "@gray-adeyi/korapay-sdk 0.3.0");
  assertEquals(secureHeaders["User-Agent"], "@gray-adeyi/korapay-sdk 0.3.0");
});

Deno.test("RestClient routes GET requests through the secure client by default", async () => {
  const client = new RestClient(
    "pk_test",
    "sk_test",
    "01234567890123456789012345678901",
  );
  const calls: Array<{ endpoint: string }> = [];

  (client as any).secureClient = {
    get: async (endpoint: string) => {
      calls.push({ endpoint });
      return createResponse(200, {
        status: true,
        message: "success",
        data: { reference: "ref_001" },
      });
    },
  };

  const response = await client.call(
    "/merchant/api/v1/balances",
    HTTPMethod.GET,
  );

  assertEquals(calls, [{ endpoint: "/merchant/api/v1/balances" }]);
  assertEquals(response, {
    statusCode: 200,
    status: true,
    message: "success",
    data: { reference: "ref_001" },
  });
});

Deno.test("RestClient routes no-auth POST requests through the open client", async () => {
  const client = new RestClient(
    "pk_test",
    "sk_test",
    "01234567890123456789012345678901",
  );
  const calls: Array<{ endpoint: string; data: unknown }> = [];

  (client as any).openClient = {
    post: async (endpoint: string, data: unknown) => {
      calls.push({ endpoint, data });
      return createResponse(200, {
        status: true,
        message: "success",
        data: { reference: "ref_002" },
      });
    },
  };

  const payload = { countryCode: "NG" };
  const response = await client.call(
    "/merchant/api/v1/misc/banks",
    HTTPMethod.POST,
    payload,
    true,
  );

  assertEquals(calls, [{
    endpoint: "/merchant/api/v1/misc/banks",
    data: payload,
  }]);
  assertEquals(response.statusCode, 200);
  assertEquals(response.data, { reference: "ref_002" });
});

Deno.test("RestClient wraps request errors in KorapayClientError", async () => {
  const client = new RestClient(
    "pk_test",
    "sk_test",
    "01234567890123456789012345678901",
  );

  await assertRejects(
    () =>
      (client as any).handleRequestError({
        message: "request failed",
        status: 401,
        code: "ERR_BAD_REQUEST",
      }),
    KorapayClientError,
  );
});

Deno.test("RestClient wraps response errors in KorapayClientError", async () => {
  const client = new RestClient(
    "pk_test",
    "sk_test",
    "01234567890123456789012345678901",
  );

  await assertRejects(
    () =>
      (client as any).handleResponseError({
        message: "response failed",
        status: 500,
        code: "ERR_BAD_RESPONSE",
      }),
    KorapayClientError,
  );
});

Deno.test("RestClient encrypts payloads into iv:ciphertext:tag format", async () => {
  const client = new RestClient(
    "pk_test",
    "sk_test",
    "01234567890123456789012345678901",
  );
  const encrypted = await client.encryptData({ reference: "ref_001" });

  const parts = encrypted.split(":");

  assertEquals(parts.length, 3);
  assert(parts.every((part) => part.length > 0));
});
