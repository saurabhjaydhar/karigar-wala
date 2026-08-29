import { ServiceCategoryModel } from "../../db/models/service-category.model";
import { ServiceModel } from "../../db/models/service.model";

export const servicesRepository = {
  findAllActive() {
    return ServiceCategoryModel.find({ isActive: true }).sort({ name: 1 });
  },

  findBySlug(slug: string) {
    return ServiceCategoryModel.findOne({ slug, isActive: true });
  },

  findCategoryById(categoryId: string) {
    return ServiceCategoryModel.findOne({ _id: categoryId, isActive: true });
  },

  findSubServicesByCategoryId(categoryId: string) {
    return ServiceModel.find({ categoryId }).sort({ name: 1 });
  },
};
