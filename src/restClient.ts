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

  private publicKey!: string;
  private secretKey!: string;
  private encryptionKey!: string;
  private client: AxiosInstance;

  constructor(publicKey?: string, secretKey?: string, encryptionKey?: string) {
    this.loadPublicKey(publicKey);
    this.loadPrivateKey(secretKey);
    this.loadEncryptionKey(encryptionKey);
    this.client = axios.create({
      baseURL: RestClient.BASE_URL,
      headers: this.headers,
    });
    this.client.interceptors.request.use(
      this.requestPayloadTransformerInterceptor,
      this.handleRequestError,
    );
    this.client.interceptors.response.use(
      this.responsePayloadTransformerInterceptor,
      this.handleResponseError,
    );
  }

  // deno-lint-ignore no-explicit-any
  async call(endpoint: string, method: HTTPMethod, data?: any, noAuth = false) {
    const handler = this.getMethodHandler(method);
    let response: AxiosResponse;
    if ([HTTPMethod.GET, HTTPMethod.DELETE].includes(method)) {
      response = noAuth ? await handler(endpoint, {headers: {Authorization: ''}}) : await handler(endpoint);
    } else {
      response =noAuth ? await handler(endpoint,data,{headers:{Authorization:''}}) : await handler(endpoint, data);
    }
    return this.deserializeResponse(response);
  }

  // deno-lint-ignore no-explicit-any
  encryptData(data: any) {
    return encryptAes256(this.encryptionKey, data);
  }

  private get baseHeaders(){
    return {
"User-Agent": "@gray-adeyi/korapay-sdk 0.1.0",
      Accept: "application/json",
      'Content-Type': 'application/json',
      Authorization: ''
    }
  }

  private get headers() {
    return {
      ...this.baseHeaders,
      Authorization: `Bearer ${this.secretKey}`,
    };
  }

  private getMethodHandler(method: HTTPMethod) {
    switch (method) {
      case HTTPMethod.GET:
        return this.client.get;
      case HTTPMethod.POST:
        return this.client.post;
      case HTTPMethod.PATCH:
        return this.client.patch;
      case HTTPMethod.PUT:
        return this.client.put;
      case HTTPMethod.DELETE:
        return this.client.delete;
    }
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
    console.log(config)
    return config;
  }

  private responsePayloadTransformerInterceptor(response: AxiosResponse) {
    response.data = RestClient.snakeToCamelCaseTransformer(response.data);
    return response;
  }

  // deno-lint-ignore no-explicit-any
  static camelToSnakeCaseTransformer(data: any): any {
    if (Array.isArray(data)) {
      return data.map(this.camelToSnakeCaseTransformer);
    } else if (data !== null && typeof data === "object") {
      // deno-lint-ignore no-explicit-any
      return Object.keys(data).reduce((acc: Record<string, any>, key) => {
        const snakeKey: string = snakeCase(key);
        acc[snakeKey] = this.camelToSnakeCaseTransformer(data[key]);
        return acc;
      }, {});
    }
    return data;
  }

  // deno-lint-ignore no-explicit-any
  static snakeToCamelCaseTransformer(data: any): any {
    if (Array.isArray(data)) {
      return data.map(this.snakeToCamelCaseTransformer);
    } else if (data !== null && typeof data === "object") {
      // deno-lint-ignore no-explicit-any
      return Object.keys(data).reduce((acc: Record<string, any>, key) => {
        const camelKey = camelCase(key);
        acc[camelKey] = this.snakeToCamelCaseTransformer(data[key]);
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

  private loadPublicKey(value?: string) {
    if (value) {
      this.publicKey = value;
      return;
    }
    if (!Deno.env.has(RestClient.ENV_PUBLIC_KEY_NAME)) {
      throw new KorapayClientError(
        `public key was not provided on instantiation or set in environmental variables as ${RestClient.ENV_PUBLIC_KEY_NAME}`,
      );
    }
    this.publicKey = Deno.env.get(RestClient.ENV_PUBLIC_KEY_NAME) as string;
  }

  private loadPrivateKey(value?: string) {
    if (value) {
      this.secretKey = value;
      return;
    }
    if (!Deno.env.has(RestClient.ENV_SECRET_KEY_NAME)) {
      throw new KorapayClientError(
        `secret key was not provided on instantiation or set in environmental variables as ${RestClient.ENV_SECRET_KEY_NAME}`,
      );
    }
    this.secretKey = Deno.env.get(RestClient.ENV_SECRET_KEY_NAME) as string;
  }

  private loadEncryptionKey(value?: string) {
    if (value) {
      this.encryptionKey = value;
      return;
    }
    if (!Deno.env.has(RestClient.ENV_ENCRYPTION_KEY_NAME)) {
      throw new KorapayClientError(
        `encryption key was not provided on instantiation or set in environmental variables as ${RestClient.ENV_ENCRYPTION_KEY_NAME}`,
      );
    }
    this.encryptionKey = Deno.env.get(
      RestClient.ENV_ENCRYPTION_KEY_NAME,
    ) as string;
  }
}
