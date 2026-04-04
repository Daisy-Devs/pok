"use client";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Link from "next/link";
import React, { useState } from "react";
import { nomenclature } from "@/src/constants/nomenclature";
import { useRouter } from "next/navigation";
import { useDonorSignUpMutation } from "@/src/store/services/donorAuthApi";
import { toast } from "sonner";

export default function SignUp() {
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const router = useRouter();
  const [donorSignUp, { isLoading, error }] = useDonorSignUpMutation();
  const handleSignUp = () => {
    donorSignUp(signUpData)
      .unwrap()
      .then((res) => {
        toast.success("Sign up successful! Please sign in to continue.");
        console.log(res);
        router.push("/sign-in");
      })
      .catch((err) => {
        console.log("Error during sign up:", err, error, signUpData);
        toast.error("Sign up failed. Please try again.");
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
              />
              <Input
                variant="outline"
                value={signUpData.password}
                onChange={(e) => {
                  setSignUpData((prev) => {
                    return { ...prev, password: e.target.value };
                  });
                }}
                type="password"
                placeholder={nomenclature.ENTER_PASSWORD}
                label="Password"
                size="lg"
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
                signUpData.password == ""
              }
              size="long"
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
              <Button
                onClick={() => {}}
                variant="grey"
                size="only_icon"
                leftImageSrc={"/Auth/google.svg"}
              />

              <Button
                variant="grey"
                size="only_icon"
                leftImageSrc={"/Auth/apple.svg"}
              />

              <Button
                variant="grey"
                size="only_icon"
                leftImageSrc={"/Auth/facebook.svg"}
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
