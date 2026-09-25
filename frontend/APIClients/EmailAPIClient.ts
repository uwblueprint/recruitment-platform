import { client } from "@/client";
import {
  SendRejectionEmailsDocument,
  type SendRejectionEmailsMutation,
  type SendRejectionEmailsMutationVariables,
} from "@/graphql/typeUtils";

import BaseAPIClient from "./BaseAPIClient";

class EmailAPIClient {
  static async sendRejectionEmails(ids: string[]): Promise<void> {
    await BaseAPIClient.handleAuthRefresh();
    const uniqueIds = [...new Set(ids)];
    const { data } = await client.mutate<
      SendRejectionEmailsMutation,
      SendRejectionEmailsMutationVariables
    >({
      mutation: SendRejectionEmailsDocument,
      variables: { ids: uniqueIds },
    });
    const result = data?.sendRejectionEmails;
    if (!result || result.failed.length > 0 || result.sent.length !== uniqueIds.length) {
      throw new Error("Some or all rejection emails could not be sent.");
    }
  }
}

export default EmailAPIClient;
