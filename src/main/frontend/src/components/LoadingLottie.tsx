import Lottie from "react-lottie";
import animationData from "loading.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function LoadingLottie() {
  return (
    <div className="w-full h-[1200px] justify-center flex mt-[150px]">
      <Lottie
        options={defaultOptions}
        height={300}
        width={300}
        isClickToPauseDisabled={true}
      ></Lottie>
    </div>
  );
}
