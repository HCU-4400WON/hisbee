import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import {
  isLoginModalState,
  isLoginState,
  isLogoutConfirmState,
  isPreventAlertState,
} from "./atom";

function PrivateRoute({ component: Component }: any) {
  const setIsLogin = useSetRecoilState(isLoginState);
  const setIsLoginModal = useSetRecoilState(isLoginModalState);
  //   console.log(authenticated);

  const setIsPreventAlertModal = useSetRecoilState(isPreventAlertState);

  const access = localStorage.getItem("key");

  useEffect(() => {
    if (!access) {
      // setIsLoginModal(true);
      // alert("로그인 후 사용 가능합니다.");
      setIsPreventAlertModal(true);
    }
  }, []);

  return access ? Component : <Navigate to="/" />;
}
export default PrivateRoute;
