import { KorapayClientError } from "./errors.ts";
import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { camelCase, snakeCase } from "lodash-es";
import { encryptAes256 } from "./utils.ts";
import type { KorapayResponse } from "./types/global.ts";
import { HTTPMethod } from "./enums.ts";

export default class RestClient {
  static BASE_URL = "https://api.korapay.com";
  static ENV_PUBLIC_KEY_NAME = "KORAPAY_PUBLIC_KEY";
  static ENV_SECRET_KEY_NAME = "KORAPAY_SECRET_KEY";
  static ENV_ENCRYPTION_KEY_NAME = "KORAPAY_ENCRYPTION_KEY";

  private publicKey: string = "";
  private secretKey: string = "";
  private encryptionKey: string = "";
  private secureClient: AxiosInstance;
  private openClient: AxiosInstance;

  constructor(publicKey?: string, secretKey?: string, encryptionKey?: string) {
    this.loadKey(
      "public key",
      RestClient.ENV_PUBLIC_KEY_NAME,
      publicKey,
    );
    this.loadKey(
      "secret key",
      RestClient.ENV_SECRET_KEY_NAME,
      secretKey,
    );
    this.loadKey(
      "encryption key",
      RestClient.ENV_ENCRYPTION_KEY_NAME,
      encryptionKey,
    );

    this.secureClient = axios.create({
      baseURL: RestClient.BASE_URL,
      headers: this.secureHeaders,
    });
    this.secureClient.interceptors.request.use(
      this.requestPayloadTransformerInterceptor,
      this.handleRequestError,
    );
    this.secureClient.interceptors.response.use(
      this.responsePayloadTransformerInterceptor,
      this.handleResponseError,
    );

    this.openClient = axios.create({
      baseURL: RestClient.BASE_URL,
      headers: this.openHeaders,
    });
    this.openClient.interceptors.request.use(
      this.requestPayloadTransformerInterceptor,
      this.handleRequestError,
    );
    this.openClient.interceptors.response.use(
      this.responsePayloadTransformerInterceptor,
      this.handleResponseError,
    );
  }

  // deno-lint-ignore no-explicit-any
  async call(
    endpoint: string,
    method: HTTPMethod,
    // deno-lint-ignore no-explicit-any
    data?: any,
    noAuth = false,
  ): Promise<KorapayResponse> {
    const handler = this.getMethodHandler(method, noAuth);
    let response: AxiosResponse;
    if ([HTTPMethod.GET, HTTPMethod.DELETE].includes(method)) {
      response = await handler(endpoint);
    } else {
      response = await handler(endpoint, data);
    }
    return this.deserializeResponse(response);
  }

  // deno-lint-ignore no-explicit-any
  encryptData(data: any): Promise<string> {
    return encryptAes256(this.encryptionKey, data);
  }

  private get baseHeaders() {
    return {
      "User-Agent": "@gray-adeyi/korapay-sdk 0.1.0",
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }

  private get openHeaders() {
    return {
      ...this.baseHeaders,
      Authorization: `Bearer ${this.publicKey}`,
    };
  }

  private get secureHeaders() {
    return {
      ...this.baseHeaders,
      Authorization: `Bearer ${this.secretKey}`,
    };
  }

  private getMethodHandler(method: HTTPMethod, noAuth: boolean) {
    // deno-lint-ignore no-explicit-any
    const secureClientHandlerMapping: Record<HTTPMethod, any> = {
      [HTTPMethod.GET]: this.secureClient.get,
      [HTTPMethod.POST]: this.secureClient.post,
      [HTTPMethod.PATCH]: this.secureClient.patch,
      [HTTPMethod.PUT]: this.secureClient.put,
      [HTTPMethod.DELETE]: this.secureClient.delete,
    };
    const openClientHandlerMapping = {
      [HTTPMethod.GET]: this.openClient.get,
      [HTTPMethod.POST]: this.openClient.post,
      [HTTPMethod.PATCH]: this.openClient.patch,
      [HTTPMethod.PUT]: this.openClient.put,
      [HTTPMethod.DELETE]: this.openClient.delete,
    };
    const mapping = noAuth
      ? openClientHandlerMapping
      : secureClientHandlerMapping;
    return mapping[method];
  }

  private deserializeResponse(response: AxiosResponse): KorapayResponse {
    return {
      statusCode: response.status,
      status: response.data["status"] || false,
      message: response.data["message"],
      data: response.data["data"],
    };
  }

  private requestPayloadTransformerInterceptor(
    config: InternalAxiosRequestConfig,
  ) {
    config.data = RestClient.camelToSnakeCaseTransformer(config.data);
    return config;
  }

  private responsePayloadTransformerInterceptor(response: AxiosResponse) {
    response.data = RestClient.snakeToCamelCaseTransformer(response.data);
    return response;
  }

  // deno-lint-ignore no-explicit-any
  static camelToSnakeCaseTransformer(data: any): any {
    if (Array.isArray(data)) {
      return data.map(RestClient.camelToSnakeCaseTransformer);
    } else if (data !== null && typeof data === "object") {
      // deno-lint-ignore no-explicit-any
      return Object.keys(data).reduce((acc: Record<string, any>, key) => {
        const snakeKey: string = snakeCase(key);
        acc[snakeKey] = RestClient.camelToSnakeCaseTransformer(data[key]);
        return acc;
      }, {});
    }
    return data;
  }

  // deno-lint-ignore no-explicit-any
  static snakeToCamelCaseTransformer(data: any): any {
    if (Array.isArray(data)) {
      return data.map(RestClient.snakeToCamelCaseTransformer);
    } else if (data !== null && typeof data === "object") {
      // deno-lint-ignore no-explicit-any
      return Object.keys(data).reduce((acc: Record<string, any>, key) => {
        const camelKey = camelCase(key);
        acc[camelKey] = RestClient.snakeToCamelCaseTransformer(data[key]);
        return acc;
      }, {});
    }
    return data;
  }

  private handleRequestError(error: AxiosError) {
    return Promise.reject(
      new KorapayClientError(error.message, error.status, error.code),
    );
  }

  private handleResponseError(error: AxiosError) {
    return Promise.reject(
      new KorapayClientError(error.message, error.status, error.code, error),
    );
  }

  private loadKey(
    keyName: "public key" | "secret key" | "encryption key",
    keyEnvName: string,
    value?: string,
  ) {
    if (value) {
      switch (keyName) {
        case "public key":
          this.publicKey = value;
          break;
        case "secret key":
          this.secretKey = value;
          break;
        case "encryption key":
          this.encryptionKey = value;
          break;
      }
      return;
    }
    if (!Deno.env.has(keyEnvName)) {
      throw new KorapayClientError(
        `${keyName} was not provided on instantiation or set in environmental variables as ${keyEnvName}`,
      );
    }
    const envValue = Deno.env.get(keyEnvName) as string;
    switch (keyName) {
      case "public key":
        this.publicKey = envValue;
        break;
      case "secret key":
        this.secretKey = envValue;
        break;
      case "encryption key":
        this.encryptionKey = envValue;
        break;
    }
  }
}
