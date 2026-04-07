"use client";

import Link from "next/link";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { nomenclature } from "@/src/constants/nomenclature";
import { useState } from "react";
import {
  useDonorSignInMutation,
} from "@/src/store/services/donorAuthApi";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { loggedIn } from "@/src/store/services/slice/authSlice";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleAuth } from "@/src/features/auth/hooks/useGoogleAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [donorSignIn, { isLoading,error:erora }] = useDonorSignInMutation();
  const {googleAuthSuccessful,isGoogleLoading}= useGoogleAuth();
  const dispatch = useDispatch();
  const router = useRouter();


  const handleSignIn = () => {
    donorSignIn(formData)
      .unwrap()
      .then((res) => {
        console.log("Sign-in successful", res);
        toast.success("Sign-in successful!");
        dispatch(
          loggedIn({
            name: res.name,
            email: res.email,
            phone: res.phone,
            role: "Donor",
          }),
        );
        router.replace("/");
      })
      .catch((error) => {        
        console.log("Sign-in failed:", error);
        toast.error("Sign-in failed. ", error);
      });
  };

  return (
    <div className="  grid min-h-screen overflow-hidden grid-cols-1 lg:grid-cols-2">
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
            />

            <Input
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              variant="outline"
              type="password"
              placeholder={nomenclature.ENTER_PASSWORD}
              label="Password"
            />
          </div>

          {/* BUTTON */}
          <div className="flex justify-center">
            <Button
              variant="blue"
              size="long"
              text={isLoading ? nomenclature.SIGNING_IN : nomenclature.SIGN_IN}
              disabled={isLoading||formData.email==""||formData.password==""||isGoogleLoading}
              onClick={()=>{
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
