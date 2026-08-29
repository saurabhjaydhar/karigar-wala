import { CookieOptions, Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import {
  ACCESS_TOKEN_MAX_AGE_MS,
  REFRESH_TOKEN_MAX_AGE_MS,
  ADMIN_ACCESS_TOKEN_MAX_AGE_MS,
} from "../../utils/jwt";
import { toPublicUser } from "../users/user.mapper";

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export const authController = {
  async sendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.sendOtp(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, accessToken, refreshToken } = await authService.verifyOtp(req.body);

      res.cookie("accessToken", accessToken, {
        ...baseCookieOptions,
        maxAge: ACCESS_TOKEN_MAX_AGE_MS,
      });
      res.cookie("refreshToken", refreshToken, {
        ...baseCookieOptions,
        maxAge: REFRESH_TOKEN_MAX_AGE_MS,
      });

      res.json({ user: toPublicUser(user) });
    } catch (err) {
      next(err);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken } = await authService.refresh(req.cookies?.refreshToken);
      res.cookie("accessToken", accessToken, {
        ...baseCookieOptions,
        maxAge: ACCESS_TOKEN_MAX_AGE_MS,
      });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async logout(_req: Request, res: Response) {
    res.clearCookie("accessToken", baseCookieOptions);
    res.clearCookie("refreshToken", baseCookieOptions);
    res.status(204).send();
  },

  async adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { admin, accessToken } = await authService.adminLogin(req.body);
      res.cookie("adminAccessToken", accessToken, {
        ...baseCookieOptions,
        maxAge: ADMIN_ACCESS_TOKEN_MAX_AGE_MS,
      });
      res.json({ admin });
    } catch (err) {
      next(err);
    }
  },

  async adminLogout(_req: Request, res: Response) {
    res.clearCookie("adminAccessToken", baseCookieOptions);
    res.status(204).send();
  },

  async adminMe(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ admin: await authService.getAdminMe(req.admin!.id) });
    } catch (err) {
      next(err);
    }
  },
};
