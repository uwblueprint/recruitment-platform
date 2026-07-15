import { BulkEmailMessage, BulkEmailResult } from "../../types";

interface IEmailService {
  /**
   * Send email
   * @param to recipient's email
   * @param subject email subject
   * @param htmlBody email body as html
   * @throws Error if email was not sent successfully
   */
  sendEmail(to: string, subject: string, htmlBody: string): Promise<void>;

  /**
   * Send many emails, continuing past per-recipient failures
   * @param messages emails to send
   * @returns recipients that were sent successfully and recipients that
   * failed, with the failure reason
   */
  sendBulkEmail(messages: BulkEmailMessage[]): Promise<BulkEmailResult>;
}

export default IEmailService;
