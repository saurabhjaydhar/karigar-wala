import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { HttpError } from "../utils/http-error";
import { logger } from "../utils/logger";

function isDuplicateKeyError(err: unknown): err is { keyValue?: Record<string, unknown> } {
  return typeof err === "object" && err !== null && "code" in err && (err as { code: unknown }).code === 11000;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    return res.status(422).json({ error: "ValidationError", details: err.flatten() });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(422).json({ error: "ValidationError", details: err.errors });
  }

  if (isDuplicateKeyError(err)) {
    return res.status(409).json({ error: "DuplicateKeyError", details: err.keyValue });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }

  logger.error({ err }, "Unhandled error");
  return res.status(500).json({ error: "InternalServerError" });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}
