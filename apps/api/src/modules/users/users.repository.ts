import { UserModel } from "../../db/models/user.model";

export const usersRepository = {
  findByPhone(phone: string) {
    return UserModel.findOne({ phone });
  },

  findById(id: string) {
    return UserModel.findById(id);
  },

  create(phone: string) {
    return UserModel.create({ phone });
  },

  update(id: string, data: { name?: string; email?: string; photoUrl?: string }) {
    return UserModel.findByIdAndUpdate(id, data, { returnDocument: "after" });
  },
};
