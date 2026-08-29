import { UserModel } from "../../db/models/user.model";

export const adminUsersService = {
  list(q?: string) {
    const filter = q
      ? { $or: [{ name: new RegExp(q, "i") }, { phone: new RegExp(q, "i") }] }
      : {};
    return UserModel.find(filter).sort({ createdAt: -1 }).limit(200);
  },
};
