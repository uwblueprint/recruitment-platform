import { useMutation } from "@apollo/client/react";
import {
  LogoutDocument,
  type LogoutMutation,
  type LogoutMutationVariables,
} from "@/graphql/typeUtils";

export default function useLogout() {
  const [mutate, { data, loading, error, reset }] = useMutation<
    LogoutMutation,
    LogoutMutationVariables
  >(LogoutDocument, { fetchPolicy: "no-cache" });

  return { mutate, data: data?.logout, loading, error, reset };
}
