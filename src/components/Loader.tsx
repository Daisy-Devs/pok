import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Loader = () => {
  return (
    <div className="absolute inset-0 z-99 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md">
      {" "}
      <DotLottieReact
        src="/gif/Loading.lottie"
        loop
        autoplay
        style={{ width: 200, height: 200 }}
      />
      <p className="text-xl font-extrabold text-primary mt-2">LOADING</p>
    </div>
  );
};

export default Loader;
