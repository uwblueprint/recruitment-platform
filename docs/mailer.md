# Mailer

The backend sends email through [Nodemailer](https://nodemailer.com/) using a Gmail
account with OAuth2. The service lives in
`backend/typescript/services/implementations/emailService.ts` and supports single
(`sendEmail`) and bulk (`sendBulkEmail`) sends. Email bodies are rendered from HTML
template files with [Handlebars](https://handlebarsjs.com/).

## Configuration

The transport is configured in `backend/typescript/nodemailer.config.ts` from four
environment variables (set in the root `.env`, distributed via `update_secret_files.py`):

| Variable | Description |
| --- | --- |
| `MAILER_USER` | Gmail address the emails are sent from |
| `MAILER_CLIENT_ID` | Google Cloud OAuth client ID |
| `MAILER_CLIENT_SECRET` | Google Cloud OAuth client secret |
| `MAILER_REFRESH_TOKEN` | OAuth2 refresh token authorized for the Gmail scope |

To generate credentials for a new sender account:

1. In [Google Cloud Console](https://console.cloud.google.com/), create (or reuse) a
   project and create an **OAuth client ID** (type "Web application") under
   APIs & Services → Credentials. Add `https://developers.google.com/oauthplayground`
   as an authorized redirect URI (in the "Authorized redirect URIs" section, not
   "Authorized JavaScript origins").
2. In the [OAuth 2.0 Playground](https://developers.google.com/oauthplayground):
   click the gear icon, check "Use your own OAuth credentials", and paste the client
   ID/secret. Authorize the scope `https://mail.google.com/` while signed in as the
   sender Gmail account, then exchange the authorization code for a **refresh token**
   (the value starting with `1//`).
3. Set the four `MAILER_*` variables and recreate the backend container with
   `docker compose up -d` (a plain `docker restart` does **not** reload `.env`).

> **`invalid_grant` errors:** if sending fails with `invalid_grant: Bad Request`, the
> refresh token is expired or revoked. The usual cause is the OAuth consent screen
> being in "Testing" publishing status, which makes Google expire refresh tokens
> after **7 days** — switch it to "In production" and generate a new refresh token
> via the OAuth Playground (steps above). While in Testing mode, the sender account
> must also be added under "Test users" or authorization fails with
> `Error 403: access_denied`.

To check whether the configured refresh token is valid without involving the app:

```bash
source <(grep "^MAILER_" .env | sed 's/^/export /')
curl -s -X POST https://oauth2.googleapis.com/token \
  -d grant_type=refresh_token \
  -d client_id="$MAILER_CLIENT_ID" \
  -d client_secret="$MAILER_CLIENT_SECRET" \
  -d refresh_token="$MAILER_REFRESH_TOKEN"
```

A valid token returns an `access_token` JSON blob; a dead one returns `invalid_grant`.

> **Sending limits:** Gmail allows roughly 500 recipients/day for consumer accounts and
> 2,000/day for Google Workspace accounts. If bulk volume outgrows this, swap the
> transport in `emailService.ts` for a dedicated provider (SES/SendGrid/Resend) — the
> `IEmailService` interface keeps the change contained.

## Sending templated email

Templates are plain HTML files with `{{placeholder}}` expressions in
`backend/typescript/emails/templates/`, compiled and cached by
`backend/typescript/emails/index.ts`. Each email type exposes a typed builder, e.g.:

```ts
import { buildRejectionEmail } from "../../emails";

const { subject, html } = buildRejectionEmail({
  firstName: "Tracy",
  position: "Product Designer",
  term: "Fall 2026",
});
await emailService.sendEmail("tracy@example.com", subject, html);
```

### Bulk sending

`sendBulkEmail` sends in batches of 10 concurrent messages and never rejects for
individual failures; it returns `{ sent, failed }` so callers can log or retry:

```ts
const { sent, failed } = await emailService.sendBulkEmail(
  applicants.map((applicant) => {
    const { subject, html } = buildRejectionEmail({ ... });
    return { to: applicant.email, subject, htmlBody: html };
  }),
);
```

Bulk rejection emails are wired up this way in
`ApplicantRecordService.bulkUpdateApplicantRecords`: when records are bulk-updated to
`REJECTED` (the review dashboard's "Send Rejection" flow), rejection emails are sent
after the status update commits. Email failures are logged and never roll back the
status change.

## Adding a new email type

1. Add `backend/typescript/emails/templates/<name>.html` using `{{placeholders}}`.
2. Add a typed builder in `backend/typescript/emails/index.ts`:

   ```ts
   export type InterviewEmailContext = { firstName: string; ... };

   export const buildInterviewEmail = (
     context: InterviewEmailContext,
   ): EmailContent => {
     return {
       subject: "...",
       html: getTemplate("interview")(context),
     };
   };
   ```

3. Call the builder and pass the result to `sendEmail`/`sendBulkEmail`.

Templates are copied into `build/` by the `postinstall` script
(`tsc && cp -R emails/templates build/emails/`), so they work in both the ts-node dev
server and the compiled production build.
