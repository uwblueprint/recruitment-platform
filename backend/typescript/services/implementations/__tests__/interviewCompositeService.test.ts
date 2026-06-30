import ApplicantRecord from "../../../models/applicantRecord.model";
import InterviewDelegation from "../../../models/interviewDelegation.model";
import InterviewedApplicantRecord from "../../../models/interviewedApplicantRecord.model";
import InterviewCompositeService from "../interviewCompositeService";

describe("InterviewCompositeService", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("fetches the interview dashboard in one database query", async () => {
    const applicantRecordQuery = jest
      .spyOn(ApplicantRecord, "findAll")
      .mockResolvedValue([]);
    const interviewedApplicantRecordQuery = jest.spyOn(
      InterviewedApplicantRecord,
      "findAll",
    );

    const service = new InterviewCompositeService();
    await expect(service.getInterviewDashboard(2, 25)).resolves.toEqual([]);

    expect(applicantRecordQuery).toHaveBeenCalledTimes(1);
    expect(applicantRecordQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 25,
        offset: 25,
        include: expect.arrayContaining([
          expect.objectContaining({
            model: InterviewedApplicantRecord,
            as: "interviewed_applicant_record",
            include: expect.arrayContaining([
              expect.objectContaining({
                model: InterviewDelegation,
                as: "interview_delegations",
              }),
            ]),
          }),
        ]),
      }),
    );
    expect(interviewedApplicantRecordQuery).not.toHaveBeenCalled();
  });
});
