import AuthAPIClient from "@/APIClients/AuthAPIClient";
import Button from "@/common/Button";
import { useAuthUserContext } from "@/contexts/AuthUserContext";
import { auth } from "@/utils/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const { setAuthenticatedUser } = useAuthUserContext();

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ hd: "uwblueprint.org" }); // only allow uwblueprint.org emails to sign in
      const res = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(res);
      const oauthIdToken = credential?.idToken;
      if (!oauthIdToken) {
        return;
      }

      const result = await AuthAPIClient.loginWithGoogle(oauthIdToken);
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);
      setAuthenticatedUser({
        id: result.id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        role: result.role,
        position: result.position,
      });
      await router.push("/admin");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-100 h-screen flex flex-col justify-center items-center bg-sky-100 overflow-hidden">
      <div className="container max-w-[36rem]">
        <div className="bg-white m-8 p-8 rounded-lg shadow-lg min-h-[18rem]">
          <Image
            src="/common/logo-blue.svg"
            alt="UW Blueprint logo"
            width={27}
            height={27}  
            priority
          />
          <div className="flex flex-col items-center">
            <h4 className="my-8 text-blue-100">Sign In</h4>
            <Button variant="secondary" onClick={signInWithGoogle}>
              <div className="flex space-around items-center gap-3">
                <Image
                  src="/common/google-logo.svg"
                  alt="Google logo"
                  width={24}
                  height={24}
                />
                <div>Continue with Google</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
