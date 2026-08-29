import type { VerificationStatus, UpdateKarigarChecklistInput } from "@karigar-wala/shared";
import { HttpError } from "../../utils/http-error";
import { KarigarModel } from "../../db/models/karigar.model";
import { recordAuditLog } from "./audit-log";

export const adminKarigarsService = {
  list(status?: VerificationStatus) {
    return KarigarModel.find(status ? { verificationStatus: status } : {}).sort({
      createdAt: -1,
    });
  },

  async getById(id: string) {
    const karigar = await KarigarModel.findById(id);
    if (!karigar) throw new HttpError(404, "Karigar not found");
    return karigar;
  },

  async updateStatus(adminId: string, id: string, status: VerificationStatus) {
    const karigar = await KarigarModel.findByIdAndUpdate(
      id,
      { verificationStatus: status },
      { returnDocument: "after" },
    );
    if (!karigar) throw new HttpError(404, "Karigar not found");

    await recordAuditLog(adminId, `karigar.${status}`, "Karigar", id, { name: karigar.name });

    return karigar;
  },

  async updateChecklist(adminId: string, id: string, checklist: UpdateKarigarChecklistInput) {
    const update = Object.fromEntries(
      Object.entries(checklist).map(([key, value]) => [`verificationChecklist.${key}`, value]),
    );
    const karigar = await KarigarModel.findByIdAndUpdate(id, update, { returnDocument: "after" });
    if (!karigar) throw new HttpError(404, "Karigar not found");

    await recordAuditLog(adminId, "karigar.checklist_updated", "Karigar", id, {
      name: karigar.name,
      checklist,
    });

    return karigar;
  },
};
