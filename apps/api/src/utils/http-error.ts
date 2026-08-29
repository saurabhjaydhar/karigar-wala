export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const notImplemented = (feature: string) =>
  new HttpError(501, `${feature} is not implemented yet`);
