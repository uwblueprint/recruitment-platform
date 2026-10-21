import { PositionDTO } from "../../types";

interface IPositionService {
  /**
   * Get all positions, including archived positions.
   * @returns the array of PositionDTOs
   * @throws Error if positions retrieval fails
   */
  getPositions(): Promise<PositionDTO[]>;
}

export default IPositionService;
