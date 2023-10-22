import { IRandomNickname, randomNickname, validationNickname } from "api";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { FunctionButton } from "components/FunctionButton";

import { Autocomplete, TextField } from "@mui/material";

const departmentList = [
  "해당없음",
  "글로벌리더십학부",
  "GE",
  "ICT융합",
  "ACE",
  "국제지역학",
  "영어",
  "경영학",
  "경제학",
  "GM",
  "한국법",
  "UIL",
  "상담심리학",
  "사회복지학",
  "공연영상학",
  "언론정보학",
  "건설공학",
  "도시환경공학",
  "생명과학부",
  "기계공학",
  "전자제어공학",
  "컴퓨터공학",
  "전자공학",
  "시각디자인",
  "제품디자인",
];

const ValidationVariant = {
  hidden: {
    y: -10,
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

const Info = tw.span`
text-[15px]
text-gray-400
min-w-[40px]
font-main

`;

const InfoInput = tw(TextField)`
w-full
h-[35px]
text-[15px]
border-b-2
px-[0px]
`;

const InfoBox = tw.div`

`;

const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    e.preventDefault();
  }
};

export default function UserProfileInputs({
  inputBgColor,
  register,
  watch,
  getValues,
  setValue,
  control,
  formState,
}: any) {
  watch(["nickname", "major1", "major2", "canMajor2", "canMajor1"]);
  useEffect(() => {
    const validationNickFn = async () => {
      const result = await validationNickname(getValues("nickname"));

      setIsPresent(result.isPresent);
    };
    validationNickFn();
  }, [getValues("nickname")]);

  const [isPresent, setIsPresent] = useState<boolean>(false);

  useEffect(() => {
    setValue("canMajor1", checkMajor(getValues("major1")));
  }, [getValues("major1")]);

  useEffect(() => {
    // majorAutoComplete(getValues("major2")).then((data) =>
    // );
    setValue("canMajor2", checkMajor(getValues("major2")));
  }, [getValues("major2")]);

  const checkMajor = (checkData: string) => {
    if (checkData === "") return "";
    else if (departmentList.indexOf(checkData) === -1) return "사용 불가능";
    else return "사용 가능";
  };
  return (
    <div className="flex h-[250px] items-start">
      <InfoBox className="relative flex w-[50%] items-center">
        <Info>닉네임</Info>

        <div className={`w-[220px] px-[20px] `}>
          <InfoInput
            inputProps={{ maxLength: 8 }}
            className={`${inputBgColor}`}
            type="text"
            variant="standard"
            id="nicknameInput"
            onKeyPress={onKeyPress}
            {...register("nickname", {
              required: "필수 항목입니다.",
            })}
            placeholder="8자 이내로 작성해주세요"
          />
        </div>
        <FunctionButton
          text="닉네임 자동생성"
          onClick={async () => {
            const newNickname: IRandomNickname = await randomNickname();
            await setValue("nickname", newNickname.words[0]);
            document.getElementById("nicknameInput")?.focus();
          }}
        />
        <AnimatePresence>
          {getValues("nickname") !== "" && (
            <motion.div
              variants={ValidationVariant}
              className={`absolute top-[38px] left-[60px] text-[13px] ${
                isPresent ? "text-red-600" : "text-blue-600"
              }`}
              initial="hidden"
              animate="showing"
              exit="exit"
            >
              {isPresent
                ? "* 이미 존재하는 닉네임 입니다."
                : "* 사용 가능한 닉네임입니다."}
            </motion.div>
          )}
        </AnimatePresence>
      </InfoBox>

      <InfoBox className="flex flex-col w-[50%] pl-[50px]">
        <InfoBox className="z-20 relative flex w-full items-start mb-[10px] h-[100px]">
          <Info className="mt-[5px]">1전공</Info>
          <div className={`w-[300px] px-[20px] flex flex-col`}>
            <Autocomplete
              options={departmentList}
              onChange={(e, newValue) => {
                setValue("major1", newValue);
              }}
              defaultValue={getValues("major1")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  type="text"
                  variant="standard"
                  onKeyPress={onKeyPress}
                  {...register("major1", {
                    maxLength: {
                      value: 10,
                      message: "10자 이하만 가능합니다",
                    },
                  })}
                />
              )}
            />
          </div>
          <div
            className={`text-[13px] w-[100px] mt-[10px] ${
              getValues("canMajor1") === "사용 가능"
                ? "text-blue-500"
                : "text-red-400"
            }`}
          >
            {getValues("canMajor1")}
          </div>
        </InfoBox>
        <InfoBox className="relative flex w-full items-start h-[100px]">
          <Info className="mt-[5px]">2전공</Info>
          <div className={`w-[300px] px-[20px] `}>
            <div>
              <Autocomplete
                options={departmentList}
                onChange={(e, newValue) => {
                  setValue("major2", newValue);
                }}
                defaultValue={getValues("major2")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    type="text"
                    variant="standard"
                    onKeyPress={onKeyPress}
                    {...register("major2", {
                      maxLength: {
                        value: 10,
                        message: "10자 이하만 가능합니다",
                      },
                    })}
                  />
                )}
              />
            </div>
          </div>
          <div
            className={`text-[13px] w-[100px] mt-[10px] ${
              getValues("canMajor2") === "사용 가능"
                ? "text-blue-500"
                : "text-red-400"
            }`}
          >
            {getValues("canMajor2")}
          </div>
        </InfoBox>
      </InfoBox>
    </div>
  );
}
