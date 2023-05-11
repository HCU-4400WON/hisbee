// import Lottie from "react-lottie";
import animationData from "loading.json";
import Lottie, { useLottie } from "lottie-react";

export default function LoadingLottie({ isPost }: any) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div
      className={`${
        isPost ? "bg-opacity-30 fixed" : "absolute"
      } modal z-[30] w-full justify-center py-[200px] h-full flex bg-white `}
    >
      <div className="z-[100] opacity-100">
        <div className="w-[500px]">
          <Lottie animationData={animationData} />
        </div>
      </div>
    </div>
  );
}
