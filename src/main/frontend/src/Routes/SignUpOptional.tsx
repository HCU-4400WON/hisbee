import { IUser, memberUpdate } from "api";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import tw from "tailwind-styled-components";

const Container = tw.div`
h-[1600px] 
flex 
items-center 
justify-center 
bg-[#bababa]
`;

const SignUpCard = tw.form`
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
  border-2
  border-white
  opacity-50
  hover:opacity-100
  focus:bg-red
  `;

const PositionGradientBox = tw.span`
rounded-full 
w-[80px] 
h-[80px]
`;

const Info = tw.label`
  text-[18px]
  my-[20px]
`;

const InfoInput = tw.input`
  w-[320px]
  h-[35px]
  bg-[#eeeeee]
  rounded-full
  px-[20px]
`;

const InfoSelect = tw.select`
w-[320px]
h-[35px]
bg-[#eeeeee]
rounded-full
px-[20px]
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

function SignUpOptional() {
  const { register, handleSubmit } = useForm();

  const [positionId, setPositionId] = useState("");
  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setPositionId(event.currentTarget.id);
  };

  console.log(positionId);

  const onValid = (data: any) => {
    const newUser = {
      // pictureUrl?: data.pictureUrl;
      isPublic: true,
      department: data.department,
      position: data.position,
      bio: data.bio,
      //   grade 조금 바꾸는 거 필요
      grade: data.grade,
      club: [data?.club1, data.club2],
      contact: data?.contact,
      //   externalLinks: data?.externalLinks.map((link: string) => link),
    };

    // console.log([data.externalLinks]);
    memberUpdate(newUser);
  };

  return (
    <Container>
      <SignUpCard onSubmit={handleSubmit(onValid)}>
        <Title>Sign Up</Title>

        <SubTitle className="mt-[80px]">선택사항</SubTitle>
        <Info>
          * 선택 사항을 기입하시면 인재풀 페이지를 열람 하실 수 있습니다.
          <Link to="/">
            <button className="float-right w-[100px] border-2 border-red-500 rounded-full text-[red]">
              나가기
            </button>
          </Link>
        </Info>

        <FlexRequiredBox>
          <div className="flex flex-col justify-evenly h-[400px]">
            <InfoBox>
              <Info>학부</Info>
              <InfoSelect {...register("department")}>
                <option>글로벌리더십학부</option>
                <option>국제어문학부</option>
                <option>경영경제학부</option>
                <option>법학부</option>
                <option>커뮤니케이션학부</option>
                <option>공간환경시스템공학부</option>
                <option>기계제어공학부</option>
                <option>콘텐츠융합디자인학부</option>
                <option>생명과학부</option>
                <option>전산전자공학부</option>
                <option>상담심리사회복지학부</option>
                <option>ICT창업학부</option>
              </InfoSelect>
            </InfoBox>
            <InfoBox>
              <Info>학년</Info>
              <InfoSelect {...register("grade")}>
                <option>1학년</option>
                <option>2학년</option>
                <option>3학년</option>
                <option>4학년</option>
              </InfoSelect>
            </InfoBox>

            <InfoBox>
              <Info>포지션</Info>
              <FlexPositionBox>
                <PositionBox
                  className={`${
                    positionId === "일반" && "opacity-100 scale-110 z-[100]"
                  }`}
                  id="일반"
                  onClick={onClick}
                >
                  <PositionGradientBox
                    style={{
                      background:
                        "radial-gradient(closest-side,#3aea31 , white)",
                    }}
                  ></PositionGradientBox>
                  <p>일반</p>
                </PositionBox>
                <PositionBox
                  className={`${
                    positionId === "기획자" && "opacity-100 scale-110 z-[100]"
                  }`}
                  id="기획자"
                  onClick={onClick}
                >
                  <PositionGradientBox
                    style={{
                      background:
                        "radial-gradient(closest-side,#7b87e7 , white)",
                    }}
                  ></PositionGradientBox>
                  <p>기획자</p>
                </PositionBox>
                <PositionBox
                  className={`${
                    positionId === "디자이너" && "opacity-100 scale-110 z-[100]"
                  }`}
                  id="디자이너"
                  onClick={onClick}
                >
                  <PositionGradientBox
                    style={{
                      background:
                        "radial-gradient(closest-side,#e3a3ff , white)",
                    }}
                  ></PositionGradientBox>
                  <p>디자이너</p>
                </PositionBox>
                <PositionBox
                  className={`${
                    positionId === "개발자" && "opacity-100 scale-110 z-[100]"
                  }`}
                  id="개발자"
                  onClick={onClick}
                >
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
          <IntroduceArea
            className="p-[20px]"
            {...register("bio")}
            placeholder="자유롭게 작성해주세요!"
          />
        </IntroduceBox>

        <FlexRowBox className="justify-between ">
          <InfoBox>
            <Info className="my-[25px]">동아리 / 학회 1</Info>
            <InfoInput {...register("club1")} />
          </InfoBox>
          <InfoBox>
            <Info className="my-[25px]">동아리 / 학회 2</Info>
            <InfoInput {...register("club2")} />
          </InfoBox>
        </FlexRowBox>
        <FlexRowBox className="justify-between">
          <InfoBox>
            <Info className="my-[25px]">연락수단</Info>
            <InfoInput
              {...register("contact")}
              placeholder="ex) email or phone"
            />
          </InfoBox>
          <InfoBox>
            <Info className="my-[25px]">외부링크</Info>
            <InfoInput
              {...register("externalLinks")}
              placeholder="ex) github or Linked-In"
            />
          </InfoBox>
        </FlexRowBox>

        <StartButton className="">제출하기</StartButton>
      </SignUpCard>
    </Container>
  );
}

export default SignUpOptional;
