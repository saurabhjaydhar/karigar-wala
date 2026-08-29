import type { HydratedDocument } from "mongoose";
import type { UserDocument } from "../../db/models/user.model";

export function toPublicUser(user: HydratedDocument<UserDocument>) {
  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    photoUrl: user.photoUrl,
    isTrusted: user.isTrusted,
    isVerified: user.isVerified,
    memberSince: user.memberSince,
  };
}

export type PublicUser = ReturnType<typeof toPublicUser>;
