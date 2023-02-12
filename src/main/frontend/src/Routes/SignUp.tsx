import tw from "tailwind-styled-components";

const FlexRowBox = tw.div`
flex
align-center
`;

const FlexRequiredBox = tw(FlexRowBox)`
justify-between
`;
const FlexPositionBox = tw(FlexRowBox)`
justify-evenly
`;

const FlexColRox = tw.div`
flex
flex-col
items-center
`;

const PositionGradientBox = tw.span`
rounded-full 
w-[80px] 
h-[80px]
`;

function SignUp() {
  return (
    <div className="h-[1600px] flex items-center justify-center bg-[#bababa]">
      <div className="w-[800px] h-[1422px] bg-[#fff] px-[75px] py-[80px] flex flex-col">
        <div>Sign Up</div>

        <div className="border-b border-black">필수정보 입력하기</div>

        <FlexRequiredBox>
          <div className="flex flex-col justify-evenly h-[400px]">
            <div>
              <p>학부</p>
              <input />
            </div>
            <div>
              <p>학기 수</p>
              <input />
            </div>
            <div>
              <p>포지션</p>
              <FlexPositionBox>
                <FlexColRox>
                  <PositionGradientBox
                    style={{
                      background:
                        "radial-gradient(closest-side,#7b87e7 , white)",
                    }}
                  ></PositionGradientBox>
                  <p>기획자</p>
                </FlexColRox>
                <FlexColRox>
                  <PositionGradientBox
                    style={{
                      background:
                        "radial-gradient(closest-side,#e3a3ff , white)",
                    }}
                  ></PositionGradientBox>
                  <p>디자이너</p>
                </FlexColRox>
                <FlexColRox>
                  <PositionGradientBox
                    style={{
                      background:
                        "radial-gradient(closest-side,#87879e , white)",
                    }}
                  ></PositionGradientBox>
                  <p>개발자</p>
                </FlexColRox>
              </FlexPositionBox>
            </div>
          </div>
          <div className="flex flex-col items-center justify-evenly h-[400px]">
            <span className="border w-[300px] h-[300px] "></span>
            <span>프로필 사진 업로드</span>
          </div>
        </FlexRequiredBox>

        <div>선택사항</div>

        <p>자기소개</p>
        <textarea></textarea>

        <div className="flex justify-between">
          <div>
            <p>동아리 / 학회</p>
            <input />
          </div>
          <div>
            <p>이메일 주소</p>
            <input />
          </div>
        </div>

        <div className="flex justify-between">
          <div>
            <p>연락수단</p>
            <input />
          </div>
          <div>
            <p>외부링크</p>
            <input />
          </div>
        </div>

        <button>시작하기</button>
      </div>
    </div>
  );
}

export default SignUp;
