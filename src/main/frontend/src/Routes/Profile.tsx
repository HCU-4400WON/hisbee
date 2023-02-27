import { useMutation, useQuery } from "@tanstack/react-query";
import { IUser, memberDelete, memberProfile, memberUpdate, posts } from "api";
import { isDeleteModalState, isLoginState } from "components/atom";
import DeletePopup from "components/DeleteModal";
import LoadingAnimation from "components/LoadingAnimation";
import { AnimatePresence, motion } from "framer-motion";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
import { Navigate, useNavigate } from "react-router";
import { useRecoilState, useSetRecoilState } from "recoil";
import tw from "tailwind-styled-components";

const Sidebar = tw.div`
min-w-[250px] pl-[30px]
border-r-2
border-gray-200
border-b-2
min-h-screen
flex
flex-col
items-start

`;

const SidebarTitle = tw.p`
py-[40px] 
text-[33px] 
font-semibold
`;

const SidebarItemText = tw.button`
text-[17px]
mb-[20px]
font-semibold
hover:scale-110
hover:text-gray-400
`;

const ProfileInfoRow = tw.div`
    flex
    my-[10px]
    h-auto
    items-center
`;

const ProfileInfoBox = tw.div`
flex items-center w-[180px]
`;

const ProfileInfoTitle = tw.p`
min-w-[150px] 
text-gray-500
font-medium
`;

const ProfileInfoIcon = tw.i`
text-gray-600
mr-2
`;

const ProfileInfoContent = tw.span`
`;

const ProfileBanner = tw.form`

min-w-[700px] 
my-[40px] 
rounded-xl 
bg-[#f2f2f2] 
p-[50px] 
flex
`;

const PostGrid = tw.div`
min-w-[700px]
gap-20
p-10
flex
white
whitespace-nowrap
overflow-scroll
justify-between
mt-[40px]
mb-[80px]

`;

// const PostGrid = tw.div`
// grid
// grid-cols-1
// sm:grid-cols-2
// xl:grid-cols-4
// pb-[100px]
// `;

const PostItem = tw(motion.div)`
relative
justify-self-center
h-[210px] 
min-w-[330px]
rounded-md
overflow-hidden
`;

const PostImage = tw.div`
border-0 
rounded-sm 
h-2/5 
mx-5 
mt-5 
mb-3 
`;

const PostContentFirstRow = tw.div`
flex 
justify-between
items-center
bg-gray-500
p-[15px]
`;

const PostCategorySpan = tw.span`
text-[#185ee4] 
bg-[#fff] 
h-[25px] 
border 
w-[80px] 
text-[15px] 
font-bold 
rounded-full 
flex 
items-center 
justify-center
`;

const PostCategoryLabel = tw.label`
`;

const HeartIcon = tw.i`
`;

const PostMainPart = tw.div`
bg-[#e9e9eb] 
w-full 
h-full 
px-[25px] 
py-[15px]
`;

const PostTitle = tw.p`
text-lg 
font-semibold
`;
const PostDate = tw.div`
flex text-[12px] 
font-semibold 
items-center
`;

const PostDatePlan = tw.p``;
const PostDateStart = tw.p``;

const PostPerson = tw.div`
absolute 
left-[25px] 
bottom-[15px] 
flex 
items-center 
gap-2
`;

const PostPersonTotal = tw.p`
text-[#185ee4] 
font-bold 
text-[14px]
`;

const PostPersonPosition = tw.span`
border-gray-400 
border 
rounded-full 
px-[10px] 
text-[11px] 
text-gray-500 
font-medium
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

function Profile() {
  const location = useLocation();
  console.log(location);

  const {
    isLoading: getUserLoading,
    data,
    refetch,
  } = useQuery<IUser>(["User"], memberProfile, {
    onSuccess: (data) => {
      setValue("nickname", data.nickname);
      setValue("department", data.department);
      setValue("position", data.position);
      setValue("contact", data.contact);
      setValue("club1", data.club?.at(0));
      setValue("club2", data.club?.at(1));
      setValue("bio", data.bio);

      // setValue("imageURl" , data)

      // 성공시 호출
      if (!location.state) {
        setLinks([...(data?.externalLinks as string[])]);
      } else {
        data = location.state.user;
        setLinks([...(location.state.user?.externalLinks as string[])]);
        console.log("!");
      }
    },
  });

  const [nowModifying, setNowModifying] = useState(false);

  const navigate = useNavigate();

  const onClick = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (event.currentTarget.id === "modify") {
      setNowModifying((prev) => !prev);
    } else if (event.currentTarget.id === "delete") {
      setIsDeleteModal(true);
    }
  };

  const { mutate: deleteMemberMutate, isLoading: deleteMemberLoading } =
    useMutation(
      ["deleteMember" as string],

      () => memberDelete() as any,

      {
        onSuccess: () => {},
        onError: () => {
          console.log("유저 삭제가 작동하지 않습니다.");
        },
      }
    );

  const { register, handleSubmit, formState, setValue } = useForm();

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

  interface Idata {
    nickname: string;
    department: string;
    position: string;
    grade: string;
    contact: string;
    bio: string;
    club1: string;
    club2: string;
  }

  const onValid = async (newData: Idata) => {
    console.log(formState.errors);
    console.log(newData);
    console.log("de");

    const newUser = {
      nickname: newData.nickname,
      pictureUrl: "/img/user.png",
      isPublic: true,
      department: newData.department,
      position: newData.position,
      bio: newData.bio,
      grade: newData.grade,
      club: [newData.club1, newData.club2],
      contact: newData?.contact,
      externalLinks: Links,
    };

    await memberUpdate(newUser);
    setNowModifying(false);
    refetch();
  };

  const onSidebarClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { id },
    } = event;
    if (id === "1") {
      window.scrollTo(
        (document.querySelector("#profileInfo") as HTMLElement).offsetLeft,
        (document.querySelector("#profileInfo") as HTMLElement).offsetTop
      );
    } else if (id === "2") {
      window.scrollTo(
        (document.querySelector("#myPost") as HTMLElement).offsetLeft,
        (document.querySelector("#myPost") as HTMLElement).offsetTop
      );
    } else if (id === "3") {
      window.scrollTo(
        (document.querySelector("#zzim") as HTMLElement).offsetLeft,
        (document.querySelector("#zzim") as HTMLElement).offsetTop
      );
    } else if (id === "4") {
      window.scrollTo(
        (document.querySelector("#delete") as HTMLElement).offsetLeft,
        (document.querySelector("#delete") as HTMLElement).offsetTop
      );
    }
  };

  const [isDeleteModal, setIsDeleteModal] = useRecoilState(isDeleteModalState);

  return (
    <>
      {getUserLoading || deleteMemberLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          {isDeleteModal ? <DeletePopup /> : null}
          <div className="flex w-[1470px]">
            <Sidebar>
              <SidebarTitle>My profile</SidebarTitle>
              <SidebarItemText onClick={onSidebarClick} id="1">
                프로필 정보
              </SidebarItemText>

              <SidebarItemText onClick={onSidebarClick} id="2">
                내가 쓴 모집글
              </SidebarItemText>
              <SidebarItemText onClick={onSidebarClick} id="3">
                찜한 모집글
              </SidebarItemText>
              <SidebarItemText onClick={onSidebarClick} id="4">
                탈퇴하기
              </SidebarItemText>
            </Sidebar>
            <div className="px-[50px] w-[1220px] border-b-2 border-gray-300">
              <ProfileBanner
                id="profileInfo"
                onSubmit={handleSubmit(onValid as any)}
              >
                <div className=" w-[140px] flex flex-col items-center">
                  <img
                    src="img/user.png"
                    className="w-[100%] h-[120px] rounded-full"
                  />
                  {nowModifying ? (
                    <div className="flex flex-col justify-start items-center">
                      <input
                        type="text"
                        placeholder="닉네임"
                        {...register("nickname", {
                          required: "필수 사항 입니다",
                          maxLength: {
                            value: 10,
                            message: "10자 이하만 가능합니다",
                          },
                        })}
                        className="mt-[20px] text-[17px] px-[10px] w-[150px] "
                      />

                      <AnimatePresence>
                        {(formState.errors.nickname?.message as string) && (
                          <motion.span
                            variants={ValidationVariant}
                            className="text-xs my-auto mt-2"
                            initial="hidden"
                            animate="showing"
                            exit="exit"
                          >
                            * {formState.errors.nickname?.message as string}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-[150px] mt-[20px]">
                      {/* <span className="flex items-center ">
                        <i className="fa-solid fa-user text-gray-600  w-[18px] mr-[2px]"></i>
                        <p className="mr-[10px] text-gray-500 font-semibold">
                          닉네임
                        </p>
                      </span> */}

                      <span className=" text-[17px] font-semibold">
                        {data?.nickname}
                      </span>
                    </div>
                  )}
                </div>
                <div className="w-full pl-[70px] text-[17px] flex flex-col justify-between">
                  <ProfileInfoRow>
                    <ProfileInfoBox>
                      <ProfileInfoIcon className="fa-solid fa-graduation-cap"></ProfileInfoIcon>
                      <ProfileInfoTitle>학부</ProfileInfoTitle>
                    </ProfileInfoBox>
                    {nowModifying ? (
                      <select
                        className="border-2 h-[35px] px-2 rounded-lg"
                        {...register("department")}
                      >
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
                      </select>
                    ) : (
                      <ProfileInfoContent>
                        {data?.department}
                      </ProfileInfoContent>
                    )}
                  </ProfileInfoRow>
                  <ProfileInfoRow>
                    <ProfileInfoBox>
                      <ProfileInfoIcon className="fa-solid fa-wand-magic-sparkles"></ProfileInfoIcon>
                      <ProfileInfoTitle>포지션</ProfileInfoTitle>
                    </ProfileInfoBox>
                    {nowModifying ? (
                      <select
                        className="border-2 h-[35px] px-2 rounded-lg"
                        {...register("position")}
                      >
                        <option>일반</option>
                        <option>기획자</option>
                        <option>개발자</option>
                        <option>디자이너</option>
                      </select>
                    ) : (
                      <ProfileInfoContent>{data?.position}</ProfileInfoContent>
                    )}
                  </ProfileInfoRow>
                  <ProfileInfoRow>
                    <ProfileInfoBox>
                      <ProfileInfoIcon className="fa-solid fa-stairs"></ProfileInfoIcon>
                      <ProfileInfoTitle>학년</ProfileInfoTitle>
                    </ProfileInfoBox>
                    {nowModifying ? (
                      <select
                        className="border-2 h-[35px] px-2 rounded-lg"
                        {...register("grade")}
                      >
                        <option>1학년</option>
                        <option>2학년</option>
                        <option>3학년</option>
                        <option>4학년</option>
                      </select>
                    ) : (
                      <ProfileInfoContent>{data?.grade}</ProfileInfoContent>
                    )}
                  </ProfileInfoRow>

                  <ProfileInfoRow>
                    <ProfileInfoBox>
                      <ProfileInfoIcon className="fa-regular fa-id-card"></ProfileInfoIcon>

                      <ProfileInfoTitle>연락수단</ProfileInfoTitle>
                    </ProfileInfoBox>
                    <ProfileInfoContent>
                      {nowModifying ? (
                        <div>
                          <input
                            className="border-2 h-[35px] px-2 rounded-lg w-[400px]"
                            type="text"
                            {...register("contact", {
                              required: "필수 사항 입니다",
                              maxLength: {
                                value: 30,
                                message: "너무 깁니다.",
                              },
                            })}
                            placeholder="Ex) 전화 번호 , 이메일 , 카톡 아이디 등"
                          />
                          <AnimatePresence>
                            {(formState.errors.contact?.message as string) && (
                              <motion.span
                                variants={ValidationVariant}
                                className="text-xs ml-3"
                                initial="hidden"
                                animate="showing"
                                exit="exit"
                              >
                                * {formState.errors.contact?.message as string}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <ProfileInfoContent>{data?.contact}</ProfileInfoContent>
                      )}
                    </ProfileInfoContent>
                  </ProfileInfoRow>

                  <ProfileInfoRow className="items-start">
                    <ProfileInfoBox>
                      <ProfileInfoIcon className="fa-solid fa-circle-nodes mt-2"></ProfileInfoIcon>

                      <ProfileInfoTitle className="mt-1">
                        동아리 / 학회
                      </ProfileInfoTitle>
                    </ProfileInfoBox>

                    {nowModifying ? (
                      <div className="flex flex-col ">
                        <input
                          {...register(`club1`)}
                          className="border-2 h-[35px] px-2 mb-[10px] rounded-lg w-[400px]"
                          placeholder="최대 2개"
                          type="text"
                          maxLength={20}
                        />

                        <input
                          {...register(`club2`)}
                          className="border-2 h-[35px] px-2 rounded-lg w-[400px]"
                          placeholder="최대 2개"
                          type="text"
                          maxLength={20}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        {data?.club?.map((elem, index) =>
                          data?.club?.at(index) === "" ? null : (
                            <ProfileInfoContent key={index}>
                              {elem}
                            </ProfileInfoContent>
                          )
                        )}
                      </div>
                    )}

                    {/* 
                  <ProfileInfoContent>
                    {nowModifying ? (
                      <input
                        {...register("club1")}
                        className="border-2 h-[30px] px-2 rounded-lg w-[400px]"
                        defaultValue={data?.club}
                        type="text"
                      />
                    ) : (
                      <ProfileInfoContent>{data?.club}</ProfileInfoContent>
                    )}
                  </ProfileInfoContent> */}
                  </ProfileInfoRow>

                  <ProfileInfoRow className=" items-start mb-0">
                    <ProfileInfoBox>
                      <ProfileInfoIcon className="fa-solid fa-link mt-2"></ProfileInfoIcon>
                      <ProfileInfoTitle className="mt-1">
                        외부링크
                      </ProfileInfoTitle>
                    </ProfileInfoBox>

                    {nowModifying ? (
                      <div>
                        <div>
                          <input
                            className="border-2 px-2 rounded-lg w-[400px] h-[35px]"
                            value={externalLink}
                            onChange={onChange}
                            placeholder="ex) github or Linked-In"
                            maxLength={30}
                          />
                          <i
                            onClick={onClickPlus}
                            className="fa-solid fa-plus text-[20px] relative right-7"
                          ></i>
                        </div>

                        {Links?.map((link) => (
                          <div className="flex items-center justify-between bg-slate-200 px-[10px] w-[400px] h-[30px] mt-[10px]">
                            <i className="fa-solid fa-link"></i>
                            {link}{" "}
                            <i
                              className="fa-regular fa-trash-can"
                              onClick={() => onDelete(link)}
                            ></i>
                          </div>
                        ))}

                        {/* {data?.externalLinks?.map((link, index) => (
                      <ProfileInfoContent key={index}>
                        {link}
                      </ProfileInfoContent>
                    ))} */}
                      </div>
                    ) : (
                      <div className="flex flex-col ">
                        {Links?.map((link) => (
                          <div className=" relative flex items-center justify-center bg-slate-200 px-[10px] w-[400px] h-[30px] mb-[10px]">
                            <i className="fa-solid fa-link absolute left-2"></i>
                            {link}{" "}
                          </div>
                        ))}
                      </div>
                    )}
                  </ProfileInfoRow>
                  <ProfileInfoRow
                    className={`${nowModifying && "mt-[20px]"} items-start`}
                  >
                    <ProfileInfoBox>
                      <ProfileInfoIcon className="fa-solid fa-rocket mt-2"></ProfileInfoIcon>
                      <ProfileInfoTitle className="mt-1">
                        자기소개
                      </ProfileInfoTitle>
                    </ProfileInfoBox>
                    <ProfileInfoContent>
                      {nowModifying ? (
                        <textarea
                          {...register("bio")}
                          className="border-2 p-2 rounded-lg w-[400px] h-[100px]"
                          placeholder="자유롭게 작성 해주세요 !"
                          maxLength={150}
                        ></textarea>
                      ) : (
                        <ProfileInfoContent>{data?.bio}</ProfileInfoContent>
                      )}
                    </ProfileInfoContent>
                  </ProfileInfoRow>
                  <div className="w-full">
                    {!location.state &&
                      (nowModifying ? (
                        <>
                          <button
                            id="modify"
                            className="bg-[#fff] w-[120px] h-[32px] border-2 shadow  rounded-full float-right text-gray-500 border-gray-400"
                          >
                            제출하기
                          </button>
                          <button
                            onClick={() => setNowModifying(false)}
                            className="mr-[10px] float-right mb-[40px] rounded-full border-2 border-red-500 text-red-500 w-[120px] bg-white h-[32px] "
                          >
                            {" "}
                            취소하기{" "}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            id="modify"
                            onClick={onClick}
                            className="bg-[#fff] w-[120px] h-[32px] border-2 shadow  rounded-full float-right text-gray-500 border-gray-400"
                          >
                            수정하기
                          </button>
                        </>
                      ))}
                  </div>
                </div>
              </ProfileBanner>

              <span className="mt-[40px] text-[20px] font-medium flex items-center">
                <i className="fa-solid fa-pencil mr-2"> </i>
                <p className="font-bold">내가 쓴 모집글</p>
              </span>

              <PostGrid id="myPost">
                {posts.slice(0, 4).map((post, index) => (
                  <PostItem
                    whileHover={{ scale: 1.08 }}
                    key={index}
                    style={{ boxShadow: "0px 0px 25px rgb(0 0 0 / 0.25)" }}
                  >
                    <PostContentFirstRow
                      className={`${
                        post.dtype === "P"
                          ? "bg-[#e0c3f8]"
                          : post.dtype === "S"
                          ? "bg-[#c7c7c7]"
                          : "bg-[#bdc9f2]"
                      }`}
                    >
                      <PostCategorySpan>
                        <PostCategoryLabel
                          className={`${
                            post.dtype === "P"
                              ? "text-purple-400"
                              : post.dtype === "S"
                              ? "text-gray-400"
                              : "text-blue-400"
                          } `}
                        >
                          {post.dtype === "P"
                            ? "프로젝트"
                            : post.dtype === "S"
                            ? "스터디"
                            : "멘토링"}
                        </PostCategoryLabel>
                      </PostCategorySpan>
                      <HeartIcon className="fa-regular fa-heart"></HeartIcon>
                      {/* <svg
                  width="15px"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    stroke="1"
                    d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z"
                  />
                </svg> */}
                      {/* <p className="mx-5 my-1 text-sm font-bold">개발자</p>
         <p className="text-sm text-blue-500">{post.total}명 모집</p> */}
                    </PostContentFirstRow>

                    <PostMainPart>
                      {/* secondRow */}
                      <PostTitle className="text-lg font-semibold">
                        {post.title.length > 16
                          ? post.title.slice(0, 16) + " ..."
                          : post.title}
                      </PostTitle>

                      {/* ThirdRow */}
                      <PostDate>
                        {(post.projectEnd.getTime() -
                          post.projectStart.getTime()) /
                          (1000 * 24 * 60 * 60) >=
                        365 ? (
                          <PostDatePlan>
                            {Math.floor(
                              (post.projectEnd.getTime() -
                                post.projectStart.getTime()) /
                                (1000 * 24 * 60 * 60 * 365)
                            )}
                            {""}년 플랜
                          </PostDatePlan>
                        ) : (post.projectEnd.getTime() -
                            post.projectStart.getTime()) /
                            (1000 * 24 * 60 * 60) >=
                          30 ? (
                          <PostDatePlan>
                            {Math.floor(
                              (post.projectEnd.getTime() -
                                post.projectStart.getTime()) /
                                (1000 * 24 * 60 * 60 * 30)
                            )}
                            {""}달 플랜
                          </PostDatePlan>
                        ) : (post.projectEnd.getTime() -
                            post.projectStart.getTime()) /
                            (1000 * 24 * 60 * 60) >=
                          7 ? (
                          <PostDatePlan>
                            {Math.floor(
                              (post.projectEnd.getTime() -
                                post.projectStart.getTime()) /
                                (1000 * 24 * 60 * 60 * 7)
                            )}
                            {""}주 플랜
                          </PostDatePlan>
                        ) : (
                          <PostDatePlan>
                            {Math.floor(
                              (post.projectEnd.getTime() -
                                post.projectStart.getTime()) /
                                (1000 * 24 * 60 * 60)
                            )}
                            {""}일 플랜
                          </PostDatePlan>
                        )}
                        <p className="mx-[7px] pb-0.5">|</p>
                        <PostDateStart>
                          {" "}
                          {post.projectStart.getMonth()}월{" "}
                          {post.projectStart.getDate()}일 시작
                        </PostDateStart>
                      </PostDate>

                      {/* lastRow */}
                      <PostPerson>
                        <PostPersonTotal>
                          {post.dtype === "P"
                            ? post.maxDesigner +
                              post.maxDeveloper +
                              post.maxPlanner
                            : post.dtype === "S"
                            ? post.maxMember
                            : post.maxMentee + post.maxMentor}
                          명 모집
                        </PostPersonTotal>

                        {post.dtype === "P" ? (
                          <>
                            {post.maxDeveloper !== 0 && (
                              <PostPersonPosition>
                                개발자 {post.maxDeveloper}명
                              </PostPersonPosition>
                            )}
                            {post.maxPlanner !== 0 && (
                              <PostPersonPosition>
                                기획자 {post.maxPlanner}명
                              </PostPersonPosition>
                            )}

                            {post.maxDesigner !== 0 && (
                              <PostPersonPosition>
                                디자이너 {post.maxDesigner}명
                              </PostPersonPosition>
                            )}
                          </>
                        ) : post.dtype === "S" ? (
                          post.maxMember !== 0 && (
                            <PostPersonPosition>
                              스터디원 {post.maxMember}명
                            </PostPersonPosition>
                          )
                        ) : (
                          <>
                            {post.maxMentor !== 0 && (
                              <PostPersonPosition>
                                멘토 {post.maxMentor}명
                              </PostPersonPosition>
                            )}
                            {post.maxMentee !== 0 && (
                              <PostPersonPosition>
                                멘티 {post.maxMentee}명
                              </PostPersonPosition>
                            )}
                          </>
                        )}
                      </PostPerson>
                    </PostMainPart>
                  </PostItem>
                ))}
              </PostGrid>

              <span className="mt-[40px] text-[20px] font-medium flex items-center">
                <i className="fa-solid fa-heart text-red-600 mr-2"></i>
                <p className="font-bold">찜한 모집글</p>
              </span>

              <PostGrid id="zzim">
                {posts.slice(3, 6).map((post, index) => (
                  <PostItem
                    whileHover={{ scale: 1.08 }}
                    key={index}
                    style={{ boxShadow: "0px 0px 25px rgb(0 0 0 / 0.25)" }}
                  >
                    <PostContentFirstRow
                      className={`${
                        post.dtype === "P"
                          ? "bg-[#e0c3f8]"
                          : post.dtype === "S"
                          ? "bg-[#c7c7c7]"
                          : "bg-[#bdc9f2]"
                      }`}
                    >
                      <PostCategorySpan>
                        <PostCategoryLabel
                          className={`${
                            post.dtype === "P"
                              ? "text-purple-400"
                              : post.dtype === "S"
                              ? "text-gray-400"
                              : "text-blue-400"
                          } `}
                        >
                          {post.dtype === "P"
                            ? "프로젝트"
                            : post.dtype === "S"
                            ? "스터디"
                            : "멘토링"}
                        </PostCategoryLabel>
                      </PostCategorySpan>
                      <HeartIcon className="fa-regular fa-heart"></HeartIcon>
                      {/* <svg
                  width="15px"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    stroke="1"
                    d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z"
                  />
                </svg> */}
                      {/* <p className="mx-5 my-1 text-sm font-bold">개발자</p>
         <p className="text-sm text-blue-500">{post.total}명 모집</p> */}
                    </PostContentFirstRow>

                    <PostMainPart>
                      {/* secondRow */}
                      <PostTitle className="text-lg font-semibold">
                        {post.title.length > 16
                          ? post.title.slice(0, 16) + " ..."
                          : post.title}
                      </PostTitle>

                      {/* ThirdRow */}
                      <PostDate>
                        {(post.projectEnd.getTime() -
                          post.projectStart.getTime()) /
                          (1000 * 24 * 60 * 60) >=
                        365 ? (
                          <PostDatePlan>
                            {Math.floor(
                              (post.projectEnd.getTime() -
                                post.projectStart.getTime()) /
                                (1000 * 24 * 60 * 60 * 365)
                            )}
                            {""}년 플랜
                          </PostDatePlan>
                        ) : (post.projectEnd.getTime() -
                            post.projectStart.getTime()) /
                            (1000 * 24 * 60 * 60) >=
                          30 ? (
                          <PostDatePlan>
                            {Math.floor(
                              (post.projectEnd.getTime() -
                                post.projectStart.getTime()) /
                                (1000 * 24 * 60 * 60 * 30)
                            )}
                            {""}달 플랜
                          </PostDatePlan>
                        ) : (post.projectEnd.getTime() -
                            post.projectStart.getTime()) /
                            (1000 * 24 * 60 * 60) >=
                          7 ? (
                          <PostDatePlan>
                            {Math.floor(
                              (post.projectEnd.getTime() -
                                post.projectStart.getTime()) /
                                (1000 * 24 * 60 * 60 * 7)
                            )}
                            {""}주 플랜
                          </PostDatePlan>
                        ) : (
                          <PostDatePlan>
                            {Math.floor(
                              (post.projectEnd.getTime() -
                                post.projectStart.getTime()) /
                                (1000 * 24 * 60 * 60)
                            )}
                            {""}일 플랜
                          </PostDatePlan>
                        )}
                        <p className="mx-[7px] pb-0.5">|</p>
                        <PostDateStart>
                          {" "}
                          {post.projectStart.getMonth()}월{" "}
                          {post.projectStart.getDate()}일 시작
                        </PostDateStart>
                      </PostDate>

                      {/* lastRow */}
                      <PostPerson>
                        <PostPersonTotal>
                          {post.dtype === "P"
                            ? post.maxDesigner +
                              post.maxDeveloper +
                              post.maxPlanner
                            : post.dtype === "S"
                            ? post.maxMember
                            : post.maxMentee + post.maxMentor}
                          명 모집
                        </PostPersonTotal>

                        {post.dtype === "P" ? (
                          <>
                            {post.maxDeveloper !== 0 && (
                              <PostPersonPosition>
                                개발자 {post.maxDeveloper}명
                              </PostPersonPosition>
                            )}
                            {post.maxPlanner !== 0 && (
                              <PostPersonPosition>
                                기획자 {post.maxPlanner}명
                              </PostPersonPosition>
                            )}

                            {post.maxDesigner !== 0 && (
                              <PostPersonPosition>
                                디자이너 {post.maxDesigner}명
                              </PostPersonPosition>
                            )}
                          </>
                        ) : post.dtype === "S" ? (
                          post.maxMember !== 0 && (
                            <PostPersonPosition>
                              스터디원 {post.maxMember}명
                            </PostPersonPosition>
                          )
                        ) : (
                          <>
                            {post.maxMentor !== 0 && (
                              <PostPersonPosition>
                                멘토 {post.maxMentor}명
                              </PostPersonPosition>
                            )}
                            {post.maxMentee !== 0 && (
                              <PostPersonPosition>
                                멘티 {post.maxMentee}명
                              </PostPersonPosition>
                            )}
                          </>
                        )}
                      </PostPerson>
                    </PostMainPart>
                  </PostItem>
                ))}
              </PostGrid>

              {/* 
              <span className="text-[20px] font-semibold">추가정보입력</span>

              <div className="my-[40px]">
                <div className="flex gap-10">
                  <span className="pt-[40px] flex flex-col w-1/2">
                    <label className="font-[16px] font-medium">
                      동아리 / 학회
                    </label>
                    <input
                      className="bg-[#eeeeee] rounded-full h-[30px] mt-[15px]"
                      type="text"
                    />
                  </span>

                  <span className="pt-[40px] flex flex-col w-1/2">
                    <label className="font-[16px] font-medium">
                      이메일 주소
                    </label>
                    <input
                      className="bg-[#eeeeee] rounded-full h-[30px] mt-[15px]"
                      type="text"
                    />
                  </span>
                </div>

                <div className="flex gap-10">
                  <span className="pt-[40px] flex flex-col w-1/2">
                    <label className="font-[16px] font-medium">연락 수단</label>
                    <input
                      className="bg-[#eeeeee] rounded-full h-[30px] mt-[15px]"
                      type="text"
                      placeholder="ex) 번호, 카카오톡 오픈채팅 ID..."
                    />
                  </span>

                  <span className="pt-[40px] flex flex-col w-1/2">
                    <label className="font-[16px] font-medium">외부링크</label>
                    <input
                      className="bg-[#eeeeee] rounded-full h-[30px] mt-[15px]"
                      type="text"
                      placeholder="ex) Github, Instagram, Blog ..."
                    />
                  </span>
                </div>

                <div className="flex justify-end">
                  <button className=" mt-[40px] rounded-full border w-[130px] h-[30px]">
                    {" "}
                    수정하기{" "}
                  </button>
                </div>
              </div> */}
              {!location.state && (
                <button
                  onClick={onClick}
                  id="delete"
                  className="float-right mb-[40px] rounded-full border-2 border-red-500 text-red-500 w-[130px] h-[30px] "
                >
                  {" "}
                  탈퇴하기{" "}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Profile;
