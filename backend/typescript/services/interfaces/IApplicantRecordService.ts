import {
  ApplicantRecordDTO,
  BulkUpdateApplicantRecordDTO,
  CreateApplicantRecordDTO,
  UpdateApplicantRecordDTO,
} from "../../types";

interface IApplicantRecordService {
  getApplicantRecordById(id: string): Promise<ApplicantRecordDTO>;

  createApplicantRecord(
    applicantRecord: CreateApplicantRecordDTO,
  ): Promise<ApplicantRecordDTO>;

  updateApplicantRecord(
    id: string,
    applicantRecord: UpdateApplicantRecordDTO,
  ): Promise<ApplicantRecordDTO>;

  deleteApplicantRecordById(id: string): Promise<ApplicantRecordDTO>;

  bulkCreateApplicantRecords(
    applicantRecords: CreateApplicantRecordDTO[],
  ): Promise<ApplicantRecordDTO[]>;

  bulkUpdateApplicantRecords(
    applicantRecords: BulkUpdateApplicantRecordDTO[],
  ): Promise<ApplicantRecordDTO[]>;
}

export default IApplicantRecordService;
