import * as firebaseAdmin from "firebase-admin";
import { ExpressContext, AuthenticationError } from "apollo-server-express";

import UserService from "../services/implementations/userService";
import { getAccessToken } from "../middlewares/auth";

const userService = new UserService();

/**
 * Resolve the numeric `users.id` of the caller from the Bearer access token
 * on the GraphQL context's express request. Mirrors the verification path
 * used by `authService.isAuthorizedByUserId` (firebase verifyIdToken +
 * `getUserIdByAuthId` lookup) but exposed for resolvers that need the id
 * itself (e.g. to record `uploaded_user_id` on a new row) rather than just
 * an authorization check.
 *
 * @throws AuthenticationError if no token is present, the token is invalid,
 *   or the auth id has no corresponding user row.
 */
export async function getUserIdFromContext(
  context: ExpressContext,
): Promise<number> {
  const accessToken = getAccessToken(context.req);
  if (!accessToken) {
    throw new AuthenticationError("Missing bearer access token.");
  }
  try {
    const decoded = await firebaseAdmin.auth().verifyIdToken(accessToken, true);
    const userId = await userService.getUserIdByAuthId(decoded.uid);
    return Number(userId);
  } catch (error) {
    throw new AuthenticationError(
      "Failed to resolve current user from access token.",
    );
  }
}

export default getUserIdFromContext;
