import ApplicantRecord from "../../../models/applicantRecord.model";
import ApplicantRecordService from "../applicantRecordService";
import IEmailService from "../../interfaces/emailService";

jest.mock("../../../models", () => ({ sequelize: {} }));
jest.mock("../../../models/applicant.model", () => ({
  __esModule: true,
  default: {},
}));
jest.mock("../../../models/applicantRecord.model", () => ({
  __esModule: true,
  default: { findAll: jest.fn() },
}));

const makeRecord = (id: string, status: string) => ({
  id,
  status,
  position: "Project Developer",
  applicant: {
    first_name: `First${id}`,
    email: `${id}@example.com`,
    term: "Fall 2026",
  },
});

describe("ApplicantRecordService status emails", () => {
  const sendBulkEmail = jest.fn();
  const findAll = ApplicantRecord.findAll as jest.Mock;
  let service: ApplicantRecordService;

  beforeEach(() => {
    jest.resetAllMocks();
    sendBulkEmail.mockResolvedValue({ sent: ["a@example.com"], failed: [] });
    service = new ApplicantRecordService(({
      sendBulkEmail,
    } as unknown) as IEmailService);
  });

  describe("sendOfferEmails", () => {
    it("sends an offer email to each offered applicant", async () => {
      findAll.mockResolvedValue([makeRecord("1", "OFFERED")]);

      await service.sendOfferEmails(["1", "1"]);

      expect(findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: ["1"] } }),
      );
      const [messages] = sendBulkEmail.mock.calls[0];
      expect(messages).toHaveLength(1);
      expect(messages[0].to).toBe("1@example.com");
      expect(messages[0].subject).toBe("Your UW Blueprint Fall 2026 Offer");
      expect(messages[0].htmlBody).toContain("First1");
      expect(messages[0].htmlBody).toContain("Project Developer");
    });

    it("rejects without sending when a record is not offered", async () => {
      findAll.mockResolvedValue([makeRecord("1", "INTERVIEWED")]);

      await expect(service.sendOfferEmails(["1"])).rejects.toThrow(
        /require offered applicant records/,
      );
      expect(sendBulkEmail).not.toHaveBeenCalled();
    });

    it("rejects when a record is missing", async () => {
      findAll.mockResolvedValue([]);

      await expect(service.sendOfferEmails(["1"])).rejects.toThrow(/not found/);
      expect(sendBulkEmail).not.toHaveBeenCalled();
    });

    it("rejects when no email service is configured", async () => {
      const unconfigured = new ApplicantRecordService();

      await expect(unconfigured.sendOfferEmails(["1"])).rejects.toThrow(
        /not configured/,
      );
    });
  });

  describe("sendRejectionEmails", () => {
    it("sends rejection emails only for rejected applicants", async () => {
      findAll.mockResolvedValue([makeRecord("1", "OFFERED")]);

      await expect(service.sendRejectionEmails(["1"])).rejects.toThrow(
        /require rejected applicant records/,
      );

      findAll.mockResolvedValue([makeRecord("1", "REJECTED")]);
      await service.sendRejectionEmails(["1"]);

      const [messages] = sendBulkEmail.mock.calls[0];
      expect(messages[0].subject).toBe(
        "Your UW Blueprint Fall 2026 Application",
      );
    });
  });
});
