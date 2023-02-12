function Login() {
  return (
    <div className="w-screen h-screen border flex items-center justify-center ">
      <div className="border rounded-2xl w-[940px] h-[540px] bg-[#fff] flex justify-evenly">
        <div
          className="w-[336px] h-[336px] mx-[36px] mt-[96px] rounded-full flex items-center justify-center"
          style={{ background: "radial-gradient(closest-side,#7b87e7, white)" }}
        >
          welcome to Dinner
        </div>
        <div className="border w-[367px] h-[336px] mt-[96px] mx-[70px] flex-col">
          <div className="font-bold mt-[117px] text-[24px]">로그인</div>
          <div className=" text-[#757575] text-[16px] my-3">
            로그인을 하면 모집글을 모두 열람하실 수 있어요!
          </div>
          <div className="border-1-[#eff0f6] w-[311px] h-[34.6px] flex items-center rounded-full shadow my-3">
            <div>G</div>
            <div className="text-[14px]">
              <strong>Google</strong> 계정으로 로그인
            </div>
          </div>

          <div className="border-1-[#eff0f6] w-[311px] h-[34.6px] flex items-center rounded-full shadow text-[14px]">
            계정이 없으십니까?<strong>Google</strong> 계정으로 로그인
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
