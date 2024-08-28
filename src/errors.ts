export class KoraPayClientError extends Error {
  detail: any;
  status?: number;
  code?: string;

  constructor(detail: any, status?: number, code?: string) {
    super(`${JSON.stringify(detail)}`);
    this.detail = detail;
    this.status = status;
    this.code = code;
  }
}
