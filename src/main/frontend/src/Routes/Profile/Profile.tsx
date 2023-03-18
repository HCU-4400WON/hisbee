import {
  ref,
  getDownloadURL,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../firebase";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addLikePost,
  deleteLikePost,
  IPost,
  IUser,
  memberDelete,
  memberProfile,
  memberUpdate,
  posts,
} from "api";
import { AxiosError, AxiosResponse } from "axios";
import {
  isDeleteModalState,
  isLoginModalState,
  isLoginState,
} from "components/atom";
import DeletePopup from "Routes/Profile/DeleteModal";
import LoadingAnimation from "components/LoadingAnimation";
import { AnimatePresence, motion } from "framer-motion";
import { userInfo } from "os";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useMatch } from "react-router";
import { Navigate, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import tw from "tailwind-styled-components";
import Card from "Routes/Profile/Card";

const Container = tw.div`
flex
`

const Main = tw.div`
px-[50px] 
w-full 
min-w-[530px] 
lg:w-5/6 border-t-2 
border-b-2 
border-gray-200 
`

const Sidebar = tw.div`
hidden
bg-gray-100
lg:flex
min-w-[220px] 
pl-[30px]
border-r-2
border-t-2
border-gray-200
border-b-2
min-h-screen
flex-col
items-start

`;

const SidebarTitle = tw.p`
py-[40px] 
text-[30px] 
font-unique
`;

const SidebarItemText = tw.button`
font-unique
text-[15px]
mb-[20px]

hover:scale-110
hover:text-gray-400
`;

const ProfileInfoRow = tw.div`
  w-full
  flex
  my-[10px]
  h-auto
  items-center
  text-[13px]
  lg:text-[17px]
`;

const ProfileInfoBox = tw.div`
flex 
items-center 
w-[110px]
lg:w-[180px]

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

const ProfileInfoContent = tw.span`
min-w-[230px]
md:min-w-[300px]
font-main


`;

const ProfileBanner = tw.form`
shadow-md
my-[40px] 
rounded-xl 
bg-[#f2f2f2] 
p-[40px] 
flex
flex-col
md:flex-row
items-center
md:items-start

`;

const PostGrid = tw.div`

gap-20
p-10
flex
white
whitespace-nowrap
overflow-scroll
justify-start
mt-[0px]
mb-[80px]

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

const PostItemVariant = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  showing: {
    scale: 1,
    opacity: 1,
  },
  hidden: {
    scale: 0,
    opacity: 0,
  },
};

function Profile() {
  const location = useLocation();
  console.log(location);

  const [onSuccessLoading, setOnSuccessLoading] = useState(true);

  const {
    isLoading: getUserLoading,
    data,
    refetch,
  } = useQuery<IUser>(
    ["User", location.state ? location.state.user.nickname : "me"],
    memberProfile,
    {
      onSuccess: async (data) => {
        if (!location.state) {
          setLinks([...(data?.externalLinks as string[])]);
        } else {
          const newData: IUser = location.state.user;
          data.bio = newData.bio;
          data.club = newData.club;
          data.contact = newData.contact;
          data.department = newData.department;
          data.email = newData.email;
          // data.externalLinks = newData.externalLinks;
          data.grade = newData.grade;
          data.isPublic = newData.isPublic;
          data.likes = newData.likes;
          data.nickname = newData.nickname;
          data.pictureUrl = newData.pictureUrl;
          data.position = newData.position;
          data.posts = newData.posts;

          setLinks([...(location.state.user?.externalLinks as string[])]);
        }

        setValue("nickname", data.nickname);
        setValue("pictureUrl", data.pictureUrl);
        setValue("department", data.department);
        setValue("position", data.position);
        setValue("contact", data.contact);
        setValue("club1", data.club?.at(0));
        setValue("club2", data.club?.at(1));
        setValue("bio", data.bio);

        setOnSuccessLoading(false);
      },
      onError: (error) => {
        if (((error as AxiosError).response as AxiosResponse).status === 401) {
          alert("로그인이 필요합니다.");
          setIsLoginModal(true);
          setIsLogin(false);
          if (localStorage.getItem("key")) localStorage.removeItem("key");
          navigate("/");
        }
      },
    }
  );

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


  const { register, handleSubmit, formState, setValue, getValues } = useForm();

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
    pictureUrl: string;
  }

  const onValid = async (newData: Idata) => {
    console.log(formState.errors);
    console.log("before", newData);

    let arr = new Array<string>();
    if (newData.club1) arr.push(newData.club1);
    if (newData.club2) arr.push(newData.club2);

    const newUser = {
      nickname: newData.nickname,
      pictureUrl:
        newData.pictureUrl.slice(5, 13) !== "position"
          ? newData.pictureUrl
          : newData.position === "일반"
          ? "/img/position4.png"
          : newData.position === "기획자"
          ? "/img/position3.png"
          : newData.position === "디자이너"
          ? "/img/position2.png"
          : "/img/position1.png",
      isPublic: true,
      department: newData.department,
      position: newData.position,
      bio: newData.bio,
      grade: newData.grade,
      // club: [
      //   newData.club1 === undefined,
      //   newData.club2 === false newData.club2,
      // ],
      club: arr,
      contact: newData?.contact,
      externalLinks: Links,
    };

    await memberUpdate(newUser as any);
    setNowModifying(false);
    refetch();
  };

  const onSidebarClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { id },
    } = event;
    const scrollToTarget = (target : string) => window.scrollTo(
      (document.querySelector(target) as HTMLElement).offsetLeft,
      (document.querySelector(target) as HTMLElement).offsetTop
    );

    if (id === "1") {
      scrollToTarget("#profileInfo")
    } else if (id === "2") {
      scrollToTarget("#myPost")
    } else if (id === "3") {
      scrollToTarget("#zzim")
    } else if (id === "4") {
      scrollToTarget("#delete")
    }
  };

  const [isDeleteModal, setIsDeleteModal] = useRecoilState(isDeleteModalState);

  const setIsLogin = useSetRecoilState(isLoginState);
  const setIsLoginModal = useSetRecoilState(isLoginModalState);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const onUploadImageButtonClick = useCallback(() => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.click();
  }, []);

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
        // setProgressPercent(progress);
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
          setValue("pictureUrl", downloadURL);
          (
            document.querySelector("#basicImage") as HTMLElement
          ).style.backgroundColor = "white";
          (document.querySelector("#basicImage") as HTMLElement).style.color =
            "black";
          
        });
      }
    );
  };
  const [imageURL, setImageURL] = useState<string>("");
  const onBasicImageClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = "black";
    e.currentTarget.style.color = "white";

    setValue("pictureUrl", "/img/position4.png");
  };
  return (
    <>
      {onSuccessLoading || getUserLoading  ? (
        <LoadingAnimation />
      ) : (
        <>
          {isDeleteModal ? <DeletePopup /> : null}
          <Container>
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
            <Main>
              <ProfileBanner
                id="profileInfo"
                className="relative"
                onSubmit={handleSubmit(onValid as any)}
              >
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  onChange={onImageChange}
                />
                {nowModifying && (
                  <div className="absolute items-center justify-between flex left-[30px] top-[20px] w-[90%] md:w-[190px]">
                    <i
                      className="fa-solid fa-panorama w-[40px]"
                      onClick={onUploadImageButtonClick}
                    ></i>
                    <button
                      id="basicImage"
                      className=" text-[10px] border-[2px] font-bold px-2 rounded-md border-black"
                      onClick={onBasicImageClick}
                    >
                      기본 이미지
                    </button>
                  </div>
                )}

                <div className="w-[120px] flex flex-col items-center ">
                  {nowModifying ? (
                    <img
                      className="w-[100%] h-[120px] border border-black rounded-full my-[10px]"
                      src={getValues("pictureUrl")}
                    ></img>
                  ) : (
                    <img
                      src={data?.pictureUrl}
                      className="w-[100%] h-[120px] border-black rounded-full my-[10px]"
                    />
                  )}

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
                        className="mt-[10px] text-[17px] px-[10px] w-[150px] rounded-md border-2 border-gray-200"
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
                    <div className="flex items-center justify-center w-[150px] mt-[10px]">
                      

                      <span className=" text-[17px] font-semibold text-gray-500 bg-white px-[20px]">
                        <i className="fa-solid fa-user mr-[10px] text-gray-600"></i>
                        {data?.nickname}
                      </span>
                    </div>
                  )}
                </div>
                <div className="md:pl-[70px] w-full text-[17px] flex flex-col justify-between mt-[20px] md:mt-[0px]">
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
                            className="border-2 h-[35px] px-2 rounded-lg w-[200px] lg:w-[300px] xl:w-[400px]"
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
                      <ProfileInfoIcon className="fa-solid fa-circle-nodes "></ProfileInfoIcon>

                      <ProfileInfoTitle>동아리 / 학회</ProfileInfoTitle>
                    </ProfileInfoBox>

                    {nowModifying ? (
                      <div className="flex flex-col ">
                        <input
                          {...register(`club1`)}
                          className="border-2 h-[35px] px-2 mb-[10px] rounded-lg w-[200px] lg:w-[300px] xl:w-[400px]"
                          placeholder="최대 2개"
                          type="text"
                          maxLength={20}
                        />

                        <input
                          {...register(`club2`)}
                          className="border-2 h-[35px] px-2 rounded-lg w-[200px] lg:w-[300px] xl:w-[400px]"
                          placeholder="최대 2개"
                          type="text"
                          maxLength={20}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        {data?.club?.map((elem, index) =>
                          data?.club?.at(index) === "" ? null : (
                            <ProfileInfoContent
                              className="flex relative items-center justify-center bg-gray-200 my-1 py-[3px] px-[10px]"
                              key={index}
                            >
                              <ProfileInfoIcon className="absolute left-2 fa-solid fa-circle-nodes "></ProfileInfoIcon>
                              <p>{elem}</p>
                            </ProfileInfoContent>
                          )
                        )}
                      </div>
                    )}

                  </ProfileInfoRow>

                  <ProfileInfoRow className=" items-start mb-0 mt-[8px]">
                    <ProfileInfoBox>
                      <ProfileInfoIcon className="fa-solid fa-link"></ProfileInfoIcon>
                      <ProfileInfoTitle className="">외부링크</ProfileInfoTitle>
                    </ProfileInfoBox>

                    {nowModifying ? (
                      <div>
                        <div className="flex items-center">
                          <input
                            className="border-2 px-2 rounded-lg w-[200px] lg:w-[300px] xl:w-[400px] h-[35px]"
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

                        {Links.length !== 0 &&
                          Links?.map((link) => (
                            <div className="flex items-center justify-between bg-slate-200 px-[10px] w-[200px] lg:w-[300px] xl:w-[400px]  h-[30px] mt-[10px]">
                              <i className="fa-solid fa-link"></i>
                              <p>{link} </p>
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
                          <div className="relative flex items-center justify-center w-[230px] md:min-w-[300px] bg-slate-200 h-[30px] mb-[10px]">
                            <i className="fa-solid fa-link absolute left-2"></i>
                            <p>{link} </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </ProfileInfoRow>
                  <ProfileInfoRow
                    className={`${nowModifying && "mt-[20px]"} items-start`}
                  >
                    <ProfileInfoBox className="">
                      <ProfileInfoIcon className="fa-solid fa-rocket"></ProfileInfoIcon>
                      <ProfileInfoTitle>자기소개</ProfileInfoTitle>
                    </ProfileInfoBox>
                    <ProfileInfoContent>
                      {nowModifying ? (
                        <textarea
                          {...register("bio")}
                          className="border-2 p-2 rounded-lg w-[200px] lg:w-[300px] xl:w-[400px] h-[100px]"
                          placeholder="자유롭게 작성 해주세요 !"
                          maxLength={150}
                        ></textarea>
                      ) : (
                        <ProfileInfoContent>{data?.bio}</ProfileInfoContent>
                      )}
                    </ProfileInfoContent>
                  </ProfileInfoRow>
                  <div className="flex justify-center md:justify-end ">
                    {!location.state &&
                      (nowModifying ? (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              refetch();
                              setNowModifying(false);
                            }}
                            className="mb-[40px]  rounded-full border-2 border-red-500 text-red-500 w-[80px] bg-white text-[13px] mt-[20px] md:text-[17px] md:w-[120px] md:h-[30px] h-[25px] "
                          >
                            {" "}
                            취소하기{" "}
                          </button>
                          <button
                            id="modify"
                            className="bg-[#fff] ml-2 w-[80px] text-[13px] mt-[20px] md:text-[17px] md:w-[120px] md:h-[30px] h-[25px] border-2 shadow  rounded-full text-gray-500 border-gray-400"
                          >
                            제출하기
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            id="modify"
                            onClick={onClick}
                            className="bg-[#fff] w-[80px] text-[13px] mt-[10px] md:mt-[0px] md:text-[17px] md:w-[120px] md:h-[30px] h-[25px] border-2 shadow rounded-full  text-gray-500 border-gray-400"
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
                <p className="font-bold font-unique">내가 쓴 모집글</p>
              </span>

              <PostGrid id="myPost">
              <AnimatePresence>
                {(data?.posts as IPost[]).map((post, index) => (
                
      <Card post={post} refetch={refetch} key={index} />
      
                ))}
                </AnimatePresence>
              </PostGrid>

              <span className="mt-[40px] text-[20px] font-medium flex items-center">
                <i className="fa-solid fa-heart text-red-600 mr-2"></i>
                <p className="font-bold font-unique">찜한 모집글</p>
              </span>

              <PostGrid id="zzim">
              <AnimatePresence>
                  {data?.likes?.map((post, index) => (
                      <Card post={post} refetch={refetch}  variants={PostItemVariant}
                                      initial="initial"
                                      animate="showing"
                                      exit="hidden"
                                      key={index}
                                      />
  
                  ))}
                  </AnimatePresence>
              </PostGrid>

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
            </Main>
          </Container>
        </>
      )}
    </>
  );
}

export default Profile;
