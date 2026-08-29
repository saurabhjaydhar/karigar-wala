import { AddressInput } from "@karigar-wala/shared";
import { AddressModel } from "../../db/models/address.model";

export const addressesRepository = {
  findAllForUser(userId: string) {
    return AddressModel.find({ userId }).sort({ createdAt: -1 });
  },

  findByIdForUser(userId: string, addressId: string) {
    return AddressModel.findOne({ _id: addressId, userId });
  },

  create(userId: string, input: AddressInput) {
    return AddressModel.create({ ...input, userId });
  },

  updateForUser(userId: string, addressId: string, input: Partial<AddressInput>) {
    return AddressModel.findOneAndUpdate({ _id: addressId, userId }, input, {
      returnDocument: "after",
    });
  },

  deleteForUser(userId: string, addressId: string) {
    return AddressModel.findOneAndDelete({ _id: addressId, userId });
  },
};
