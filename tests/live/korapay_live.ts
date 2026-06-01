import { assertEquals } from "@std/assert";
import { load } from "@std/dotenv";

import { Country } from "../../src/enums.ts";
import KorapayClient from "../../src/korapay.ts";

async function canRunLiveTests(): Promise<boolean> {
  if (Deno.env.get("KORAPAY_LIVE_TESTS") !== "1") {
    return false;
  }

  try {
    await Deno.stat(".env");
    await load({
      envPath: ".env",
      export: true,
    });
  } catch {
    console.warn("Skipping live tests: .env file not found");
    return false;
  }

  const requiredEnvVars = [
    "KORAPAY_PUBLIC_KEY",
    "KORAPAY_SECRET_KEY",
  ];

  for (const key of requiredEnvVars) {
    if (!Deno.env.get(key)) {
      console.warn(
        `Skipping live tests: missing required environment variable ${key}`,
      );
      return false;
    }
  }

  return true;
}

if (await canRunLiveTests()) {
  const client = new KorapayClient();

  Deno.test("live: getBalances", async () => {
    const response = await client.getBalances();

    assertEquals(response.statusCode, 200);
    assertEquals(response.message, "success");
  });

  Deno.test("live: getBanks", async () => {
    const response = await client.getBanks(Country.NIGERIA);

    assertEquals(response.statusCode, 200);
    assertEquals(Array.isArray(response.data), true);
  });

  Deno.test("live: getMmo", async () => {
    const response = await client.getMmo(Country.GHANA);

    assertEquals(response.statusCode, 200);
    assertEquals(Array.isArray(response.data), true);
  });
}
