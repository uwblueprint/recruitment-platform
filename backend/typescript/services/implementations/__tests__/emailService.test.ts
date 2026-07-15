import nodemailer from "nodemailer";

import EmailService from "../emailService";
import { BulkEmailMessage, NodemailerConfig } from "../../../types";

jest.mock("nodemailer");

const nodemailerConfig: NodemailerConfig = {
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "recruitment@uwblueprint.org",
    clientId: "clientId",
    clientSecret: "clientSecret",
    refreshToken: "refreshToken",
  },
};

const buildMessages = (recipients: string[]): BulkEmailMessage[] => {
  return recipients.map((to) => ({
    to,
    subject: "subject",
    htmlBody: "<p>body</p>",
  }));
};

describe("emailService", () => {
  let sendMail: jest.Mock;
  let emailService: EmailService;

  beforeEach(() => {
    sendMail = jest.fn().mockResolvedValue(undefined);
    (nodemailer.createTransport as jest.Mock).mockReturnValue({ sendMail });
    emailService = new EmailService(
      nodemailerConfig,
      "UW Blueprint Recruitment",
    );
  });

  it("sendBulkEmail sends one email per message", async () => {
    const recipients = [...Array(25)].map(
      (_, index) => `applicant${index}@test.com`,
    );

    const result = await emailService.sendBulkEmail(buildMessages(recipients));

    expect(sendMail).toHaveBeenCalledTimes(25);
    expect(result.sent).toEqual(recipients);
    expect(result.failed).toHaveLength(0);
  });

  it("sendBulkEmail reports per-recipient failures without aborting", async () => {
    sendMail.mockImplementation(({ to }) =>
      to === "applicant1@test.com"
        ? Promise.reject(new Error("SMTP error"))
        : Promise.resolve(),
    );

    const result = await emailService.sendBulkEmail(
      buildMessages([
        "applicant0@test.com",
        "applicant1@test.com",
        "applicant2@test.com",
      ]),
    );

    expect(result.sent).toEqual(["applicant0@test.com", "applicant2@test.com"]);
    expect(result.failed).toEqual([
      { to: "applicant1@test.com", error: "SMTP error" },
    ]);
  });
});
