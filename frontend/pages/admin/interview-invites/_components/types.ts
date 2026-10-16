import type { InterviewInviteResult } from "@/graphql/typeUtils";

export type InterviewInvite = InterviewInviteResult;
export type Interviewee = InterviewInvite["interviewees"][number];
