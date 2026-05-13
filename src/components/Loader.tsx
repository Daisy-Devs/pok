import { DotLottieReact } from '@lottiefiles/dotlottie-react'

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center">
                    <DotLottieReact
                      src="/gif/Loading.lottie"
                      loop
                      autoplay
                      style={{ width: 200, height: 200 }}
                    />
                    <p className="text-xl font-extrabold text-primary mt-2">
                      LOADING
                    </p>
                  </div>
  )
}

export default Loader