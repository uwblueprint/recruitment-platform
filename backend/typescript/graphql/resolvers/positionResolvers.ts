import PositionService from "../../services/implementations/positionService";
import IPositionService from "../../services/interfaces/IPositionService";
import { PositionDTO } from "../../types";

const positionService: IPositionService = new PositionService();

const positionResolvers = {
  Query: {
    positions: async (): Promise<PositionDTO[]> => {
      return positionService.getAllPositions();
    },
  },
};

export default positionResolvers;
