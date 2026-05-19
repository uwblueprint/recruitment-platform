import { ApplicantDTO } from "../../types";
import { toApplicantDTO } from "../../utilities/dtoUtils";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import Applicant from "../../models/applicant.model";
import IApplicantService from "../interfaces/IApplicantService";

const Logger = logger(__filename);

class ApplicantService implements IApplicantService {
  /* eslint-disable class-methods-use-this */

  async getApplicantById(id: string): Promise<ApplicantDTO> {
    try {
      const applicant = await Applicant.findByPk(id);
      if (!applicant) {
        throw new Error(`Applicant with id ${id} not found.`);
      }
      return toApplicantDTO(applicant);
    } catch (error: unknown) {
      Logger.error(
        `Failed to get applicant by id = ${id}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }
}

export default ApplicantService;
