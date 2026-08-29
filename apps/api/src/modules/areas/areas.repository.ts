import { AreaModel } from "../../db/models/area.model";

export const areasRepository = {
  findAllServiceable() {
    return AreaModel.find({ isServiceable: true }).sort({ city: 1, name: 1 });
  },
};
