import { useMutation, useQuery } from "@tanstack/react-query";
import { ImemberSignup, memberSignUp } from "api";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import tw from "tailwind-styled-components";

const Container = tw.div`
h-screen
flex 
justify-center 
bg-[#bababa]
`;

const SignUpCard = tw.form`
w-[800px] 
h-[500px]
bg-[#fff] 
px-[60px]
mt-[100px] 
py-[50px]
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

const ValidationVariant = {
  hidden: {
    y: -10,
    color: "red",
    opacity: 0,
  },

  showing: {
    y: 0,
    opacity: 1,
  },

  exit: {
    y: 10,
    opacity: 0,
  },
};

function SignUp() {
  const location = useLocation();
  console.log(location);
  const keyword = new URLSearchParams(location.search);
  console.log(keyword.get("token"));

  localStorage.setItem("key", keyword.get("token") as any);

  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm();

  interface IOnValid {
    nickname: string;
  }
  const onValid = (submitData: IOnValid) => {
    const newMember: ImemberSignup = {
      nickname: submitData?.nickname,
      isPublic: false,
    };
    memberSignUp(newMember);
    navigate("/oauth2/redirect/optional");
  };
  // console.log(formState.errors);

  //

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <Container>
      <SignUpCard onSubmit={handleSubmit(onValid as any)}>
        <Title>Sign Up</Title>

        <SubTitle className="">필수정보 입력하기</SubTitle>

        <InfoBox className=" relative flex w-full ">
          <Info>닉네임</Info>
          {/* 중복 검사 추가 필요 */}
          {/* 랜덤 생성기 있으면 좋을 듯 */}
          <InfoInput
            onKeyPress={onKeyPress}
            {...register("nickname", { required: "필수 항목입니다." })}
            className="w-full"
          />
          <AnimatePresence>
            {(formState.errors.nickname?.message as string) && (
              <motion.div
                variants={ValidationVariant}
                className="absolute top-[100px] mt-[10px]"
                initial="hidden"
                animate="showing"
                exit="exit"
              >
                * {formState.errors.nickname?.message as string}
              </motion.div>
            )}
          </AnimatePresence>
        </InfoBox>

        <InfoBox className="flex w-full flex-row mt-[40px] justify-end">
          {/* <Link to="/oauth2/redirect/optional"> */}
          <SubmitButton className="">제출하기</SubmitButton>
          {/* </Link> */}
        </InfoBox>
      </SignUpCard>
    </Container>
  );
}

export default SignUp;
