import { useMutation } from "@tanstack/react-query";
import { IUser, memberUpdate } from "api";
import { isExtraSignupModalState, isSignupModalState } from "components/atom";
import LoadingAnimation from "components/LoadingAnimation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import tw from "tailwind-styled-components";
import { AnimatePresence, motion } from "framer-motion";

import {
  ref,
  getDownloadURL,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useRef, useState } from "react";
import { storage } from "../../firebase";

const Container = tw.div`

flex 
justify-center 
`;

const SignUpCard = tw.form`
w-[400px]
md:w-[800px] 
bg-[#fff]
mt-[100px] 
px-[60px] 
pt-[50px]
flex 
flex-col
rounded-3xl
`;

const Title = tw.p`
  text-[40px]
  font-bold
  font-unique
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

const PositionGradientBox = tw.img`
bg-[#eeeeee]
rounded-full 
w-[70px] 
h-[70px]
`;

const Info = tw.label`
text-[13px]  
md:text-[18px]
  my-[20px]
  font-main
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
w-[300px]
md:w-[680px]
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

function SignUpOptional() {
  // const inputRef = useRef<HTMLInputElement | null>(null);
  const [imageURL, setImageURL] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const onImageChange = (
    e: React.ChangeEvent<EventTarget & HTMLInputElement>
  ) => {
    e.preventDefault();
    const file = e.target.files;
    if (!file) return null;

    const storageRef = ref(storage, `files/${file[0].name}`);
    const uploadTask = uploadBytesResumable(storageRef, file[0]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgressPercent(progress);
      },
      (error) => {
        switch (error.code) {
          case "storage/canceld":
            alert("Upload has been canceled");
            break;
        }
      },
      () => {
        e.target.value = "";
        getDownloadURL(storageRef).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImageURL(downloadURL);
          //   setImage(downloadURL);
        });
      }
    );

    // const uploadTask = uploadBytes(storageRef, file[0]);

    // uploadTask.then((snapshot) => {
    //   e.target.value = "";
    //   getDownloadURL(snapshot.ref).then((downloadURL) => {
    //     console.log("File available at", downloadURL);
    //     setImageURL(downloadURL);
    //     setImage(downloadURL);
    //   });
    // });
  };

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

  const [Links, setLinks] = useState<string[]>([]);
  const [externalLink, setExternalLink] = useState<string>("");
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    setExternalLink(event.currentTarget.value);
  };
  const onDelete = (link: string) => {
    const idx = Links.findIndex((elem) => elem === link);
    setLinks((prev) => [...prev.slice(0, idx), ...prev.slice(idx + 1)]);
  };
  const onClickPlus = () => {
    if (externalLink !== "") setLinks((prev) => [...prev, externalLink]);
    setExternalLink("");
  };
  const { register, handleSubmit, formState } = useForm();

  const [positionId, setPositionId] = useState("일반");
  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setPositionId(event.currentTarget.id);
  };

  const navigate = useNavigate();

  console.log(positionId);

  const onValid = (data: any) => {
    console.log("check", data, Links);
    const newUser = {
      pictureUrl:
        uploadImage !== ""
          ? uploadImage
          : positionId === "일반"
          ? "/img/position4.png"
          : positionId === "기획자"
          ? "/img/position3.png"
          : positionId === "디자이너"
          ? "/img/position2.png"
          : "/img/position1.png",
      isPublic: true,
      department: data.department,
      position: positionId,
      bio: data.bio,
      grade: data.grade,
      club: [data.club1, data.club2],
      contact: data?.contact,
      externalLinks: Links,
    };
    console.log(newUser);
    updateMemberMutate(newUser);

    setImageURL("");
    setIsExtraSignupModal(false);
    navigate("/");
  };

  const [uploadImage, setUploadImage] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  const onUploadImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) {
        return;
      }
      setUploadImage("/img/" + e.target.files[0].name);
    },
    []
  );

  const onUploadImageButtonClick = useCallback(() => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.click();
  }, []);

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (e.currentTarget.id == "외부링크") {
        onClickPlus();
      }
      e.preventDefault();
    }
  };

  const { mutate: updateMemberMutate, isLoading: updateMemberLoading } =
    useMutation(
      ["updateMember" as string],

      (newMember: any) => memberUpdate(newMember) as any,

      {
        onError: () => {
          console.log("유저 수정이 작동하지 않습니다.");
        },
        onSuccess: () => {},
      }
    );

  const setIsExtraSignupModal = useSetRecoilState(isExtraSignupModalState);
  const setIsSignupModal = useSetRecoilState(isSignupModalState);
  return (
    <>
      {updateMemberLoading ? (
        <LoadingAnimation />
      ) : (
        <Container className="relative">
          <motion.div
            variants={LayoutVariant}
            initial="hidden"
            animate="showing"
            exit="exit"
            id="no"
            className="fixed z-10 bg-[rgba(0,0,0,0.5)] top-0 left-0 w-full h-screen"
          ></motion.div>

          <SignUpCard
            className="absolute z-20"
            onSubmit={handleSubmit(onValid as any)}
          >
            <Title>Sign Up</Title>

            <SubTitle className="mt-[80px] mb-[20px] font-unique">
              선택사항
            </SubTitle>
            <Info className="mt-[0px]">
              * 선택 사항을 기입하시면 인재풀 페이지를 열람 하실 수 있습니다.
              {/* <Link to="/"> */}
              <button
                type="button"
                onClick={(e: React.FormEvent<HTMLButtonElement>) => {
                  setIsExtraSignupModal(false);
                  setIsSignupModal(false);
                  navigate("/");
                }}
                className="float-right w-[100px] md:w-[150px] border-2 border-red-500 rounded-full text-[red]"
              >
                안하고 나가기
              </button>
              {/* </Link> */}
            </Info>

            <FlexRequiredBox className="flex-col md:flex-row">
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
                    <option>AI융합교육원</option>
                    <option>창의융합교육원</option>
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
                        src="/img/position4.png"
                        // style={{
                        //   background:
                        //     "radial-gradient(closest-side,#3aea31 , white)",
                        // }}
                      ></PositionGradientBox>
                      <p>일반</p>
                    </PositionBox>
                    <PositionBox
                      className={`${
                        positionId === "기획자" &&
                        "opacity-100 scale-110 z-[100]"
                      }`}
                      id="기획자"
                      onClick={onClick}
                    >
                      <PositionGradientBox
                        src="/img/position3.png"
                        // style={{
                        //   background:
                        //     "radial-gradient(closest-side,#7b87e7 , white)",
                        // }}
                      ></PositionGradientBox>
                      <p>기획자</p>
                    </PositionBox>
                    <PositionBox
                      className={`${
                        positionId === "디자이너" &&
                        "opacity-100 scale-110 z-[100]"
                      }`}
                      id="디자이너"
                      onClick={onClick}
                    >
                      <PositionGradientBox
                        src="/img/position2.png"
                        // style={{
                        //   background:

                        //     "radial-gradient(closest-side,#e3a3ff , white)",
                        // }}
                      ></PositionGradientBox>
                      <p>디자이너</p>
                    </PositionBox>
                    <PositionBox
                      className={`${
                        positionId === "개발자" &&
                        "opacity-100 scale-110 z-[100]"
                      }`}
                      id="개발자"
                      onClick={onClick}
                    >
                      <PositionGradientBox
                        src="/img/position1.png"
                        // style={{
                        //   background:
                        //     "radial-gradient(closest-side,#87879e , white)",
                        // }}
                      ></PositionGradientBox>
                      <p>개발자</p>
                    </PositionBox>
                  </FlexPositionBox>
                </InfoBox>
              </div>
              <div className="flex flex-col items-center justify-evenly mt-[15px]">
                <img
                  id="uploadImage"
                  className="my-[10px] w-[200px] h-[200px] md:w-[300px] md:h-[300px] md:my-[0px]"
                  src={imageURL}
                  onError={(e) => {
                    e.currentTarget.src = "/img/logoDefault.png";
                  }}
                  onLoad={(e) => {
                    console.log(e);
                  }}
                ></img>

                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  // onChange={onUploadImage}
                  onChange={onImageChange}
                />

                <div className="flex items-center justify-between w-[170px] md:mb-[10px] mb-[10px]">
                  <i
                    onClick={onUploadImageButtonClick}
                    className="fa-solid fa-arrow-up-from-bracket p-2 border-2 rounded-full"
                  ></i>
                  <span>프로필 사진 업로드</span>
                </div>
                <div className="flex justify-start w-[300px] border h-[6px]">
                  <span
                    className={` bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500`}
                    style={{ width: progressPercent * 3 }}
                  ></span>
                </div>
              </div>
            </FlexRequiredBox>

            <IntroduceBox>
              <Info className="mt-[40px]">자기소개</Info>
              <IntroduceArea
                className="p-[20px]"
                {...register("bio")}
                placeholder="자유롭게 작성해주세요!"
                maxLength={100}
              />
            </IntroduceBox>

            <FlexRowBox className="justify-between md:flex-row flex-col">
              <InfoBox>
                <Info className="my-[25px]">동아리 / 학회 1</Info>
                <InfoInput
                  onKeyPress={onKeyPress}
                  {...register("club1")}
                  placeholder="선택 사항입니다"
                  maxLength={20}
                />
              </InfoBox>
              <InfoBox>
                <Info className="my-[25px]">동아리 / 학회 2</Info>
                <InfoInput
                  onKeyPress={onKeyPress}
                  {...register("club2")}
                  placeholder="최대 2개 작성 가능합니다"
                  maxLength={20}
                />
              </InfoBox>
            </FlexRowBox>
            <FlexRowBox className="justify-between md:flex-row flex-col">
              <InfoBox className=" md:h-[150px] h-[100px]">
                <Info className=" flex items-center my-[25px]">
                  <p>연락수단</p>
                </Info>
                <InfoInput
                  onKeyPress={onKeyPress}
                  {...register("contact", {
                    required: "필수 사항입니다.",
                    maxLength: {
                      value: 30,
                      message: "너무 깁니다.",
                    },
                  })}
                  placeholder="ex) email or phone"
                />

                <AnimatePresence>
                  {(formState.errors.contact?.message as string) && (
                    <motion.div
                      variants={ValidationVariant}
                      className=" text-[13px] mt-2"
                      initial="hidden"
                      animate="showing"
                      exit="exit"
                    >
                      * {formState.errors.contact?.message as string}
                    </motion.div>
                  )}
                </AnimatePresence>
              </InfoBox>
              <InfoBox>
                <Info className="my-[25px]">외부링크</Info>
                <div className="flex items-center relative">
                  <InfoInput
                    id="외부링크"
                    onKeyPress={onKeyPress}
                    value={externalLink}
                    onChange={onChange}
                    placeholder="ex) github or Linked-In"
                    maxLength={30}
                  />
                  <i
                    onClick={onClickPlus}
                    className="fa-solid fa-plus text-[20px] absolute right-3"
                  ></i>
                </div>
                {Links.map((link) => (
                  <div className="flex items-center justify-between bg-slate-100 px-[10px] h-[30px] rounded-full mt-2">
                    <i className="fa-solid fa-link"></i>
                    {link}{" "}
                    <i
                      className="fa-regular fa-trash-can"
                      onClick={() => onDelete(link)}
                    ></i>
                  </div>
                ))}
              </InfoBox>
            </FlexRowBox>

            <StartButton type="submit" className="">
              제출하기
            </StartButton>
          </SignUpCard>
        </Container>
      )}
    </>
  );
}

export default SignUpOptional;
