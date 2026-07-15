import ApplicantRecordService from "../../services/implementations/applicantRecordService";
import EmailService from "../../services/implementations/emailService";
import IApplicantRecordService from "../../services/interfaces/IApplicantRecordService";
import IEmailService from "../../services/interfaces/emailService";
import nodemailerConfig from "../../nodemailer.config";
import { ApplicantRecordDTO, ApplicationStatus } from "../../types";

const emailService: IEmailService = new EmailService(
  nodemailerConfig,
  "UW Blueprint Recruitment",
);
const applicantRecordService: IApplicantRecordService = new ApplicantRecordService(
  emailService,
);

const applicantRecordResolvers = {
  Mutation: {
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
  },
};

export default applicantRecordResolvers;
