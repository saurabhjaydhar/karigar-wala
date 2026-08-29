import { areasRepository } from "./areas.repository";

export const areasService = {
  list() {
    return areasRepository.findAllServiceable();
  },
};
