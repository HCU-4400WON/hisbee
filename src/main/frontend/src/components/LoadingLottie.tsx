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

export default function LoadingLottie({ isPost }: any) {
  return (
    <div
      className={`${
        isPost ? "bg-opacity-30 fixed" : "absolute"
      } z-[30] top-0 left-0 w-full h-[1200px] justify-center py-[200px] flex bg-white `}
    >
      <div className="z-[100] opacity-100">
        <Lottie
          options={defaultOptions}
          height={300}
          width={300}
          isClickToPauseDisabled={true}
        ></Lottie>
      </div>
    </div>
  );
}
