import type { ServiceCategoryInput, AreaInput, ServiceInput } from "@karigar-wala/shared";
import { HttpError } from "../../utils/http-error";
import { ServiceCategoryModel } from "../../db/models/service-category.model";
import { AreaModel } from "../../db/models/area.model";
import { ServiceModel } from "../../db/models/service.model";

export const adminCategoriesService = {
  list() {
    return ServiceCategoryModel.find().sort({ name: 1 });
  },

  create(input: ServiceCategoryInput) {
    return ServiceCategoryModel.create(input);
  },

  async update(id: string, input: Partial<ServiceCategoryInput>) {
    const category = await ServiceCategoryModel.findByIdAndUpdate(id, input, {
      returnDocument: "after",
    });
    if (!category) throw new HttpError(404, "Category not found");
    return category;
  },

  async remove(id: string) {
    const category = await ServiceCategoryModel.findByIdAndDelete(id);
    if (!category) throw new HttpError(404, "Category not found");
  },
};

export const adminAreasService = {
  list() {
    return AreaModel.find().sort({ city: 1, name: 1 });
  },

  create(input: AreaInput) {
    return AreaModel.create(input);
  },

  async update(id: string, input: Partial<AreaInput>) {
    const area = await AreaModel.findByIdAndUpdate(id, input, { returnDocument: "after" });
    if (!area) throw new HttpError(404, "Area not found");
    return area;
  },

  async remove(id: string) {
    const area = await AreaModel.findByIdAndDelete(id);
    if (!area) throw new HttpError(404, "Area not found");
  },
};

export const adminServicesService = {
  list() {
    return ServiceModel.find().sort({ categoryId: 1, name: 1 });
  },

  create(input: ServiceInput) {
    return ServiceModel.create(input);
  },

  async update(id: string, input: Partial<ServiceInput>) {
    const service = await ServiceModel.findByIdAndUpdate(id, input, { returnDocument: "after" });
    if (!service) throw new HttpError(404, "Service not found");
    return service;
  },

  async remove(id: string) {
    const service = await ServiceModel.findByIdAndDelete(id);
    if (!service) throw new HttpError(404, "Service not found");
  },
};
