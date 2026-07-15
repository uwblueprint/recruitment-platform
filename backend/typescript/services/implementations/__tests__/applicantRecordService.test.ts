import ApplicantRecordService from "../applicantRecordService";
import ApplicantRecord from "../../../models/applicantRecord.model";
import IEmailService from "../../interfaces/emailService";
import { BulkEmailMessage } from "../../../types";

const mockApplicantRecord = ({
  id: "record-1",
  position: "Product Designer",
  applicant: {
    first_name: "Tracy",
    last_name: "Chen",
    email: "tracy@test.com",
    term: "Fall 2026",
  },
} as unknown) as ApplicantRecord;

describe("applicantRecordService", () => {
  let applicantRecordService: ApplicantRecordService;
  let mockEmailService: IEmailService;

  beforeEach(() => {
    jest
      .spyOn(ApplicantRecord, "findAll")
      .mockResolvedValue([mockApplicantRecord]);
    mockEmailService = {
      sendEmail: jest.fn(),
      sendBulkEmail: jest.fn().mockResolvedValue({ sent: [], failed: [] }),
    };
    applicantRecordService = new ApplicantRecordService(mockEmailService);
  });

  it("sendRejectionEmails sends a templated email to each applicant", async () => {
    await applicantRecordService.sendRejectionEmails(["record-1"]);

    expect(mockEmailService.sendBulkEmail).toHaveBeenCalledTimes(1);
    const messages: BulkEmailMessage[] = (mockEmailService.sendBulkEmail as jest.Mock)
      .mock.calls[0][0];
    expect(messages).toHaveLength(1);
    expect(messages[0].to).toBe("tracy@test.com");
    expect(messages[0].subject).toBe("Your UW Blueprint Fall 2026 Application");
    expect(messages[0].htmlBody).toContain("Hi Tracy,");
    expect(messages[0].htmlBody).toContain("<strong>Product Designer</strong>");
  });

  it("sendRejectionEmails does not throw when no email service is configured", async () => {
    const serviceWithoutMailer = new ApplicantRecordService();

    await expect(
      serviceWithoutMailer.sendRejectionEmails(["record-1"]),
    ).resolves.not.toThrow();
  });

  it("sendRejectionEmails does not throw when fetching records fails", async () => {
    jest
      .spyOn(ApplicantRecord, "findAll")
      .mockRejectedValue(new Error("db error"));

    await expect(
      applicantRecordService.sendRejectionEmails(["record-1"]),
    ).resolves.not.toThrow();
    expect(mockEmailService.sendBulkEmail).not.toHaveBeenCalled();
  });
});
