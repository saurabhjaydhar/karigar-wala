import { HttpError } from "../../utils/http-error";
import { servicesRepository } from "./services.repository";

export const servicesService = {
  list() {
    return servicesRepository.findAllActive();
  },

  async getBySlug(slug: string) {
    const category = await servicesRepository.findBySlug(slug);
    if (!category) throw new HttpError(404, "Service category not found");
    return category;
  },

  async listSubServices(categoryId: string) {
    const category = await servicesRepository.findCategoryById(categoryId);
    if (!category) throw new HttpError(404, "Service category not found");
    return servicesRepository.findSubServicesByCategoryId(categoryId);
  },
};
