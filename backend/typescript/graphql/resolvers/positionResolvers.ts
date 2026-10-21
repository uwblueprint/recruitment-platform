import PositionService from "../../services/implementations/positionService";
import IPositionService from "../../services/interfaces/IPositionService";
import { PositionDTO } from "../../types";

const positionService: IPositionService = new PositionService();

const positionResolvers = {
  Query: {
    positions: async (
      _parent: unknown,
      { isArchived }: { isArchived?: boolean },
    ): Promise<PositionDTO[]> => {
      return positionService.getAllPositions(isArchived ?? undefined);
    },
  },
};

export default positionResolvers;
