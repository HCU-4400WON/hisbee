import { useMutation } from "@tanstack/react-query";
import { IUser, memberUpdate } from "api";
import { isExtraSignupModalState } from "components/atom";
import LoadingAnimation from "components/LoadingAnimation";
import React, { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import tw from "tailwind-styled-components";
import { motion } from "framer-motion";

const Container = tw.div`

flex 
justify-center 
`;

const SignUpCard = tw.form`

w-[800px] 
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
    setLinks((prev) => [...prev, externalLink]);
    setExternalLink("");
  };
  const { register, handleSubmit, formState } = useForm();

  const [positionId, setPositionId] = useState("");
  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setPositionId(event.currentTarget.id);
  };

  const navigate = useNavigate();

  console.log(positionId);

  const onValid = (data: any) => {
    const newUser = {
      pictureUrl: uploadImage,
      isPublic: true,
      department: data.department,
      position: positionId,
      bio: data.bio,
      grade: data.grade,
      club: [data.club1, data.club2],
      contact: data?.contact,
      externalLinks: Links,
    };
    console.log(data);
    // memberUpdate(newUser);
    updateMemberMutate(newUser);
    // navigate("/");
    setIsExtraSignupModal(false);
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
      }
    );

  const setIsExtraSignupModal = useSetRecoilState(isExtraSignupModalState);

  return (
    <>
      {updateMemberLoading ? (
        <LoadingAnimation />
      ) : (
        <Container className="relative w-[1470px]">
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

            <SubTitle className="mt-[80px]">선택사항</SubTitle>
            <Info>
              * 선택 사항을 기입하시면 인재풀 페이지를 열람 하실 수 있습니다.
              {/* <Link to="/"> */}
              <button
                onClick={() => setIsExtraSignupModal(false)}
                className="float-right w-[150px] border-2 border-red-500 rounded-full text-[red]"
              >
                안하고 나가기
              </button>
              {/* </Link> */}
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
                        src="/img/position1.png"
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
                        src="/img/position2.png"
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
                        src="/img/position3.png"
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
                        src="/img/position4.png"
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
                  className="border w-[300px] h-[300px] "
                  src={uploadImage}
                ></img>
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  onChange={onUploadImage}
                />
                <div className="flex items-center justify-between w-[170px]">
                  <i
                    onClick={onUploadImageButtonClick}
                    className="fa-solid fa-arrow-up-from-bracket p-2 border-2 rounded-full"
                  ></i>
                  <span>프로필 사진 업로드</span>
                </div>
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
                <InfoInput
                  onKeyPress={onKeyPress}
                  {...register("club1")}
                  placeholder="선택 사항입니다"
                />
              </InfoBox>
              <InfoBox>
                <Info className="my-[25px]">동아리 / 학회 2</Info>
                <InfoInput
                  onKeyPress={onKeyPress}
                  {...register("club2")}
                  placeholder="최대 2개 작성 가능합니다"
                />
              </InfoBox>
            </FlexRowBox>
            <FlexRowBox className="justify-between">
              <InfoBox>
                <Info className="my-[25px]">연락수단</Info>
                <InfoInput
                  onKeyPress={onKeyPress}
                  {...register("contact")}
                  placeholder="ex) email or phone"
                />
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

            <StartButton className="">제출하기</StartButton>
          </SignUpCard>
        </Container>
      )}
    </>
  );
}

export default SignUpOptional;
