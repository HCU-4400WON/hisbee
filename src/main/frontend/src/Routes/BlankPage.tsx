import { isLoginState, isSignupModalState } from "components/atom";
import LoadingAnimation from "components/LoadingAnimation";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSetRecoilState } from "recoil";

function BlankPage() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search);
  const setIsSignupModal = useSetRecoilState(isSignupModalState);

  const setIsLogin = useSetRecoilState(isLoginState);
  setIsLogin(true);

  localStorage.setItem("key", keyword.get("token") as any);

  const navigate = useNavigate();

  useEffect(() => {
    if (keyword.get("hasRegistered") === "true") {
      navigate("/");
    } else {
      setIsSignupModal(true);
      navigate("/");
      //   navigate("/signUp");
    }
  }, []);

  return (
    <div>
      <LoadingAnimation />
    </div>
  );
}

export default BlankPage;
