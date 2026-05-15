import ApplicantRecordService from "../../services/implementations/applicantRecordService";
import IApplicantRecordService from "../../services/interfaces/IApplicantRecordService";
import { ApplicantRecordDTO, ApplicationStatus } from "../../types";

const applicantRecordService: IApplicantRecordService = new ApplicantRecordService();

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
