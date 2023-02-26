import { useMutation, useQuery } from "@tanstack/react-query";
import { ImemberSignup, memberSignUp } from "api";
import { isExtraSignupModalState, isSignupModalState } from "components/atom";
import LoadingAnimation from "components/LoadingAnimation";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import tw from "tailwind-styled-components";

const Container = tw.div`
flex 
justify-center 


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
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm();

  interface IOnValid {
    nickname: string;
  }

  const { mutate: signupMemberMutate, isLoading: signupMemberLoading } =
    useMutation(
      ["signupMember" as string],

      (newMember: ImemberSignup) => memberSignUp(newMember) as any,

      {
        onError: () => {
          console.log("유저 회원 가입이 작동하지 않습니다.");
        },
      }
    );

  const onValid = (submitData: IOnValid) => {
    const newMember: ImemberSignup = {
      nickname: submitData.nickname,
      isPublic: false,
    };
    console.log(newMember);
    // memberSignUp(newMember);
    signupMemberMutate(newMember);
    // navigate("/oauth2/redirect/optional");
    setIsSignupModal(false);
    setIsExtraSignupModal(true);
  };
  // console.log(f);

  //

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const setIsSignupModal = useSetRecoilState(isSignupModalState);
  const setIsExtraSignupModal = useSetRecoilState(isExtraSignupModalState);

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

  return (
    <>
      {signupMemberLoading ? (
        <LoadingAnimation />
      ) : (
        <Container className="w-[1470px]">
          <motion.div
            variants={LayoutVariant}
            initial="hidden"
            animate="showing"
            exit="exit"
            id="no"
            className="fixed z-10 bg-[rgba(0,0,0,0.5)] top-0 left-0 w-full h-screen"
          ></motion.div>
          <div className="fixed z-20 my-[-30px]">
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
          </div>
        </Container>
      )}
    </>
  );
}

export default SignUp;
