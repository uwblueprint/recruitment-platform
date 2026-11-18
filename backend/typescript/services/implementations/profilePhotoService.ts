import { JWT } from "google-auth-library";
import IProfilePhotoService from "../interfaces/IProfilePhotoService";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

const BLUEPRINT_EMAIL_DOMAIN = "@uwblueprint.org";
const DIRECTORY_SCOPE = "https://www.googleapis.com/auth/directory.readonly";
const SEARCH_DIRECTORY_URL =
  "https://people.googleapis.com/v1/people:searchDirectoryPeople";

// Photos rarely change, but a changed photo should show up within hours
const FOUND_TTL_MS = 6 * 60 * 60 * 1000;
// Misses and failures retry sooner so a new photo or a transient error heals
const MISSING_TTL_MS = 15 * 60 * 1000;

type CacheEntry = { photoUrl: string | null; expiresAt: number };

type DirectoryPerson = {
  emailAddresses?: { value?: string }[];
  photos?: { url?: string; default?: boolean }[];
};

type DirectorySearchResponse = { people?: DirectoryPerson[] };

const fetchPhotoUrl = async (
  client: JWT,
  email: string,
): Promise<string | null> => {
  try {
    const response = await client.request<DirectorySearchResponse>({
      url: SEARCH_DIRECTORY_URL,
      params: {
        query: email,
        readMask: "emailAddresses,photos",
        sources: "DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE",
        pageSize: 5,
      },
    });

    // The search is a prefix match, so require the exact address
    const person = response.data.people?.find((p) =>
      p.emailAddresses?.some((e) => e.value?.toLowerCase() === email),
    );
    // Skip the generated silhouette so the UI can show initials instead
    const photo = person?.photos?.find((p) => p.url && !p.default);
    return photo?.url ?? null;
  } catch (error: unknown) {
    Logger.error(
      `Failed to fetch profile picture for ${email}. Reason = ${getErrorMessage(
        error,
      )}`,
    );
    return null;
  }
};

/**
 * Looks up profile pictures in the Blueprint Google Workspace directory, so a
 * picture is available before the user has ever signed in through Firebase.
 *
 * Requires a service account with domain-wide delegation for the
 * directory.readonly scope, impersonating a Workspace user. Without the
 * GOOGLE_DIRECTORY_* env vars every lookup resolves to null.
 */
class ProfilePhotoService implements IProfilePhotoService {
  private cache = new Map<string, CacheEntry>();

  private inflight = new Map<string, Promise<string | null>>();

  private client: JWT | null;

  constructor() {
    const clientEmail = process.env.GOOGLE_DIRECTORY_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_DIRECTORY_PRIVATE_KEY;
    const subject = process.env.GOOGLE_DIRECTORY_IMPERSONATE_EMAIL;

    if (clientEmail && privateKey && subject) {
      this.client = new JWT({
        email: clientEmail,
        // env files store the key with escaped newlines
        key: privateKey.replace(/\\n/g, "\n"),
        scopes: [DIRECTORY_SCOPE],
        subject,
      });
    } else {
      this.client = null;
      Logger.warn(
        "GOOGLE_DIRECTORY_* env vars are not set; profile pictures are disabled",
      );
    }
  }

  async getPhotoUrl(email: string): Promise<string | null> {
    const key = email.trim().toLowerCase();
    if (!this.client || !key.endsWith(BLUEPRINT_EMAIL_DOMAIN)) {
      return null;
    }

    const cached = this.cache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.photoUrl;
    }

    // Several users on one page can share a partner; look each email up once
    const pending = this.inflight.get(key);
    if (pending) {
      return pending;
    }

    const lookup = fetchPhotoUrl(this.client, key)
      .then((photoUrl) => {
        this.cache.set(key, {
          photoUrl,
          expiresAt: Date.now() + (photoUrl ? FOUND_TTL_MS : MISSING_TTL_MS),
        });
        return photoUrl;
      })
      .finally(() => {
        this.inflight.delete(key);
      });
    this.inflight.set(key, lookup);
    return lookup;
  }
}

export default ProfilePhotoService;
