type Interviewee = {
  name: string;
  role: string;
};

type InterviewInvite = {
  id: string;
  interviewers: string[];
  interviewees: Interviewee[];
  interviewType: string
  calendlyLink: string;
  status: string;
};

export type { Interviewee, InterviewInvite };
