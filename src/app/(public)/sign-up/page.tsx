"use client";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Link from "next/link";
import React, { useState } from "react";
import { nomenclature } from "@/src/constants/nomenclature";
import { useRouter } from "next/navigation";
import { useDonorSignUpMutation } from "@/src/store/services/api/donorAuthApi";
import { toast } from "sonner";
import { useGoogleAuth } from "@/src/features/auth/hooks/useGoogleAuth";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";
import { validators } from "@/src/constants/validation";



export default function SignUp() {
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
  }>({});

  const router = useRouter();
  const [donorSignUp, { isLoading, error }] = useDonorSignUpMutation();
  const { googleAuthSuccessful, isGoogleLoading } = useGoogleAuth();
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = Object.fromEntries(
      Object.entries(signUpData).map(([key, value]) => [
        key,
        validators[key as keyof typeof validators](value),
      ]),
    );

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const handleSignUp = () => {
    if (!validate()) return;
    donorSignUp(signUpData)
      .unwrap()
      .then((res) => {
        toast.success("Sign up successful! Please sign in to continue.");
        console.log(res);
        router.push("/sign-in");
      })
      .catch((err) => {
        console.log("Error during sign up:", err, error, signUpData);
        toast.error(`Sign up failed.${err?.data ? ` Reason: ${err.data}. ` : ""}`);
      });
  };
  return (
    <div className="grid min-h-screen  overflow-hidden grid-cols-1 lg:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="relative hidden lg:block">
        <img
          src="/Auth/InspiringVisual.jpg"
          alt="visual"
          className="absolute inset-0 h-full w-full object-cover"
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
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Create Account
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              Join our community of impactful donors today.
            </p>
          </div>

          {/* FORM */}
          <div className="space-y-4">
            <Input
              size={"lg"}
              variant="outline"
              value={signUpData.name}
              onChange={(e) => {
                setSignUpData((prev) => {
                  return { ...prev, name: e.target.value };
                });
              }}
              placeholder={nomenclature.ENTER_FULL_NAME}
              label="Full Name"
            />

            <Input
              variant="outline"
              value={signUpData.email}
              onChange={(e) => {
                setSignUpData((prev) => {
                  return { ...prev, email: e.target.value };
                });
              }}
              placeholder={nomenclature.ENTER_EMAIL}
              label="Email Address"
              size="lg"
              error={errors.email}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                variant="outline"
                value={signUpData.phone}
                onChange={(e) => {
                  setSignUpData((prev) => {
                    return { ...prev, phone: e.target.value };
                  });
                }}
                placeholder={nomenclature.ENTER_PHONE}
                label="Phone Number"
                size="lg"
                error={errors.phone}
              />
              <Input
                variant="outline"
                value={signUpData.password}
                onChange={(e) => {
                  setSignUpData((prev) => {
                    return { ...prev, password: e.target.value };
                  });
                }}
                type={showPassword ? "text" : "password"}
                placeholder={nomenclature.ENTER_PASSWORD}
                label="Password"
                size="lg"
                error={errors.password}
                rightElement={
                  signUpData.password && (
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
          </div>

          {/* BUTTON */}
          <div className="flex justify-center">
            <Button
              variant="blue"
              disabled={
                isLoading ||
                signUpData.name == "" ||
                signUpData.email == "" ||
                signUpData.phone == "" ||
                signUpData.password == "" ||
                isGoogleLoading
              }
              size="lg"
              text={isLoading ? nomenclature.SIGNING_UP : nomenclature.SIGN_UP}
              onClick={() => {
                handleSignUp();
              }}
            />
          </div>

          {/* SOCIAL LOGIN */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-gray-300" />
              <p className="text-sm text-gray-500 text-center">Social Logins</p>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
            <div className="flex justify-center gap-4 flex-wrap">
              <GoogleLogin
                size="large"
                text={"signup_with"}
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
                onError={() => toast.error("Google Sign-up failed.")}
              />
            </div>

            <p className="text-sm text-gray-500 text-center">
              Already have an account?{" "}
              <Link href="/sign-up" className="text-blue-500 hover:underline">
                {nomenclature.SIGN_IN}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
