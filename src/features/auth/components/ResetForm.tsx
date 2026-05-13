"use client";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { validators } from "@/src/constants/validation";
import { useResetPasswordMutation } from "@/src/store/services/api/donorAuthApi";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface ResetFormProps {
    token:string
}
interface FormData {
  password: string;
  confirmPassword: string;
}
const ResetForm = ({token}:ResetFormProps) => {
  
  const [formData, setFormData] = useState<FormData>({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({
    password: "",
    confirmPassword: "",
  });
  const [resetPassword,{isLoading}]=useResetPasswordMutation()
  const router=useRouter()
  const handleResetPassword=async(formData:FormData)=>{
    const {password,confirmPassword}=formData
    const passwordError=validators.password(password)
    const confirmPasswordError=validators.password(confirmPassword)
    if(passwordError){
        setError((prev)=>({...prev,password:passwordError}))
    }
    else{
        setError((prev)=>({...prev,password:""}))
    }
    if(confirmPasswordError){
        setError((prev)=>({...prev,confirmPassword:confirmPasswordError}))
    }
    else{
        setError((prev)=>({...prev,confirmPassword:""}))
    }
      if(password.trim()!==confirmPassword.trim()){
        setError((prev)=>({...prev,confirmPassword:"Password doesn't match"}))
        return
      }
      try {
        await resetPassword({token,body:{password}}).unwrap()
        toast.success("Password updated successfully")
        router.replace("/sign-in")
      } catch (error) {
        console.log("Password reset failed",error);
        toast.error("Something went wrong")
      }
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex w-xl flex-col space-y-7 rounded-2xl bg-white px-7 py-10 items-center">
        <h2 className="text-2xl font-extrabold font-secondaryText">
          Reset Password
        </h2>
        <Input
          value={formData.password}
          onChange={(e) => {
            setFormData((prev) => {
              return { ...prev, password: e.target.value };
            });
          }}
          label="New Password"
          placeholder="Enter your new password"
          type="password"
          error={error.password}
        />
        <Input
          value={formData.confirmPassword}
          onChange={(e) => {
            setFormData((prev) => {
              return { ...prev, confirmPassword: e.target.value };
            });
          }}
          label="Confirm Password"
          placeholder="Confirm your new password"
          type="password"
          error={error.confirmPassword}
        />
        <Button
        onClick={()=>{
          handleResetPassword(formData)}}
          text="Reset Password"
          disabled={formData?.confirmPassword == "" || formData?.password == ""||isLoading}
        />
      </div>
    </div>
  );
};

export default ResetForm;
