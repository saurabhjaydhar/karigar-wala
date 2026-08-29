import { AdminModel } from "../../db/models/admin.model";

export const adminRepository = {
  findByEmail(email: string) {
    return AdminModel.findOne({ email });
  },

  findById(id: string) {
    return AdminModel.findById(id);
  },
};
