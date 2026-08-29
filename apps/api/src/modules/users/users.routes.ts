import { Router } from "express";
import { z } from "zod";
import { updateProfileSchema, addressSchema, pushSubscriptionInputSchema } from "@karigar-wala/shared";
import { requireAuth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { usersController } from "./users.controller";

export const usersRouter = Router();

usersRouter.use(requireAuth);

usersRouter.get("/me", usersController.getMe);
usersRouter.patch("/me", validate(updateProfileSchema), usersController.updateMe);

usersRouter.get("/me/addresses", usersController.listAddresses);
usersRouter.post("/me/addresses", validate(addressSchema), usersController.createAddress);
usersRouter.patch("/me/addresses/:addressId", usersController.updateAddress);
usersRouter.delete("/me/addresses/:addressId", usersController.deleteAddress);

usersRouter.post(
  "/me/push-subscription",
  validate(pushSubscriptionInputSchema),
  usersController.subscribeToPush,
);
usersRouter.delete(
  "/me/push-subscription",
  validate(z.object({ endpoint: z.string().url() })),
  usersController.unsubscribeFromPush,
);
