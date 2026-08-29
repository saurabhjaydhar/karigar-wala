import { KarigarModel } from "../../db/models/karigar.model";
import { KarigarApplicationInput } from "@karigar-wala/shared";

export interface KarigarListFilter {
  area?: string;
  category?: string;
  q?: string;
}

export const karigarsRepository = {
  findApproved({ area, category, q }: KarigarListFilter) {
    const filter: Record<string, unknown> = {
      isActive: true,
      verificationStatus: "approved",
    };

    if (area) filter.areasServed = area;
    if (category) filter.primarySkill = new RegExp(`^${category}$`, "i");
    if (q) {
      filter.$or = [
        { name: new RegExp(q, "i") },
        { primarySkill: new RegExp(q, "i") },
        { skills: new RegExp(q, "i") },
      ];
    }

    return KarigarModel.find(filter).sort({ rating: -1 });
  },

  findApprovedById(id: string) {
    return KarigarModel.findOne({ _id: id, isActive: true, verificationStatus: "approved" });
  },

  createApplication(input: KarigarApplicationInput) {
    return KarigarModel.create({
      name: input.name,
      phone: input.phone,
      photoUrl: input.photoUrl,
      type: input.type,
      primarySkill: input.primarySkill,
      yearsOfExperience: input.yearsOfExperience,
      teamSize: input.teamSize,
      areasServed: input.areasServed,
    });
  },
};
