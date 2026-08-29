import { Router } from "express";
import { sendOtpSchema, verifyOtpSchema, adminLoginSchema } from "@karigar-wala/shared";
import { validate } from "../../middlewares/validate";
import { otpRateLimiter } from "../../middlewares/rate-limiter";
import { requireAdmin } from "../../middlewares/auth";
import { authController } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/otp/send", otpRateLimiter, validate(sendOtpSchema), authController.sendOtp);
authRouter.post("/otp/verify", validate(verifyOtpSchema), authController.verifyOtp);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);

export const adminAuthRouter = Router();
adminAuthRouter.post("/login", validate(adminLoginSchema), authController.adminLogin);
adminAuthRouter.post("/logout", authController.adminLogout);
adminAuthRouter.get("/me", requireAdmin, authController.adminMe);
