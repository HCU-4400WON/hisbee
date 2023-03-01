import React from "react";
import { Navigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { isLoginModalState, isLoginState } from "./atom";

function PrivateRoute({ component: Component }: any) {
  const setIsLogin = useSetRecoilState(isLoginState);
  const setIsLoginModal = useSetRecoilState(isLoginModalState);
  //   console.log(authenticated);

  const access = localStorage.getItem("key");

  return access ? (
    Component
  ) : (
    <Navigate
      to="/"
      {...(alert("로그인 후 사용 가능합니다.") as any)}
      {...(setIsLoginModal(true) as any)}
    />
  );
}
export default PrivateRoute;
