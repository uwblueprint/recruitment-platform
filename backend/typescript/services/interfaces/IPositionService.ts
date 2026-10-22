import { PositionDTO } from "../../types";

interface IPositionService {
  /**
   * Get all positions, optionally filtered by archive status.
   * @param isArchived - true for archived, false for non-archived; omit for all positions.
   * @returns the array of PositionDTOs
   * @throws Error if positions retrieval fails
   */
  getAllPositions(isArchived?: boolean): Promise<PositionDTO[]>;
}

export default IPositionService;
