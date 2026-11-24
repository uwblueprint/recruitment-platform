# Profile pictures

`UserDTO.photoUrl` returns the Google profile picture for a user's Blueprint email,
looked up in the Blueprint Google Workspace directory. Because it is keyed on the
email, a picture is available before the user has ever signed in through Firebase,
and a changed Google photo is picked up without a new sign-in.

The lookup lives in `backend/typescript/services/implementations/profilePhotoService.ts`
and is resolved lazily by the `UserDTO.photoUrl` field resolver, so it only runs for
queries that select `photoUrl`. Results are cached in memory (6h for a found photo,
15m for a miss or failure). Non-Blueprint emails, accounts with only the generated
default avatar, and any lookup failure resolve to `null`; the frontend
(`InterviewPartnerCard`) then falls back to the user's initials.

## Configuration

| Variable | Description |
| --- | --- |
| `GOOGLE_DIRECTORY_CLIENT_EMAIL` | Service account email |
| `GOOGLE_DIRECTORY_PRIVATE_KEY` | Service account private key (newlines may be escaped as `\n`) |
| `GOOGLE_DIRECTORY_IMPERSONATE_EMAIL` | Workspace user the service account acts as |

If any are unset, `photoUrl` is always `null` and the UI shows initials.

Setup requires a Workspace admin:

1. In Google Cloud, create a **dedicated** service account (don't reuse the Firebase Admin
   one, which has much broader access) and enable the **People API** on its project.
2. Find the service account's **client ID**. It is the numeric Unique ID, a ~21-digit
   number, not the email:
   - Google Cloud console → IAM & Admin → Service Accounts → the account → Details →
     **Unique ID**, or
   - the `client_id` field of a downloaded JSON key (create one under Keys → Add key →
     Create new key → JSON; the same file has `client_email` and `private_key`), or
   - `gcloud iam service-accounts describe <email> --format='value(uniqueId)'`.
3. In the Workspace Admin console, under Security → API controls → Domain-wide delegation
   → Add new, enter that client ID and the scope
   `https://www.googleapis.com/auth/directory.readonly`.
4. Set the three variables above and recreate the backend container with
   `docker compose up -d` (a plain `docker restart` does not reload `.env`).

The client ID is only used in step 3. The backend authenticates with the service account
email and private key, so there is no client ID env var. Existing `*_CLIENT_ID` variables
are unrelated: `MAILER_CLIENT_ID` is the mailer's OAuth client and
`FIREBASE_SVC_ACCOUNT_CLIENT_ID` is the platform auth service account.
