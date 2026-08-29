import { Types } from "mongoose";
import { QuoteRequestInput, ContractStatus } from "@karigar-wala/shared";
import { HttpError } from "../../utils/http-error";
import { contractsRepository } from "./contracts.repository";
import { notifyUser } from "../notifications/notify";
import { recordAuditLog } from "../admin/audit-log";
import { KarigarModel } from "../../db/models/karigar.model";

const CANCELLABLE_STATUSES = new Set(["quote_requested", "quoted", "agreed", "in_progress"]);

export const contractsService = {
  async requestQuote(customerId: string, input: QuoteRequestInput) {
    const contractor = await KarigarModel.findOne({
      _id: input.contractorId,
      type: "contractor",
      isActive: true,
      verificationStatus: "approved",
    });
    if (!contractor) throw new HttpError(404, "Contractor not found");

    return contractsRepository.create({
      customerId,
      contractorId: input.contractorId,
      scopeDescription: input.scopeDescription,
      photoUrls: input.photoUrls,
    });
  },

  listMine(customerId: string) {
    return contractsRepository.findAllForCustomer(customerId);
  },

  async getById(customerId: string, contractId: string) {
    const contract = await contractsRepository.findByIdForCustomer(customerId, contractId);
    if (!contract) throw new HttpError(404, "Contract not found");
    return contract;
  },

  async accept(customerId: string, contractId: string) {
    const contract = await contractsRepository.findByIdForCustomer(customerId, contractId);
    if (!contract) throw new HttpError(404, "Contract not found");
    if (contract.status !== "quoted") {
      throw new HttpError(400, "Only a quoted contract can be accepted");
    }
    contract.status = "agreed";
    await contract.save();
    return contract;
  },

  async cancel(customerId: string, contractId: string) {
    const contract = await contractsRepository.findByIdForCustomer(customerId, contractId);
    if (!contract) throw new HttpError(404, "Contract not found");
    if (!CANCELLABLE_STATUSES.has(contract.status)) {
      throw new HttpError(400, `Cannot cancel a contract that is already ${contract.status}`);
    }
    contract.status = "cancelled";
    await contract.save();
    return contract;
  },

  async adminSendQuote(
    adminId: string,
    contractId: string,
    input: { estimatedCost: number; timeline: string },
  ) {
    const contract = await contractsRepository.findByIdForAdmin(contractId);
    if (!contract) throw new HttpError(404, "Contract not found");
    if (contract.status !== "quote_requested") {
      throw new HttpError(400, "This contract already has a quote");
    }
    contract.estimatedCost = input.estimatedCost;
    contract.timeline = input.timeline;
    contract.status = "quoted";
    await contract.save();

    const customerRef = contract.customerId as unknown as { _id: Types.ObjectId } | Types.ObjectId;
    const customerId = String("_id" in customerRef ? customerRef._id : customerRef);

    await notifyUser({
      userId: customerId,
      title: "Quote ready",
      message: `You've received a quote of ₹${input.estimatedCost} (${input.timeline}) for your contract request.`,
      type: "contract",
    });

    await recordAuditLog(adminId, "contract.quote", "Contract", contractId, {
      estimatedCost: input.estimatedCost,
      timeline: input.timeline,
    });

    return contract;
  },

  adminList(status?: ContractStatus) {
    return contractsRepository.findAllForAdmin(status);
  },

  async adminUpdateStatus(adminId: string, contractId: string, status: ContractStatus) {
    const contract = await contractsRepository.findByIdForAdmin(contractId);
    if (!contract) throw new HttpError(404, "Contract not found");
    contract.status = status;
    await contract.save();

    await recordAuditLog(adminId, `contract.status.${status}`, "Contract", contractId);

    return contract;
  },
};
