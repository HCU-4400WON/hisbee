import { isLoginModalState } from "components/atom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { motion, AnimatePresence } from "framer-motion";
import { FunctionButton } from "./FunctionButton";

const LayoutVariant = {
  hidden: {
    opacity: 0,
    // backGroundColor: "rgba(0,0,0,0.5)",
  },
  showing: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

function Login() {
  const setIsLoginModal = useSetRecoilState(isLoginModalState);

  const onClick = (event: any) => {
    if (event.currentTarget.id === "no") {
      setIsLoginModal(false);
    }
  };

  return (
    <div className="flex w-full justify-center">
      <motion.div
        variants={LayoutVariant}
        initial="hidden"
        animate="showing"
        exit="exit"
        onClick={onClick}
        id="no"
        className="fixed z-10 bg-[rgba(0,0,0,0.5)] top-0 left-0 w-full h-screen"
      ></motion.div>

      <div className="modal fixed  z-20 w-[700px] h-[420px] bg-[#fff]  p-[50px]">
        <div className="flex justify-between w-full h-[20px] items-center mb-[20px]">
          {/* <img src="/img/logo_hisbee.png" className="w-[110px] mb-[0px]" /> */}
          <img src="/img/logo_hisbee.png" className="w-[110px] mb-[20px]" />

          <svg
            onClick={onClick}
            id="no"
            className="w-[16px] mb-[15px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
          </svg>
        </div>
        <hr style={{ border: "dashed 2px lightGray" }}></hr>

        <div></div>
        <div className=" flex flex-col items-center pt-[40px] pb-[40px] text-[16px] text-center">
          <p className="text-[22px] font-[500] mb-[30px]"> Login </p>
          🗝 로그인을 통해 HISBEE 서비스의 기능들을 이용해보세요! <br></br>
          {/* 글
          작성 , 좋아요 , 마이페이지 기능이 제공됩니다. */}
        </div>

        <div className="flex justify-center items-start mb-[50px]">
          {/* <button
            id="no"
            onClick={onClick}
            className="hover:bg-gray-300 w-[100px] bg-gray-100 rounded-lg mr-[10px] py-[5px]"
          >
            취소
          </button> */}
          <a
            href={`${process.env.REACT_APP_BACK_BASE_URL}/oauth2/authorization/google`}
            className="text-[17px] flex"
          >
            <FunctionButton text="Google 계정으로 로그인" />
          </a>
        </div>

        <hr style={{ border: "dashed 2px lightGray" }}></hr>

        {/* <div
            className="border-1-[#eff0f6] w-[310px] h-[34.6px] flex items-center rounded-full text-[14px] px-5 "
            style={{ boxShadow: "0 2px 6px 0 rgba(19, 18, 66, 0.15)" }}
          >
            계정이 없으십니까? &nbsp;
            <span className="font-bold"> 회원가입 하기</span>
          </div> */}
      </div>
    </div>
  );
}

export default Login;
