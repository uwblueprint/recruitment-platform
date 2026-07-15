export type NodemailerConfig = {
  service: "gmail";
  auth: {
    type: "OAuth2";
    user: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  };
};

export type BulkEmailMessage = {
  to: string;
  subject: string;
  htmlBody: string;
};

export type BulkEmailResult = {
  sent: string[];
  failed: { to: string; error: string }[];
};
