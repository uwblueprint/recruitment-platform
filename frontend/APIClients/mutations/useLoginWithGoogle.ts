import { useMutation } from "@apollo/client/react";
import {
  LoginWithGoogleDocument,
  type LoginWithGoogleMutation,
  type LoginWithGoogleMutationVariables,
} from "@/graphql/typeUtils";

export default function useLoginWithGoogle() {
  const [mutate, { data, loading, error, reset }] = useMutation<
    LoginWithGoogleMutation,
    LoginWithGoogleMutationVariables
  >(LoginWithGoogleDocument, { fetchPolicy: "no-cache" });

  return { mutate, data: data?.loginWithGoogle, loading, error, reset };
}
