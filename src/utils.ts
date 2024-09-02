const IV_LENGTH = 16;

// deno-lint-ignore no-explicit-any
export async function encryptAes256(encryptionKey: string, data: any) {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const jsonData = JSON.stringify(data);
  const encodedData = new TextEncoder().encode(jsonData);
  const cryptoKey = await importKey(encryptionKey);
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    encodedData,
  );
  const encryptedArray = new Uint8Array(encryptedData);
  const cipherText = encryptedArray.slice(0, -16);
  const authTag = encryptedArray.slice(-16);
  const ivAsHex = toHex(iv);
  const cipherTextAsHex = toHex(cipherText);
  const authTagAsHex = toHex(authTag);
  return `${ivAsHex}:${cipherTextAsHex}:${authTagAsHex}`;
}

function toHex(byteArray: Uint8Array) {
  return Array.from(byteArray).map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function toUint8Array(value: string) {
  const len = value.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = value.charCodeAt(i);
  }
  return bytes;
}

async function importKey(encryptionKey: string) {
  const rawKey = toUint8Array(encryptionKey);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM" },
    false,
    ["encrypt"],
  );
  return cryptoKey;
}
