import Position from "../../models/position.model";
import { PositionDTO } from "../../types";
import { toPositionDTO } from "../../utilities/dtoUtils";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import IPositionService from "../interfaces/IPositionService";

const Logger = logger(__filename);

class PositionService implements IPositionService {
  /* eslint-disable class-methods-use-this */

  async getAllPositions(isArchived?: boolean): Promise<PositionDTO[]> {
    try {
      const positions = await Position.findAll({
        where: isArchived !== undefined ? { is_archived: isArchived } : {},
        order: [["title", "ASC"]],
      });
      return positions.map(toPositionDTO);
    } catch (error: unknown) {
      Logger.error(
        `Failed to get positions. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default PositionService;
