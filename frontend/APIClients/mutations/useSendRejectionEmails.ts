import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import {
  SendRejectionEmailsDocument,
  type SendRejectionEmailsMutation,
  type SendRejectionEmailsMutationVariables,
} from "@/graphql/typeUtils";

export default function useSendRejectionEmails() {
  const [mutate, { data, loading, error, reset }] = useMutation<
    SendRejectionEmailsMutation,
    SendRejectionEmailsMutationVariables
  >(SendRejectionEmailsDocument, { context: { refreshAuth: true } });
  const sendRejectionEmails = useCallback(
    async (ids: string[]) => {
      const uniqueIds = [...new Set(ids)];
      const { data } = await mutate({ variables: { ids: uniqueIds } });
      const result = data?.sendRejectionEmails;
      if (
        !result ||
        result.failed.length > 0 ||
        result.sent.length !== uniqueIds.length
      ) {
        throw new Error("Some or all rejection emails could not be sent.");
      }
    },
    [mutate]
  );
  return {
    reset,
    sendRejectionEmails,
    data: data?.sendRejectionEmails,
    loading,
    error,
  };
}
