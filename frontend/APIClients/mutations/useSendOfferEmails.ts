import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import {
  SendOfferEmailsDocument,
  type SendOfferEmailsMutation,
  type SendOfferEmailsMutationVariables,
} from "@/graphql/typeUtils";

export default function useSendOfferEmails() {
  const [mutate, { data, loading, error, reset }] = useMutation<
    SendOfferEmailsMutation,
    SendOfferEmailsMutationVariables
  >(SendOfferEmailsDocument, { context: { refreshAuth: true } });
  const sendOfferEmails = useCallback(
    async (ids: string[]) => {
      const uniqueIds = [...new Set(ids)];
      const { data } = await mutate({ variables: { ids: uniqueIds } });
      const result = data?.sendOfferEmails;
      if (
        !result ||
        result.failed.length > 0 ||
        result.sent.length !== uniqueIds.length
      ) {
        throw new Error("Some or all offer emails could not be sent.");
      }
    },
    [mutate]
  );
  return {
    reset,
    sendOfferEmails,
    data: data?.sendOfferEmails,
    loading,
    error,
  };
}
