import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/http-error";
import {
  verifyAccessToken,
  verifyAdminAccessToken,
  type AccessTokenPayload,
  type AdminAccessTokenPayload,
} from "../utils/jwt";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
      admin?: AdminAccessTokenPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken;
  if (!token) return next(new HttpError(401, "Authentication required"));

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired session"));
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.adminAccessToken;
  if (!token) return next(new HttpError(401, "Admin authentication required"));

  try {
    req.admin = verifyAdminAccessToken(token);
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired admin session"));
  }
}
