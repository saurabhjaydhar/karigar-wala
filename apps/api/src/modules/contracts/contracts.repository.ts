import { ContractModel } from "../../db/models/contract.model";

function populated() {
  return ContractModel.find()
    .populate("customerId", "name phone")
    .populate("contractorId", "name phone teamSize");
}

export const contractsRepository = {
  create(data: {
    customerId: string;
    contractorId: string;
    scopeDescription: string;
    photoUrls: string[];
  }) {
    return ContractModel.create(data);
  },

  findAllForCustomer(customerId: string) {
    return ContractModel.find({ customerId })
      .sort({ createdAt: -1 })
      .populate("contractorId", "name phone teamSize");
  },

  findByIdForCustomer(customerId: string, contractId: string) {
    return ContractModel.findOne({ _id: contractId, customerId }).populate(
      "contractorId",
      "name phone teamSize",
    );
  },

  findAllForAdmin(status?: string) {
    const query = status ? populated().where({ status }) : populated();
    return query.sort({ createdAt: -1 });
  },

  findByIdForAdmin(contractId: string) {
    return ContractModel.findById(contractId)
      .populate("customerId", "name phone")
      .populate("contractorId", "name phone teamSize");
  },
};
