import {
  AcademicOrCoop,
  ApplicantDTO,
} from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import Applicant from "../../models/applicant.model";
import IApplicantService from "../interfaces/IApplicantService";

const Logger = logger(__filename);

function toDTO(applicant: Applicant): ApplicantDTO {
  return {
    id: applicant.id,
    firstName: applicant.first_name,
    lastName: applicant.last_name,
    email: applicant.email,
    academicOrCoop: applicant.academic_or_coop as AcademicOrCoop,
    academicYear: applicant.academic_year,
    heardFrom: applicant.heard_from,
    locationPreference: applicant.location_preference,
    program: applicant.program,
    pronouns: applicant.pronouns,
    resumeUrl: applicant.resume_url,
    timesApplied: applicant.times_applied,
    shortAnswerQuestions: applicant.short_answer_questions,
    term: applicant.term,
    submittedAt: applicant.submitted_at,
  };
}

class ApplicantService implements IApplicantService {
  /* eslint-disable class-methods-use-this */

  async getApplicantById(id: string): Promise<ApplicantDTO> {
    try {
      const applicant = await Applicant.findByPk(id);
      if (!applicant) {
        throw new Error(`Applicant with id ${id} not found.`);
      }
      return toDTO(applicant);
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
