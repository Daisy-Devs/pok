import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface LottieHandlerProps {
  type:  "error";
  message?: string;
}

const LottieHandler = ({ type, message }: LottieHandlerProps) => {
  const animations = {
    error: "https://lottie.host/661b563c-aebb-40d7-a643-c5d177b973af/7biHZiK1YY.lottie",
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 w-full">
      <div className="w-64 h-64">
        <DotLottieReact src={animations.error} loop autoplay />
      </div>
      {message && (
        <p className="mt-4 text-gray-500 font-medium text-center">{message}</p>
      )}
    </div>
  );
};

export default LottieHandler;
