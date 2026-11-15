import ApplicantIngestionService from "../../services/implementations/applicantIngestionService";
import ApplicantRecordService from "../../services/implementations/applicantRecordService";
import EmailService from "../../services/implementations/emailService";
import IApplicantIngestionService from "../../services/interfaces/IApplicantIngestionService";
import IApplicantRecordService from "../../services/interfaces/IApplicantRecordService";
import IEmailService from "../../services/interfaces/emailService";
import nodemailerConfig from "../../nodemailer.config";
import {
  ApplicantRecordDTO,
  ApplicationStatus,
  BulkEmailResult,
  PopulateApplicantRecordsResult,
} from "../../types";

const emailService: IEmailService = new EmailService(
  nodemailerConfig,
  "UW Blueprint Recruitment",
);
const applicantRecordService: IApplicantRecordService = new ApplicantRecordService(
  emailService,
);

const applicantIngestionService: IApplicantIngestionService = new ApplicantIngestionService();

const applicantRecordResolvers = {
  Mutation: {
    populateApplicantRecords: async (
      _parent: undefined,
      { term }: { term: string },
    ): Promise<PopulateApplicantRecordsResult> => {
      return applicantIngestionService.populateApplicantRecords(term);
    },
    sendRejectionEmails: async (
      _parent: undefined,
      { ids }: { ids: string[] },
    ): Promise<BulkEmailResult> => {
      return applicantRecordService.sendRejectionEmails(ids);
    },
    updateApplicantRecordStatus: async (
      _parent: undefined,
      { id, status }: { id: string; status: ApplicationStatus },
    ): Promise<ApplicantRecordDTO> => {
      return applicantRecordService.updateApplicantRecord(id, { status });
    },
    bulkUpdateApplicantRecordsStatus: async (
      _parent: undefined,
      { ids, status }: { ids: string[]; status: ApplicationStatus },
    ): Promise<ApplicantRecordDTO[]> => {
      return applicantRecordService.bulkUpdateApplicantRecords(
        ids.map((id) => ({ id, status })),
      );
    },
    updateApplicantRecordIsApplicantFlagged: async (
      _parent: undefined,
      { id, flagValue }: { id: string; flagValue: boolean },
    ): Promise<ApplicantRecordDTO> => {
      return applicantRecordService.updateApplicantRecord(id, {
        isApplicantFlagged: flagValue,
      });
    },
    updateApplicantRecordShortlistedForInterview: async (
      _parent: undefined,
      { id, shortlistedValue }: { id: string; shortlistedValue: boolean },
    ): Promise<ApplicantRecordDTO> => {
      return applicantRecordService.updateApplicantRecord(id, {
        isShortlistedForInterview: shortlistedValue,
      });
    },
  },
};

export default applicantRecordResolvers;
