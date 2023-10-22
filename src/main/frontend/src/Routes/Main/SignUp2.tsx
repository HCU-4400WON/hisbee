import { useMutation } from "@tanstack/react-query";
import { IUserSignup, memberSignUp, validationNickname } from "api";
import { isSignupModalState } from "components/atom";
import LoadingAnimation from "components/LoadingAnimation";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useSetRecoilState } from "recoil";
import tw from "tailwind-styled-components";
import "./css/input.css";
import UserProfileInputs from "./UserProfileInputs";

const Container = tw.div`
flex 
justify-center 

`;

const SignUpCard = tw.form`
w-[1000px] 
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

const SubmitButton = tw.button`
text-white bg-blue-600 text-[17px] px-[40px] py-[6px] rounded-lg
`;

function SignUp2() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState,
    setValue,
    watch,
    getValues,
    control,
  } = useForm({
    defaultValues: {
      nickname: "",
      major1: "",
      major2: "",
      canMajor1: "",
      canMajor2: "",
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

  const checkSubmit = () => {
    if (
      getValues("nickname") !== "" &&
      getValues("canMajor1") === "사용 가능" &&
      getValues("canMajor2") !== "사용 불가능"
    ) {
      return true;
    }
    return false;
  };
  const onValid = (submitData: any) => {
    const newMember: IUserSignup = {
      nickname: submitData.nickname,
      major1: submitData?.major1,
      major2: submitData.major2 === "" ? "해당없음" : submitData.major2,
    };
    console.log(newMember);
    if (checkSubmit()) signupMemberMutate(newMember);
    else return;
    // memberSignUp(newMember);
    // memberSignUp(newMember);

    // setIsExtraSignupModal(true);
    // signupMemberMutate(newMember);
    // navigate("/oauth2/redirect/optional");
  };

  const setIsSignupModal = useSetRecoilState(isSignupModalState);

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

  watch(["nickname", "major1", "major2", "canMajor1", "canMajor2"]);
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
                control={control}
                watch={watch}
                register={register}
                getValues={getValues}
                setValue={setValue}
                formState={formState}
                inputBgColor="bg-white"
              />
              <div className="flex justify-center">
                {checkSubmit() === true ? (
                  <SubmitButton type="submit">가입 하기</SubmitButton>
                ) : (
                  <button
                    className="text-gray-400 bg-gray-200 text-[17px] px-[40px] py-[6px] rounded-lg"
                    disabled
                  >
                    가입 하기
                  </button>
                )}
              </div>
            </SignUpCard>
          </div>
        </Container>
      )}
    </>
  );
}

export default SignUp2;
