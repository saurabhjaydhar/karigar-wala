import jwt from "jsonwebtoken";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "30d";

export const ACCESS_TOKEN_MAX_AGE_MS = 15 * 60 * 1000;
export const REFRESH_TOKEN_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export interface AccessTokenPayload {
  id: string;
  phone: string;
}

export interface RefreshTokenPayload {
  id: string;
}

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET ?? "", { expiresIn: ACCESS_TOKEN_TTL });
}

export function signRefreshToken(payload: RefreshTokenPayload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET ?? "", { expiresIn: REFRESH_TOKEN_TTL });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET ?? "") as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET ?? "") as RefreshTokenPayload;
}

const ADMIN_ACCESS_TOKEN_TTL = "8h";
export const ADMIN_ACCESS_TOKEN_MAX_AGE_MS = 8 * 60 * 60 * 1000;

export interface AdminAccessTokenPayload {
  id: string;
  role: string;
}

export function signAdminAccessToken(payload: AdminAccessTokenPayload) {
  return jwt.sign(payload, process.env.ADMIN_JWT_SECRET ?? "", {
    expiresIn: ADMIN_ACCESS_TOKEN_TTL,
  });
}

export function verifyAdminAccessToken(token: string): AdminAccessTokenPayload {
  return jwt.verify(token, process.env.ADMIN_JWT_SECRET ?? "") as AdminAccessTokenPayload;
}
