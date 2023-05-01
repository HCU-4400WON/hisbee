import { useMutation, useQuery } from "@tanstack/react-query";
import {
  IUserSignup,
  IRandomNickname,
  memberSignUp,
  randomNickname,
  validationNickname,
} from "api";
import { isExtraSignupModalState, isSignupModalState } from "components/atom";
import LoadingAnimation from "components/LoadingAnimation";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import tw from "tailwind-styled-components";
import { FunctionButton } from "components/FunctionButton";
import "./css/input.css";
import axios from "axios";
import UserProfileInputs from "./UserProfileInputs";

const Container = tw.div`
flex 
justify-center 
`;

const SignUpCard = tw.form`
w-[00px]
md:w-[1000px] 
h-[500px]
bg-[#fff] 
px-[60px]
mt-[100px] 
py-[50px]
flex 
flex-col
justify-between
rounded-3xl
`;

const Title = tw.p`
  text-[30px]
  font-bold
  font-unique
`;

const SubTitle = tw.p`
font-unique
 text-[22px]
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

const Info = tw.span`
  text-[15px]
  text-gray-400
  font-main
`;

const InfoInput = tw.input`
w-full
  h-[35px]
  text-[15px]
  border-b-2
  px-[10px]
  
`;

const InfoBox = tw.div`
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
text-white bg-blue-600 text-[17px] px-[40px] py-[6px] rounded-lg
`;

const ValidationVariant = {
  hidden: {
    y: -10,
    // color: "red",
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

function SignUp2() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState, setValue, watch, getValues } =
    useForm({
      defaultValues: {
        nickname: "",
        major1: "",
        major2: "",
      },
    });

  interface IOnValid {
    nickname: string;
  }

  const { mutate: signupMemberMutate, isLoading: signupMemberLoading } =
    useMutation(
      ["signupMemberr" as string],
      (newMember: IUserSignup) => memberSignUp(newMember) as any,
      {
        onSuccess: () => {
          console.log("성공!");
          setIsSignupModal(false);
          navigate("/");
        },
        onError: () => {
          console.log("유저 회원 가입이 작동하지 않습니다.");
        },
      }
    );

  const onValid = (submitData: IUserSignup) => {
    const newMember: IUserSignup = {
      nickname: submitData.nickname,
      major1: submitData?.major1,
      major2: submitData.major2 === "" ? "해당없음" : submitData.major2,
    };
    console.log(newMember);
    // memberSignUp(newMember);
    // memberSignUp(newMember);
    signupMemberMutate(newMember);

    // setIsExtraSignupModal(true);
    // signupMemberMutate(newMember);
    // navigate("/oauth2/redirect/optional");
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

  watch(["nickname"]);
  useEffect(() => {
    const validationNickFn = async () => {
      const result = await validationNickname(getValues("nickname"));

      setIsPresent(result.isPresent);
    };
    validationNickFn();
  }, [getValues("nickname")]);
  // console.log(getValues("nickname"));

  const [isPresent, setIsPresent] = useState<boolean>(false);

  return (
    <>
      {signupMemberLoading ? (
        <LoadingAnimation />
      ) : (
        <Container>
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
              <Title>계정 만들기</Title>

              {/* <SubTitle className="">필수정보 입력하기</SubTitle> */}
              <UserProfileInputs
                watch={watch}
                register={register}
                getValues={getValues}
                setValue={setValue}
                formState={formState}
                inputBgColor="bg-white"
              />
              <div className="flex justify-center">
                <SubmitButton type="submit">가입 하기</SubmitButton>
              </div>
            </SignUpCard>
          </div>
        </Container>
      )}
    </>
  );
}

export default SignUp2;
