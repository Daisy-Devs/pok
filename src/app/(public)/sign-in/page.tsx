"use client";

import Link from "next/link";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { nomenclature } from "@/src/constants/nomenclature";
import { useState } from "react";
import {
  useDonorSignInMutation,
  useForgotPasswordMutation,
} from "@/src/store/services/api/donorAuthApi";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { loggedIn } from "@/src/store/services/slice/authSlice";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleAuth } from "@/src/features/auth/hooks/useGoogleAuth";
import { Eye, EyeOff } from "lucide-react";
import { validators } from "@/src/constants/validation";
import Image from "next/image";
import { cookies } from "next/headers";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [donorSignIn, { isLoading }] = useDonorSignInMutation();
  const { googleAuthSuccessful, isGoogleLoading } = useGoogleAuth();
  const [forgotPassword, { isLoading: forgotPasswordLoading }] =
    useForgotPasswordMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const validate = () => {
    const newErrors = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        validators[key as keyof typeof validators](value),
      ]),
    );
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const handleSignIn = () => {
    if (!validate()) return;
    donorSignIn(formData)
      .unwrap()
      .then(async(res) => {
        console.log("Sign-in successful", res);
        toast.success("Sign-in successful!");
        dispatch(
          loggedIn({
            name: res.data.userObj.name,
            email: res.data.userObj.email,
            role: "Donor",
            id: res.data.userObj._id,
          }),
        );
        const cookieStore = await cookies();

        cookieStore.set("role", "donor", {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24,
        });
        router.replace("/");
      })
      .catch((error) => {
        console.log("Sign-in failed:", error);
        toast.error(`Sign-in failed. Reason: ${error?.data}`);
      });
  };

  return (
    <div className="  grid min-h-screen overflow-hidden grid-cols-1 lg:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="relative hidden lg:block h-235 w-full">
        <Image
          src="/InspiringVisual.jpg"
          alt="visual"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-br from-indigo-900/70 via-blue-800/60 to-indigo-600/60" />

        <div className="relative z-10 flex h-full flex-col justify-center px-6 lg:px-12 text-white space-y-4">
          <h1 className="text-7xl sm:text-5xl font-bold leading-tight">
            Transform the world through{" "}
            <span className="text-green-400">crypto ProofOfKindness</span>
          </h1>

          <p className="max-w-xl text-sm lg:text-base text-gray-200">
            Join the next generation of global giving. Secure, transparent, and
            private crypto contribution to vetted causes worldwide.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-start lg:items-center justify-center px-4 sm:px-6 lg:px-10 py-6 lg:py-0">
        <div className="w-full max-w-xl space-y-4 sm:space-y-5 lg:space-y-6 max-h-screen">
          {/* HEADER */}
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Sign In
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              Continue your impact journey.
            </p>
          </div>

          {/* FORM */}
          <div className="space-y-4">
            <Input
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              variant="outline"
              placeholder={nomenclature.ENTER_EMAIL}
              label="Email"
              size={"lg"}
              error={errors.email}
            />

            <Input
              oppositeLabel={
                <button
                  type="button"
                  onClick={() => {
                    console.log("forgot");
                    try {
                      forgotPassword({ email: formData.email }).unwrap();
                      toast.success("Reset link has been sent to your email.");
                    } catch (error) {
                      console.log(error);

                      toast.error("something went wrong");
                    }
                  }}
                  disabled={
                    formData.email === "" || !!validators.email(formData.email)
                  }
                  className="bg-transparent text-primary text-xs font-bold click:bg-transparent hover:bg-transparent hover:cursor-pointer disabled:text-muted disabled:cursor-not-allowed"
                >
                  <span>{nomenclature.FORGOT}</span>
                </button>
              }
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              variant="outline"
              type={showPassword ? "text" : "password"}
              placeholder={nomenclature.ENTER_PASSWORD}
              label="Password"
              size={"lg"}
              error={errors.password}
              rightElement={
                formData.password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )
              }
            />
          </div>

          {/* BUTTON */}
          <div className="flex justify-center">
            <Button
              variant="blue"
              size="lg"
              text={isLoading ? nomenclature.SIGNING_IN : nomenclature.SIGN_IN}
              disabled={
                isLoading ||
                formData.email == "" ||
                formData.password == "" ||
                isGoogleLoading
              }
              onClick={() => {
                handleSignIn();
              }}
            />
          </div>

          {/* SOCIAL LOGIN */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-300" />
              <p className="text-sm text-gray-500 text-center">Social Logins</p>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
            <div className="flex justify-center gap-4 flex-wrap">
              <GoogleLogin
                size="large"
                text={"signin_with"}
                logo_alignment="center"
                shape="rectangular"
                onSuccess={(credentialResponse) => {
                  if (!credentialResponse.credential) {
                    toast.error("No credential returned from Google.");
                    return;
                  }
                  // credentialResponse.credential IS the id_token your backend expects
                  googleAuthSuccessful(credentialResponse?.credential);
                }}
                onError={() => toast.error("Google Sign-in failed.")}
              />
            </div>
            <p className="text-sm text-gray-500 text-center">
              {`Don't have an accoubt yet? `}
              <Link href="/sign-up" className="text-blue-500 hover:underline">
                Sign Up today
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
