import { useLocation } from "react-router";
import tw from "tailwind-styled-components";

const Container = tw.div`
h-[1600px] 
flex 
items-center 
justify-center 
bg-[#bababa]
`;

const SignUpCard = tw.div`
w-[800px] 
bg-[#fff] 
px-[60px] 
pt-[50px] 
flex 
flex-col
rounded-3xl
`;

const Title = tw.p`
  text-[40px]
  font-bold
`;

const SubTitle = tw.p`
 text-[22px]
 font-bold
 border-b border-black
 mt-[40px]
 pb-[10px]
 mb-[30px]
 `;

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

const PositionBox = tw.div`
  h-[115px]
  flex
  flex-col
  items-center
  justify-between
`;

const PositionGradientBox = tw.span`
rounded-full 
w-[80px] 
h-[80px]
`;

const Info = tw.p`
  text-[18px]
  my-[20px]
`;

const InfoInput = tw.input`
  w-[320px]
  h-[35px]
  bg-[#eeeeee]
  rounded-full
`;

const InfoBox = tw.div`
  w-[320px]
  flex
  flex-col
`;

const IntroduceBox = tw.div`
flex
flex-col
justify-between
h-[200px]
w-[680px]
`;

const IntroduceArea = tw.textarea`
w-[680px]
h-[110px]
bg-[#eeeeee]
`;

const StartButton = tw.button`
mx-auto
my-[80px]
w-[250px]
h-[33px]
bg-[#eeeeee]
rounded-full
`;

const SubmitButton = tw.button`
w-[150px]
h-[33px]
bg-[#eeeeee]
rounded-full
`;

function SignUp() {
  const location = useLocation();
  console.log(location);
  const keyword = new URLSearchParams(location.search);
  console.log(keyword.get("token"));

  localStorage.setItem("key", keyword.get("token") as any);

  return (
    <Container>
      <SignUpCard>
        <Title>Sign Up</Title>

        <SubTitle className="">필수정보 입력하기</SubTitle>

        <InfoBox className="flex w-full ">
          <Info>닉네임</Info>
          <InfoInput className="w-full" />
        </InfoBox>

        <InfoBox className="flex w-full flex-row mt-[40px] justify-end">
          <SubmitButton className="">제출하기</SubmitButton>
        </InfoBox>
        <SubTitle className="mt-[80px]">선택사항</SubTitle>
        <Info>
          * 선택 사항을 기입하시면 인재풀 페이지를 열람 하실 수 있습니다.
        </Info>

        <FlexRequiredBox>
          <div className="flex flex-col justify-evenly h-[400px]">
            <InfoBox>
              <Info>학부</Info>
              <InfoInput />
            </InfoBox>
            <InfoBox>
              <Info>학년</Info>
              <InfoInput />
            </InfoBox>

            <InfoBox>
              <Info>포지션</Info>
              <FlexPositionBox>
                <PositionBox>
                  <PositionGradientBox
                    style={{
                      background:
                        "radial-gradient(closest-side,#3aea31 , white)",
                    }}
                  ></PositionGradientBox>
                  <p>일반</p>
                </PositionBox>
                <PositionBox>
                  <PositionGradientBox
                    style={{
                      background:
                        "radial-gradient(closest-side,#7b87e7 , white)",
                    }}
                  ></PositionGradientBox>
                  <p>기획자</p>
                </PositionBox>
                <PositionBox>
                  <PositionGradientBox
                    style={{
                      background:
                        "radial-gradient(closest-side,#e3a3ff , white)",
                    }}
                  ></PositionGradientBox>
                  <p>디자이너</p>
                </PositionBox>
                <PositionBox>
                  <PositionGradientBox
                    style={{
                      background:
                        "radial-gradient(closest-side,#87879e , white)",
                    }}
                  ></PositionGradientBox>
                  <p>개발자</p>
                </PositionBox>
              </FlexPositionBox>
            </InfoBox>
          </div>
          <div className="flex flex-col items-center justify-evenly mt-[15px]">
            <span className="border w-[300px] h-[300px] "></span>
            <span>프로필 사진 업로드</span>
          </div>
        </FlexRequiredBox>

        <IntroduceBox>
          <Info className="my-[25px]">자기소개</Info>
          <IntroduceArea />
        </IntroduceBox>

        <FlexRowBox className="justify-between ">
          <InfoBox>
            <Info className="my-[25px]">동아리 / 학회</Info>
            <InfoInput />
          </InfoBox>
          <InfoBox>
            <Info className="my-[25px]">이메일 주소</Info>
            <InfoInput />
          </InfoBox>
        </FlexRowBox>

        <FlexRowBox className="justify-between">
          <InfoBox>
            <Info className="my-[25px]">연락수단</Info>
            <InfoInput />
          </InfoBox>
          <InfoBox>
            <Info className="my-[25px]">외부링크</Info>
            <InfoInput />
          </InfoBox>
        </FlexRowBox>

        <StartButton className="">제출하기</StartButton>
      </SignUpCard>
    </Container>
  );
}

export default SignUp;
