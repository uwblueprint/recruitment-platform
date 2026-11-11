# Applicant ingestion (UWBlueprint Firebase)

The `populateApplicantRecords(term: String!)` GraphQL mutation pulls every application
submitted for a term (e.g. `"Fall 2023"`) out of the UWBlueprint applicant Firebase
project and creates the matching `Applicant` and `ApplicantRecord` rows. Applicants
that already exist for that term (matched by email) are skipped, so it is safe to
re-run. If any application fails to parse, the whole call fails and nothing is written.

The code lives in:

- `backend/typescript/utilities/applicantFirebaseClient.ts` — fetches the applications
- `backend/typescript/utilities/applicantIngestUtils.ts` — parses an export into our schema
- `backend/typescript/services/implementations/applicantIngestionService.ts` — writes to the DB

## This is a different Firebase project from auth

The applicant data lives in the **UWBlueprint** Firebase project (`uw-blueprint`, managed
by infra@uwblueprint.org). Platform sign-in uses a separate Firebase project and the
`FIREBASE_*` variables. The two sets of credentials are independent, so ingestion has
its own `APPLICANT_FIREBASE_*` variables and its own service account.

## Configuration

Set these in the root `.env` (the one `docker-compose.yml` passes to `ts-backend`).

| Variable | Required | Description |
| --- | --- | --- |
| `APPLICANT_FIREBASE_PROJECT_ID` | Yes | Project ID of the applicant Firebase project (`project_id` in the service account key) |
| `APPLICANT_FIREBASE_CLIENT_EMAIL` | Yes | Service account email (`client_email` in the key) |
| `APPLICANT_FIREBASE_PRIVATE_KEY` | Yes | Service account private key (`private_key` in the key). Newlines may be escaped as `\n` |
| `APPLICANT_FIREBASE_DATABASE_URL` | Yes | Realtime Database URL, e.g. `https://<project>.firebaseio.com/`. A trailing slash is fine |
| `APPLICANT_FIREBASE_APPLICATIONS_PATH` | No | Node under the database root that holds the applications. Defaults to `studentApplications` |

If any required variable is missing, `populateApplicantRecords` fails with
`Applicant Firebase is not configured. Set APPLICANT_FIREBASE_PROJECT_ID, ...`.

### Getting the values

1. Ask the Internal Tools / infra team for access to the `uw-blueprint` Firebase project.
2. In the [Firebase console](https://console.firebase.google.com), open **Project settings
   → Service accounts → Generate new private key**. The downloaded JSON has the values:

   | `.env` variable | JSON field |
   | --- | --- |
   | `APPLICANT_FIREBASE_PROJECT_ID` | `project_id` |
   | `APPLICANT_FIREBASE_CLIENT_EMAIL` | `client_email` |
   | `APPLICANT_FIREBASE_PRIVATE_KEY` | `private_key` |

3. Copy the Realtime Database URL from **Build → Realtime Database** into
   `APPLICANT_FIREBASE_DATABASE_URL`.
4. Wrap `APPLICANT_FIREBASE_PRIVATE_KEY` in double quotes and keep it on one line with
   `\n` for newlines.
5. Recreate the backend container with `docker compose up -d`. A plain `docker restart`
   does not reload `.env`.

The key file is a secret. Do not commit it; `.env` is gitignored.

## Reading the data

The client reads the Realtime Database over its REST API with an access token from the
service account (the `database()` module bundled with `firebase-admin@9` does not load
alongside the installed `@firebase/database`).

It first queries by term (`orderBy="term"&equalTo="<term>"`). That needs an
`".indexOn": "term"` rule on the applications path. Without it, the client logs a
warning, downloads the whole node and filters by term locally, which works but is slower.
