import nodemailer, { Transporter } from "nodemailer";
import IEmailService from "../interfaces/emailService";
import {
  BulkEmailMessage,
  BulkEmailResult,
  NodemailerConfig,
} from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

// number of emails sent concurrently by sendBulkEmail
const BULK_EMAIL_BATCH_SIZE = 10;

class EmailService implements IEmailService {
  transporter: Transporter;

  sender: string;

  constructor(nodemailerConfig: NodemailerConfig, displayName?: string) {
    this.transporter = nodemailer.createTransport(nodemailerConfig);
    if (displayName) {
      this.sender = `${displayName} <${nodemailerConfig.auth.user}>`;
    } else {
      this.sender = nodemailerConfig.auth.user;
    }
  }

  async sendEmail(
    to: string,
    subject: string,
    htmlBody: string,
  ): Promise<void> {
    const mailOptions = {
      from: this.sender,
      to,
      subject,
      html: htmlBody,
    };

    try {
      return await this.transporter.sendMail(mailOptions);
    } catch (error: unknown) {
      Logger.error(`Failed to send email. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async sendBulkEmail(messages: BulkEmailMessage[]): Promise<BulkEmailResult> {
    const result: BulkEmailResult = { sent: [], failed: [] };

    for (let i = 0; i < messages.length; i += BULK_EMAIL_BATCH_SIZE) {
      const batch = messages.slice(i, i + BULK_EMAIL_BATCH_SIZE);
      // eslint-disable-next-line no-await-in-loop -- batches are intentionally sequential to bound concurrency
      const outcomes = await Promise.allSettled(
        batch.map((message) =>
          this.sendEmail(message.to, message.subject, message.htmlBody),
        ),
      );
      outcomes.forEach((outcome, index) => {
        if (outcome.status === "fulfilled") {
          result.sent.push(batch[index].to);
        } else {
          result.failed.push({
            to: batch[index].to,
            error: getErrorMessage(outcome.reason),
          });
        }
      });
    }

    if (result.failed.length > 0) {
      Logger.error(
        `Failed to send ${result.failed.length} of ${messages.length} bulk emails.`,
      );
    }
    return result;
  }
}

export default EmailService;
