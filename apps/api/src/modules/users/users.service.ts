import { UpdateProfileInput, AddressInput, PushSubscriptionInput } from "@karigar-wala/shared";
import { HttpError } from "../../utils/http-error";
import { usersRepository } from "./users.repository";
import { addressesRepository } from "./addresses.repository";
import { pushService } from "../notifications/push.service";

export const usersService = {
  async getMe(userId: string) {
    const user = await usersRepository.findById(userId);
    if (!user) throw new HttpError(404, "User not found");
    return user;
  },

  async updateMe(userId: string, input: UpdateProfileInput) {
    const user = await usersRepository.update(userId, input);
    if (!user) throw new HttpError(404, "User not found");
    return user;
  },

  listAddresses(userId: string) {
    return addressesRepository.findAllForUser(userId);
  },

  createAddress(userId: string, input: AddressInput) {
    return addressesRepository.create(userId, input);
  },

  async updateAddress(userId: string, addressId: string, input: Partial<AddressInput>) {
    const address = await addressesRepository.updateForUser(userId, addressId, input);
    if (!address) throw new HttpError(404, "Address not found");
    return address;
  },

  async deleteAddress(userId: string, addressId: string) {
    const address = await addressesRepository.deleteForUser(userId, addressId);
    if (!address) throw new HttpError(404, "Address not found");
  },

  subscribeToPush(userId: string, input: PushSubscriptionInput) {
    return pushService.subscribe(userId, input);
  },

  unsubscribeFromPush(userId: string, endpoint: string) {
    return pushService.unsubscribe(userId, endpoint);
  },
};
