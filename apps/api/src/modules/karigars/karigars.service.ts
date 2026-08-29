import { KarigarQuery, KarigarApplicationInput } from "@karigar-wala/shared";
import { HttpError } from "../../utils/http-error";
import { karigarsRepository } from "./karigars.repository";

export const karigarsService = {
  list(query: KarigarQuery) {
    return karigarsRepository.findApproved(query);
  },

  async getById(id: string) {
    const karigar = await karigarsRepository.findApprovedById(id);
    if (!karigar) throw new HttpError(404, "Karigar not found");
    return karigar;
  },

  async submitApplication(input: KarigarApplicationInput) {
    // Lands with verificationStatus = 'pending' (schema default) — invisible
    // to the public directory until an admin approves it.
    const karigar = await karigarsRepository.createApplication(input);
    return { id: karigar.id, verificationStatus: karigar.verificationStatus };
  },
};
