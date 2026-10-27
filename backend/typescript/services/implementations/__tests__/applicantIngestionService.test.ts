import { FirebaseApplication } from "../../../types";
import Applicant from "../../../models/applicant.model";
import ApplicantRecord from "../../../models/applicantRecord.model";
import Position from "../../../models/position.model";
import ApplicantIngestionService from "../applicantIngestionService";

jest.mock("../../../models", () => ({
  sequelize: {
    transaction: jest.fn(async (cb: (t: unknown) => Promise<void>) =>
      cb({ id: "tx" }),
    ),
  },
}));
jest.mock("../../../models/applicant.model", () => ({
  __esModule: true,
  default: { findAll: jest.fn(), bulkCreate: jest.fn() },
}));
jest.mock("../../../models/applicantRecord.model", () => ({
  __esModule: true,
  default: { bulkCreate: jest.fn() },
}));
jest.mock("../../../models/position.model", () => ({
  __esModule: true,
  default: { findAll: jest.fn() },
}));

const makeApplication = (
  email: string,
  overrides: Partial<FirebaseApplication> = {},
): FirebaseApplication => ({
  academicOrCoop: "Academic",
  academicYear: "2A",
  email,
  firstChoiceRole: "Project Developer",
  firstName: "A",
  heardFrom: "Friend",
  lastName: "B",
  locationPreference: "Remote",
  program: "CS",
  pronouns: "They/Them",
  resumeUrl: "https://example.com/r.pdf",
  roleSpecificQuestions: [
    {
      role: "Project Developer",
      questions: [{ question: "Q", response: "A" }],
    },
  ],
  secondChoiceRole: "",
  shortAnswerQuestions: [],
  term: "Fall 2023",
  timesApplied: "This is my first time!",
  timestamp: 1688586786267,
  ...overrides,
});

describe("ApplicantIngestionService", () => {
  const fetchApplications = jest.fn();
  let service: ApplicantIngestionService;

  beforeEach(() => {
    service = new ApplicantIngestionService(fetchApplications);
    (Applicant.findAll as jest.Mock).mockResolvedValue([]);
    (Position.findAll as jest.Mock).mockResolvedValue([{ title: "Developer" }]);
    (Applicant.bulkCreate as jest.Mock).mockImplementation(
      async (rows: unknown[]) => rows.map((_, i) => ({ id: `applicant-${i}` })),
    );
  });

  it("creates applicants and records for new applications", async () => {
    fetchApplications.mockResolvedValue([
      makeApplication("a@example.com"),
      makeApplication("b@example.com"),
    ]);

    const result = await service.populateApplicantRecords(" Fall 2023 ");

    expect(fetchApplications).toHaveBeenCalledWith("Fall 2023");
    expect(result).toEqual({
      term: "Fall 2023",
      applicantsCreated: 2,
      applicantRecordsCreated: 2,
      skippedExistingEmails: [],
    });
    expect(Applicant.bulkCreate).toHaveBeenCalledTimes(1);
    expect(ApplicantRecord.bulkCreate).toHaveBeenCalledWith(
      [
        expect.objectContaining({ applicant_id: "applicant-0", choice: 1 }),
        expect.objectContaining({ applicant_id: "applicant-1", choice: 1 }),
      ],
      expect.anything(),
    );
  });

  it("skips applicants already ingested and in-batch repeats", async () => {
    (Applicant.findAll as jest.Mock).mockResolvedValue([
      { email: "A@example.com" },
    ]);
    fetchApplications.mockResolvedValue([
      makeApplication("a@example.com"),
      makeApplication("b@example.com"),
      makeApplication("b@example.com"),
    ]);

    const result = await service.populateApplicantRecords("Fall 2023");

    expect(result.applicantsCreated).toBe(1);
    expect(result.skippedExistingEmails).toEqual([
      "a@example.com",
      "b@example.com",
    ]);
  });

  it("rejects the whole import when a role has no matching position", async () => {
    fetchApplications.mockResolvedValue([
      makeApplication("a@example.com", {
        firstChoiceRole: "Project Lead",
        roleSpecificQuestions: [{ role: "Project Lead", questions: [] }],
      }),
    ]);

    await expect(service.populateApplicantRecords("Fall 2023")).rejects.toThrow(
      "Project Lead",
    );
    expect(Applicant.bulkCreate).not.toHaveBeenCalled();
  });

  it("rejects the whole import when an application cannot be parsed", async () => {
    fetchApplications.mockResolvedValue([
      makeApplication("a@example.com"),
      makeApplication("", {}),
    ]);

    await expect(service.populateApplicantRecords("Fall 2023")).rejects.toThrow(
      "Failed to parse 1 application",
    );
    expect(Applicant.bulkCreate).not.toHaveBeenCalled();
  });

  it("rejects a blank term without calling Firebase", async () => {
    await expect(service.populateApplicantRecords("  ")).rejects.toThrow(
      "term is required",
    );
    expect(fetchApplications).not.toHaveBeenCalled();
  });
});
