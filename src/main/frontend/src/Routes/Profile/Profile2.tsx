import { useQuery } from "@tanstack/react-query";
import {
  IOneUser,
  IReadOnePost,
  IUserRead,
  IUserSignup,
  IUserUpdate,
  memberUpdate,
  readOneMember,
} from "api";
import { AxiosError, AxiosResponse } from "axios";
import {
  isDeleteModalState,
  isLoginModalState,
  isLoginState,
} from "components/atom";
import { FunctionButton } from "components/FunctionButton";
import Outline from "components/Outline";
import ProfileLottie from "components/ProfileLottie";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import UserProfileInputs from "Routes/Main/UserProfileInputs";
import { PostExamples } from "Routes/PostAddForm/components/PostExamples";
import tw from "tailwind-styled-components";
import DeleteModal from "./DeleteModal";
import Thumbnail from "./Thumbnail";

const PostGrid = tw.div`
grid
grid-cols-1
sm:grid-cols-1
md:grid-cols-2
xl:grid-cols-3
2xl:grid-cols-4
gap-x-[20px]
mt-[30px]

w-[300px]
md:w-[660px]
xl:w-[1000px]
2xl:w-[1300px]

mx-auto
md:mx-0

`;

const ProfileBlock = tw.div`

`;
const ProfileInfoBox = tw.div`
flex 

w-[230px]

`;

const ProfileInfoTitle = tw.p`
w-[150px] 
text-gray-500
font-medium
`;

const ProfileInfoIcon = tw.i`
text-gray-600
mr-2
`;

const Sidebar = tw.div`
sticky
top-0

flex
min-w-[240px] 
pl-[30px]

h-[100px]
min-h-screen
flex-col
items-start

`;

const SidebarButton = tw.button`
flex
justify-start
items-center
my-[5px]
pl-[5px]
pr-[40px]
w-[180px]
py-[8px]
rounded-lg
align-left
text-gray-400
text-[16px]

hover:text-gray-500
hover:bg-gray-100
`;

const SidebarTitle = tw.p`
py-[20px] 
text-[20px] 
`;

const Banner = tw.form`
py-[50px] bg-slate-100 flex
border-b border-gray-200
`;

const Button = tw.button`
px-[20px] py-[5px] rounded-lg mr-[10px] 
`;
function Profile2() {
  const navigate = useNavigate();
  const setIsLogin = useSetRecoilState(isLoginState);
  const setIsLoginModal = useSetRecoilState(isLoginModalState);

  const {
    isLoading: getUserLoading,
    data,
    refetch,
  } = useQuery<IUserRead>(["User", "me"], readOneMember, {
    onSuccess: async (data) => {
      setValue("nickname", data.profile.nickname);
      setValue("major1", data?.profile.major1);
      setValue("major2", data?.profile?.major2);
      // console.log(data);
    },
    onError: (error) => {
      // if (((error as AxiosError).response as AxiosResponse).status === 401) {
      //   alert("로그인이 필요합니다.");
      //   setIsLoginModal(true);
      //   setIsLogin(false);
      //   if (localStorage.getItem("key")) localStorage.removeItem("key");
      //   navigate("/");
    },
  });

  const { register, handleSubmit, formState, setValue, getValues, watch } =
    useForm({
      defaultValues: {
        nickname: "",
        major1: "",
        major2: "",
        canMajor1: "",
        canMajor2: "",
      },
    });

  watch(["major1", "major2", "nickname", "canMajor1", "canMajor2"]);

  const [modifyToggle, setModifyToggle] = useState<boolean>(false);

  const onProfileModify = () => {
    setModifyToggle(true);
  };

  const [isDeleteModal, setIsDeleteModal] = useRecoilState(isDeleteModalState);

  const onDeleteClick = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDeleteModal(true);
  };

  const [mode, setMode] = useState("likes");

  const onValid = async (submitData: IUserUpdate) => {
    const newMember: IUserUpdate = {
      nickname: submitData.nickname,
      major1: submitData?.major1 === "" ? "해당없음" : submitData.major1,
      major2: submitData.major2 === "" ? "해당없음" : submitData.major2,
    };
    // console.log("수정", newMember);
    if (checkSubmit()) {
      await memberUpdate(newMember);
      setModifyToggle(false);
    } else return;
    // memberSignUp(newMember);
    // memberSignUp(newMember);

    // setIsExtraSignupModal(true);
    // signupMemberMutate(newMember);
    // navigate("/oauth2/redirect/optional");
  };

  const [filter, setFilter] = useState("전체");

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFilter(e.currentTarget.innerText);
  };

  const postFiltering = (
    data: IUserRead,
    paraMode: string,
    paraFilter: string
  ) => {
    if (paraMode === "likes") {
      switch (paraFilter) {
        case "전체":
          return data?.likes;
        case "모집 중인 글":
          return data?.likes.filter((post) => !post.closed);
        case "마감된 글":
          return data?.likes.filter((post) => post.closed || post.archived);
      }
    } else if (paraMode === "posts") {
      switch (paraFilter) {
        case "전체":
          return data.posts;
        case "게시 중인 글":
          return data.posts.filter((post) => !post.archived);
        case "숨긴 글":
          return data.posts.filter((post) => post.archived);
      }
    }
  };

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

  return (
    <Outline>
      {isDeleteModal && <DeleteModal />}
      <Helmet>
        <title>{data?.profile.nickname}</title>
      </Helmet>
      <div className="w-full flex">
        <Sidebar>
          <SidebarTitle className="relative">마이 페이지</SidebarTitle>

          <SidebarButton
            className={` ${mode === "likes" && "bg-blue-100 text-blue-600"}`}
            onClick={() => {
              if (mode !== "likes") setFilter("전체");
              setMode("likes");
            }}
          >
            <i className="fa-regular fa-heart mx-[10px]"></i>
            좋아요한 글
          </SidebarButton>

          <SidebarButton
            className={` ${mode === "posts" && "bg-blue-100 text-blue-600"}`}
            onClick={() => {
              if (mode !== "posts") setFilter("전체");
              setMode("posts");
            }}
          >
            <i className="fa-solid fa-pencil mx-[10px] "></i>
            작성한 글
          </SidebarButton>
          {/* <SidebarButton
            className={` ${mode === "archives" && "bg-blue-100 text-blue-600"}`}
            onClick={() => setMode("archives")}
          >
            <i className="fa-solid fa-pencil mx-[10px] "></i>
            보관한 글
          </SidebarButton> */}

          <SidebarButton
            onClick={onDeleteClick}
            className="absolute top-[600px] hover:bg-red-100 hover:text-red-500"
          >
            <i className="fa-solid fa-user-slash mx-[10px]"></i>탈퇴하기
          </SidebarButton>
        </Sidebar>
        <div className="w-full  ">
          <Banner
            className="flex justify-center items-center"
            onSubmit={handleSubmit(onValid as any)}
          >
            <div className="flex w-full px-[100px] py-[10px]">
              <div className="w-[150px] h-[150px] rounded-xl overflow-hidden mr-[50px]">
                <img
                  src="./img/bonobono.png"
                  className="mr-[100px] w-full border-0 "
                />
              </div>
              <div className="flex flex-col">
                {modifyToggle ? (
                  <>
                    <UserProfileInputs
                      watch={watch}
                      register={register}
                      getValues={getValues}
                      setValue={setValue}
                      formState={formState}
                      inputBgColor="bg-slate-100"
                    />
                    <div className="flex justify-end mt-[60px]">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();

                          //   refetch()
                          setModifyToggle(false);
                        }}
                        className="bg-red-100 text-red-400 rounded-lg px-[20px] py-[7px] text-[13px] mr-[10px]"
                      >
                        편집 취소
                      </button>

                      {checkSubmit() === true ? (
                        <button
                          // type="submit"
                          onClick={() => {
                            // await memberUpdate(newUser as any);
                            // setNowModifying(false);
                            // refetch();
                          }}
                          className="bg-blue-500 text-white rounded-lg px-[20px] py-[7px] text-[13px]"
                        >
                          편집 완료
                        </button>
                      ) : (
                        <button
                          className="bg-gray-200 text-gray-400 rounded-lg px-[20px] py-[7px] text-[13px]"
                          disabled
                        >
                          편집 완료
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-start mt-[10px]">
                      <div className=" mr-[40px]">{getValues("nickname")}</div>
                    </div>
                    <div>
                      <div className=" text-gray-500 mt-[10px] mb-[30px]">
                        {getValues("major1") as any}
                        {getValues("major2") !== "" &&
                          getValues("major2") !== null &&
                          " / " + getValues("major2")}
                      </div>
                      <FunctionButton
                        text="프로필 편집"
                        onClick={onProfileModify}
                      ></FunctionButton>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Banner>

          {/* 글 가져 오기 */}
          {/* <div className="bg-gray-100 flex justify-center">
            <p className="text-[16px] font-bold text-blue-600">
              {mode === "likes"
                ? "좋아요 한 글"
                : mode === "posts"
                ? "작성한 글"
                : "보관한 글"}
            </p>
          </div> */}
          <div className="py-[50px] px-[50px] bg-gray-100 min-h-[500px]">
            <div className="flex justify-center md:justify-start">
              {mode === "likes"
                ? ["전체", "모집 중인 글", "마감된 글"].map((str, index) => (
                    <Button
                      key={index}
                      className={`${
                        filter === str ? "bg-blue-100" : "bg-gray-200"
                      } `}
                      onClick={handleClick}
                    >
                      {str}
                    </Button>
                  ))
                : ["전체", "게시 중인 글", "숨긴 글"].map((str, index) => (
                    <Button
                      key={index}
                      className={`${
                        filter === str ? "bg-blue-100" : "bg-gray-200"
                      } `}
                      onClick={handleClick}
                    >
                      {str}
                    </Button>
                  ))}
            </div>

            <PostGrid>
              {postFiltering(data as IUserRead, mode, filter)?.map(
                (post: IReadOnePost, index: number) => (
                  <Link key={index} to={`/post/${post?.id}`}>
                    <Thumbnail {...post} refetch={refetch} />
                  </Link>
                )
              )}
            </PostGrid>
            {postFiltering(data as IUserRead, mode, filter)?.length === 0 && (
              <div className="flex justify-center bg-gray-100 items-center w-full h-[50px] text-[17px] text-black mt-[100px]">
                <i className="fa-solid fa-circle-exclamation text-black mx-[10px]">
                  &nbsp;
                </i>
                <p className="font-bold">게시물이 존재하지 않습니다</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Outline>
  );
}

export default Profile2;
