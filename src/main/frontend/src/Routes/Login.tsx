function Login() {
  return (
    <div className="w-screen h-screen border flex items-center justify-center bg-[#bababa]">
      <div className="rounded-2xl w-[940px] h-[540px] bg-[#fff] flex justify-evenly">
        <div
          className="w-[336px] h-[336px] mx-[36px] mt-[96px] rounded-full flex flex-col items-center justify-center text-4xl font-bold leading-relaxed"
          style={{
            // background:
            //   "radial-gradient(closest-side,#7b87e7, lightgray 80% , white)",
            backgroundImage:
              "radial-gradient(closest-side, #7b87e7, rgba(235, 235, 235, 0.13) 100%)",
          }}
        >
          <span>Welcome </span>
          <span>to Dinner</span>
        </div>
        <div className=" w-[390px] h-[336px] relative">
          <div>
            <svg
              className="w-[16px] absolute right-[-30px] top-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
            </svg>
          </div>
          <div>
            <div className="font-bold mt-[213px] text-[24px] mt-[80px]">
              로그인
            </div>
            <div className=" text-[#757575] text-[16px] mt-3 mb-7">
              로그인을 하시면 모집글을 모두 열람하실 수 있어요!
            </div>
            <div
              className="border-1-[#eff0f6] w-[310px] h-[34.6px] flex items-center rounded-full my-5 px-5"
              style={{ boxShadow: "0 2px 6px 0 rgba(19, 18, 66, 0.15)" }}
            >
              <img src="img/google.png" className="w-[14px] mr-2" />
              <a
                href="http://localhost:8080/login/oauth2/authorization/google"
                className="text-[14px]"
              >
                <span className="font-medium">Google</span> 계정으로 로그인
              </a>
            </div>

            <div
              className="border-1-[#eff0f6] w-[310px] h-[34.6px] flex items-center rounded-full text-[14px] px-5 "
              style={{ boxShadow: "0 2px 6px 0 rgba(19, 18, 66, 0.15)" }}
            >
              계정이 없으십니까? &nbsp;
              <span className="font-bold"> 회원가입 하기</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
