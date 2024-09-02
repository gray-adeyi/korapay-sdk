import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import RestClient from "./restClient.ts";

describe("RestClient", () => {
  describe("publicKey", () => {});
  describe("privateKey", () => {});
  describe("encryptionKey", () => {});

  it("camelToSnakeCaseTransformer", () => {
    const data = { firstName: "john", lastName: "doe", DOB: "2024-08-30" };
    const expected = {
      first_name: "john",
      last_name: "doe",
      dob: "2024-08-30",
    };
    const got = RestClient.camelToSnakeCaseTransformer(data);
    assertEquals(got, expected);
  });

  it("snakeToCamelCaseTransformer", () => {
    const data = { first_name: "john", last_name: "doe", dob: "2024-08-30" };
    const expected = { firstName: "john", lastName: "doe", dob: "2024-08-30" };
    const got = RestClient.snakeToCamelCaseTransformer(data);
    assertEquals(got, expected);
  });
});
