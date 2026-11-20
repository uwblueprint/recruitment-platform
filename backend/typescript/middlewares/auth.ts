import { Request } from "express";
import {
  AuthenticationError,
  ForbiddenError,
  ExpressContext,
} from "apollo-server-express";
import { GraphQLResolveInfo } from "graphql";

import AuthService from "../services/implementations/authService";
import UserService from "../services/implementations/userService";
import IAuthService from "../services/interfaces/authService";
import { Role } from "../types";
import ReviewedApplicantRecord from "../models/reviewedApplicantRecord.model";

const authService: IAuthService = new AuthService(new UserService());

export const getAccessToken = (req: Request): string | null => {
  const authHeaderParts = req.headers.authorization?.split(" ");
  if (
    authHeaderParts &&
    authHeaderParts.length >= 2 &&
    authHeaderParts[0].toLowerCase() === "bearer"
  ) {
    return authHeaderParts[1];
  }
  return null;
};

/**
 * Use this when a resolver needs the caller's `users.id` itself (e.g. to
 * record `uploaded_user_id` on a new row). For yes/no auth checks, prefer
 * the `isAuthorizedBy*` middlewares below or in `graphql/index.ts`.
 */
export const getUserIdFromContext = async (
  context: ExpressContext,
): Promise<number> => {
  const accessToken = getAccessToken(context.req);
  if (!accessToken) {
    throw new AuthenticationError("Missing bearer access token.");
  }
  try {
    return await authService.getUserIdByAccessToken(accessToken);
  } catch {
    // Collapse all downstream failures (invalid/revoked token, missing user
    // row, Firebase outage) into a single user-facing message. The real
    // reason was already logged inside authService.
    throw new AuthenticationError(
      "Failed to resolve current user from access token.",
    );
  }
};

/* Determine if request is authorized based on accessToken validity and role of client */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const isAuthorizedByRole = (roles: Set<Role>) => {
  return async (
    resolve: (
      parent: any,
      args: { [key: string]: any },
      context: ExpressContext,
      info: GraphQLResolveInfo,
    ) => any,
    parent: any,
    args: { [key: string]: any },
    context: ExpressContext,
    info: GraphQLResolveInfo,
  ) => {
    const accessToken = getAccessToken(context.req);
    const authorized =
      accessToken && (await authService.isAuthorizedByRole(accessToken, roles));

    if (!authorized) {
      throw new AuthenticationError(
        "Failed authentication and/or authorization by role",
      );
    }

    return resolve(parent, args, context, info);
  };
};

/** Shared assignment rule for review middleware and the route-access query. */
export const canUserReviewApplicant = async (
  userId: number,
  applicantRecordId: string,
): Promise<boolean> => {
  const review = await ReviewedApplicantRecord.findOne({
    where: { applicant_record_id: applicantRecordId, reviewer_id: userId },
    attributes: ["applicant_record_id"],
  });
  return !!review;
};

/**
 * Requires the authenticated user to be assigned to the requested applicant.
 * Assignment is required unless admin read access is explicitly enabled.
 *
 * @param options.requireOwnReview Enable for operations targeting a specific review
 * (such as updates and conflict reports). In addition to assignment, requires
 * args.reviewerId to match the authenticated user, preventing one assigned
 * reviewer from modifying another reviewer's record. Leave false for shared
 * review-page reads that only provide args.applicantRecordId.
 * @param options.allowAdminRead Allow admins to read without an assignment. Never
 * bypasses assignment or ownership for operations requiring their own review.
 */
export const isAuthorizedForApplicantReview = ({
  requireOwnReview = false,
  allowAdminRead = false,
}: {
  requireOwnReview?: boolean;
  allowAdminRead?: boolean;
} = {}) => {
  return async (
    resolve: (
      parent: any,
      args: { [key: string]: any },
      context: ExpressContext,
      info: GraphQLResolveInfo,
    ) => any,
    parent: any,
    args: { [key: string]: any },
    context: ExpressContext,
    info: GraphQLResolveInfo,
  ) => {
    const userId = await getUserIdFromContext(context);
    const accessToken = getAccessToken(context.req);
    if (
      allowAdminRead &&
      !requireOwnReview &&
      accessToken &&
      (await authService.isAuthorizedByRole(
        accessToken,
        new Set(["Admin", "SuperAdmin"]),
      ))
    ) {
      return resolve(parent, args, context, info);
    }
    if (
      (requireOwnReview && String(args.reviewerId) !== String(userId)) ||
      !(await canUserReviewApplicant(userId, args.applicantRecordId))
    ) {
      throw new ForbiddenError("You are not assigned to this review.");
    }
    return resolve(parent, args, context, info);
  };
};

/* Determine if request for a user-specific resource is authorized based on accessToken
 * validity and if the userId that the token was issued to matches the requested userId
 * Note: userIdField is the name of the request parameter containing the requested userId */
export const isAuthorizedByUserId = (userIdField: string) => {
  return async (
    resolve: (
      parent: any,
      args: { [key: string]: any },
      context: ExpressContext,
      info: GraphQLResolveInfo,
    ) => any,
    parent: any,
    args: { [key: string]: any },
    context: ExpressContext,
    info: GraphQLResolveInfo,
  ) => {
    const accessToken = getAccessToken(context.req);
    const authorized =
      accessToken &&
      (await authService.isAuthorizedByUserId(accessToken, args[userIdField]));

    if (!authorized) {
      throw new AuthenticationError(
        "Failed authentication and/or authorization by userId",
      );
    }

    return resolve(parent, args, context, info);
  };
};

/* Determine if request for a user-specific resource is authorized based on accessToken
 * validity and if the email that the token was issued to matches the requested email
 * Note: emailField is the name of the request parameter containing the requested email */
export const isAuthorizedByEmail = (emailField: string) => {
  return async (
    resolve: (
      parent: any,
      args: { [key: string]: any },
      context: ExpressContext,
      info: GraphQLResolveInfo,
    ) => any,
    parent: any,
    args: { [key: string]: any },
    context: ExpressContext,
    info: GraphQLResolveInfo,
  ) => {
    const accessToken = getAccessToken(context.req);
    const authorized =
      accessToken &&
      (await authService.isAuthorizedByEmail(accessToken, args[emailField]));

    if (!authorized) {
      throw new AuthenticationError(
        "Failed authentication and/or authorization by email",
      );
    }

    return resolve(parent, args, context, info);
  };
};
