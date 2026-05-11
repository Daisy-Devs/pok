import { useDonorGoogleAuthMutation } from "@/src/store/services/api/donorAuthApi";
import { loggedIn } from "@/src/store/services/slice/authSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

/**
 * useGoogleAuth
 *
 * A hook that allows the user to sign in with Google
 *
 * @returns An object with the following properties:
 *   - googleSignInSuccessful: A function that signs in with Google
 *   - isGoogleLoading: A boolean indicating whether Google sign-in is in progress
 *   - isGoogleError: A boolean indicating whether Google sign-in failed
 */

export const useGoogleAuth = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [donorGoogleAuth, { isLoading, error }] = useDonorGoogleAuthMutation();

  const googleAuthSuccessful = async (token: string | undefined) => {
    if (!token) {
      toast.error("Google authentication failed: no token received.");
      return;
    }

    try {
      const res = await donorGoogleAuth({ token });
      if(res.error){
        toast.error("Google authentication failed: "+res.error.data.message);        
      return;
      }
      toast.success("Google authentication successful");
      console.log("ress", res);
      router.replace("/");

      dispatch(
        loggedIn({
          name: res.data.data.name,
          email: res.data.data.email,
          role: "Donor",
        }),
      );
    } catch (err) {
      console.log("Google auth failed:", error);
      toast.error("Google authentication failed.");
    }
  };

  return {
    googleAuthSuccessful,
    isGoogleLoading: isLoading,
  };
};
