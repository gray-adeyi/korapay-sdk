import { beforeAll, describe, it } from "@std/testing/bdd";
import KorapayClient from "../src/korapay.ts";
import { Country } from "../src/enums.ts";
import { load } from "@std/dotenv";

describe("KorapayClient", () => {
  let client: KorapayClient;

  beforeAll(async () => {
    await load({ envPath: "./.env", export: true });
    client = new KorapayClient();
  });

  it("chargeViaCard", () => {});

  it("getBanks", async () => {
    const response = await client.getBanks(Country.NIGERIA);
    console.log(response);
  });
});
