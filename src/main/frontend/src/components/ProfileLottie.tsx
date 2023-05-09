import Lottie from "react-lottie";
import animationData from "profile.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function ProfileLottie() {
  return (
    <Lottie
      options={defaultOptions}
      height={300}
      width={300}
      isClickToPauseDisabled={true}
    ></Lottie>
  );
}
