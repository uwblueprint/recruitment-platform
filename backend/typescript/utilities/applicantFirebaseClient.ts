import * as firebaseAdmin from "firebase-admin";
import fetch from "node-fetch";

import { FirebaseApplication } from "../types";
import { getErrorMessage } from "./errorUtils";
import logger from "./logger";

const Logger = logger(__filename);

const DEFAULT_APPLICATIONS_PATH = "studentApplications";

type ApplicantFirebaseConfig = {
  accessToken: string;
  databaseUrl: string;
  applicationsPath: string;
};

// The applicant data lives in the UWBlueprint Firebase project (managed by
// infra@uwblueprint.org), separate from the project used for platform auth, so
// it gets its own service account. We read it over the Realtime Database REST
// API because firebase-admin@9's bundled `database()` module fails to load
// alongside the installed @firebase/database.
const getConfig = async (): Promise<ApplicantFirebaseConfig> => {
  const {
    APPLICANT_FIREBASE_PROJECT_ID,
    APPLICANT_FIREBASE_CLIENT_EMAIL,
    APPLICANT_FIREBASE_PRIVATE_KEY,
    APPLICANT_FIREBASE_DATABASE_URL,
    APPLICANT_FIREBASE_APPLICATIONS_PATH,
  } = process.env;
  if (
    !APPLICANT_FIREBASE_PROJECT_ID ||
    !APPLICANT_FIREBASE_CLIENT_EMAIL ||
    !APPLICANT_FIREBASE_PRIVATE_KEY ||
    !APPLICANT_FIREBASE_DATABASE_URL
  ) {
    throw new Error(
      "Applicant Firebase is not configured. Set APPLICANT_FIREBASE_PROJECT_ID, " +
        "APPLICANT_FIREBASE_CLIENT_EMAIL, APPLICANT_FIREBASE_PRIVATE_KEY and " +
        "APPLICANT_FIREBASE_DATABASE_URL.",
    );
  }

  const credential = firebaseAdmin.credential.cert({
    projectId: APPLICANT_FIREBASE_PROJECT_ID,
    clientEmail: APPLICANT_FIREBASE_CLIENT_EMAIL,
    privateKey: APPLICANT_FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  });
  const { access_token: accessToken } = await credential.getAccessToken();

  return {
    accessToken,
    databaseUrl: APPLICANT_FIREBASE_DATABASE_URL.replace(/\/+$/, ""),
    applicationsPath: (
      APPLICANT_FIREBASE_APPLICATIONS_PATH || DEFAULT_APPLICATIONS_PATH
    ).replace(/^\/+|\/+$/g, ""),
  };
};

type ApplicationsByKey = Record<string, FirebaseApplication | null> | null;

const requestApplications = async (
  { accessToken, databaseUrl, applicationsPath }: ApplicantFirebaseConfig,
  query: string,
): Promise<{ status: number; body: string }> => {
  const response = await fetch(
    `${databaseUrl}/${applicationsPath}.json${query}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return { status: response.status, body: await response.text() };
};

/**
 * Fetch every application submitted for the given term (e.g. "Fall 2023")
 * from the UWBlueprint Firebase Realtime Database.
 *
 * Queries by `term` when the database has an `.indexOn: "term"` rule for the
 * applications path; otherwise downloads the whole node and filters locally.
 */
export const fetchApplicationsByTerm = async (
  term: string,
): Promise<FirebaseApplication[]> => {
  try {
    const config = await getConfig();

    const indexedQuery = `?orderBy=${encodeURIComponent(
      '"term"',
    )}&equalTo=${encodeURIComponent(JSON.stringify(term))}`;
    let { status, body } = await requestApplications(config, indexedQuery);

    if (status === 400 && body.includes("Index not defined")) {
      Logger.warn(
        `No ".indexOn": "term" rule at /${config.applicationsPath}; downloading all applications and filtering locally.`,
      );
      ({ status, body } = await requestApplications(config, ""));
    }
    if (status !== 200) {
      throw new Error(
        `Firebase request failed with status ${status}: ${body.slice(0, 200)}`,
      );
    }

    const data: ApplicationsByKey = JSON.parse(body);
    return Object.values(data ?? {}).filter(
      (application): application is FirebaseApplication =>
        application?.term === term,
    );
  } catch (error: unknown) {
    Logger.error(
      `Failed to fetch applications for term = ${term} from Firebase. Reason = ${getErrorMessage(
        error,
      )}`,
    );
    throw error;
  }
};

export default fetchApplicationsByTerm;
