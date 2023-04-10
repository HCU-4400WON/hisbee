import {
  MutationFunction,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addLikePost,
  deleteLikePost,
  IPost,
  IPosts,
  loginCheckApi,
  readPosts,
} from "api";
import { Axios, AxiosError, AxiosResponse } from "axios";
import {
  isExtraSignupModalState,
  isLoginModalState,
  isLoginState,
  isSignupModalState,
} from "components/atom";
import Card from "Routes/Post/Card";
import LoadingAnimation from "components/LoadingAnimation";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import tw from "tailwind-styled-components";
import { runInThisContext } from "vm";
import Login from "../../components/LoginModal";
import SignUp from "./SignUp";
import SignUpOptional from "./SignUpOptional";

const Container = tw.div`
min-w-[480px] 
mb-[440px] 
w-screen

`;

const titles = [
  "🔥 요즘 핫한 모집글",
  "👨‍🎨 신규 모집글",
  "👨‍👦‍👦 모집인원 임박! 모집글",
  "📢 마감임박! 모집글",
];

const Banner = tw.img`
w-max

bg-gradient-to-r from-gray-200 to-gray-500
mb-[50px]
`;

const PostCategory = tw.div`
mx-5
`;

const TitleRow = tw.div`

flex 
justify-between 
mx-4
mt-20 
mb-10
`;

const TitleSpan = tw.span`
flex 
jusify-between 
min-w-[260px]
`;

const Title = tw.p`
text-xl
font-unique
`;

const PostContainer = tw.div`
relative 
mx-4
`;

const PostGrid = tw(motion.div)`
absolute
flex 
justify-center
md:justify-between
gap-2
w-full
`;

const PostItem = tw(motion.div)`

relative
h-[210px]
w-[320px]
rounded-md
overflow-hidden
z-0
shadow-lg

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

const HeartSpan = tw.span``;

const HeartIcon = tw(motion.i)`
`;

const PostMainPart = tw.div`
bg-[#e9e9eb] 
w-full 
h-full 
px-[20px] 
py-[15px]
`;

const PostTitle = tw.p`
pb-[8px]
font-unique
text-lg 
`;
const PostDate = tw.div`
flex 
text-[12px]
font-semibold 
items-center
`;

const PostDatePlan = tw.p``;
const PostDateStart = tw.p``;

const PostPerson = tw.div`
absolute 
left-[20px] 
bottom-[15px] 
flex 
items-center 
gap-2
`;

const PostPersonTotal = tw.p`
text-[#185ee4] 
flex
font-bold 
text-[14px]
`;

const PostPersonPosition = tw.span`
border-gray-400 
border 
rounded-full 
px-[5px] 
text-[10px] 
text-gray-500 
font-medium

`;

const MAX_WIDTH = window.innerWidth;
console.log(MAX_WIDTH);
const NUM_POSTS = 12;

interface IwindowSize {
  width: number;
  height: number;
}

interface IProps {
  windowSize: IwindowSize;
  leaving: boolean;
}

const postsVariants = {
  hidden: ({ windowSize }: IProps) => ({
    x: windowSize.width,
    // x: 1500,
  }),
  showing: {
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
  exit: (windowSize: any) => ({
    x: -windowSize.windowSize.width,
    // x: -1500,
    transition: {
      duration: 0.5,
    },
  }),
  hover: ({ leaving }: IProps) => ({
    scale: leaving ? 1 : 1.05,
    // opacity: 0.4,
    // zIndex: 1,
    transition: {
      // delay: 0.1,
      duration: 0.1,

      type: "tween",
    },
  }),
};

function Main() {
  // resize되는 화면 크기 구하기

  const [OFFSET, setOFFSET] = useState<number | null>(null);

  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    handleOFFSET(window.innerWidth);
  }, []);

  const handleOFFSET = (windowWidth: number) => {
    if (window.innerWidth >= 1200) setOFFSET(4);
    else if (window.innerWidth >= 990) setOFFSET(3);
    else if (window.innerWidth >= 768) setOFFSET(2);
    else if (window.innerWidth < 768) setOFFSET(1);
  };

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    handleOFFSET(windowSize.width as number);
  };
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      if ((windowSize.width as number) >= 1200) setOFFSET(4);
      else if ((windowSize.width as number) >= 990) setOFFSET(3);
      else if ((windowSize.width as number) >= 768) setOFFSET(2);
      else if ((windowSize.width as number) < 768) setOFFSET(1);
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerWidth]);

  const addLikeMutate = useMutation(
    ["addLikePost" as string],

    (postId: number) => addLikePost(postId) as any,

    {
      onSuccess: () => {
        // refetch Post
      },

      onError: () => {
        console.log("좋아요 추가 기능이 작동하지 않습니다.");
      },
    }
  );

  const deleteLikeMutate = useMutation(
    ["deleteLikePost" as string],

    (postId: number) => deleteLikePost(postId) as any,

    {
      onSuccess: () => {
        // refetch Post
      },

      onError: () => {
        console.log("좋아요 추가 기능이 작동하지 않습니다.");
      },
    }
  );

  const [indexs, setIndexs] = useState([0, 0, 0, 0]);

  const increaseIndex = (idx: number) => {
    if (OFFSET) {
      if (leaving) return;
      setLeaving(true);
      if (
        indexs[idx] ===
        (NUM_POSTS % OFFSET === 0
          ? NUM_POSTS / OFFSET - 1
          : Math.floor(NUM_POSTS / OFFSET))
      )
        setIndexs((prev) => [...prev.slice(0, idx), 0, ...prev.slice(idx + 1)]);
      else {
        setIndexs((prev) => [
          ...prev.slice(0, idx),
          prev[idx] + 1,
          ...prev.slice(idx + 1),
        ]);
      }
    }
  };

  console.log(indexs);

  const [leaving, setLeaving] = useState(false);

  const isLoginModal = useRecoilValue(isLoginModalState);

  const isSignupModal = useRecoilValue(isSignupModalState);
  const isExtraSignupModal = useRecoilValue(isExtraSignupModalState);

  const ORDER = ["likes", "recent", "member", "end"];

  const LIMIT = 10;

  const {
    data: postslikes,
    isLoading: isLikesLoading,
    refetch: likesRefetch,
  } = useQuery<IPosts>(["PostsMainFiltered", ["likes", LIMIT]], () =>
    // readPosts(null, null, ORDER[0], null, null, null, LIMIT + "")
    readPosts(null, null, ORDER[0], null, LIMIT + "", null)
  );
  const {
    data: postsrecent,
    isLoading: isRecentLoading,
    refetch: recentRefetch,
  } = useQuery<IPosts>(["PostsMainFiltered", ["recent", LIMIT]], () =>
    // readPosts(null, null, ORDER[1], null, null, null, LIMIT + "")
    readPosts(null, null, ORDER[1], null, LIMIT + "", null)
  );
  const {
    data: postsmember,
    isLoading: isMemberLoading,
    refetch: memberRefetch,
  } = useQuery<IPosts>(["PostsMainFiltered", ["member", LIMIT]], () =>
    // readPosts(null, null, ORDER[2], null, null, null, LIMIT + "")
    readPosts(null, null, ORDER[2], null, LIMIT + "", null)
  );
  const {
    data: postsend,
    isLoading: isEndLoading,
    refetch: endRefetch,
  } = useQuery<IPosts>(["PostsMainFiltered", ["end", LIMIT]], () =>
    // readPosts(null, null, ORDER[3], null, null, null, LIMIT + "")
    readPosts(null, null, ORDER[3], null, LIMIT + "", null)
  );

  const { mutate: likeAddMutate, isLoading: isLikeAddLoading } = useMutation(
    ["likeAddMutate" as string],
    (postId: number) => addLikePost(postId) as any,
    {
      onSuccess: () => {
        refetch();
      },
      onError: (error) => {
        if (((error as AxiosError).response as AxiosResponse).status === 401) {
          alert("로그인이 필요합니다.");
          if (localStorage.getItem("key")) localStorage.removeItem("key");
          setIsLoginModal(true);
          setIsLogin(false);
        }
      },
    }
  );

  const { mutate: likeDeleteMutate, isLoading: isLikeDeleteLoading } =
    useMutation(
      ["likeDeleteMutate" as string],
      (postId: number) => deleteLikePost(postId) as any,
      {
        onSuccess: () => {
          refetch();
        },

        onError: (error) => {
          if (
            ((error as AxiosError).response as AxiosResponse).status === 401
          ) {
            alert("로그인이 필요합니다.");
            if (localStorage.getItem("key")) localStorage.removeItem("key");
            setIsLoginModal(true);
            setIsLogin(false);
          }
        },
      }
    );

  const setIsLogin = useSetRecoilState(isLoginState);
  const setIsLoginModal = useSetRecoilState(isLoginModalState);

  const refetch = () => {
    likesRefetch();
    recentRefetch();
    memberRefetch();
    endRefetch();
  };

  const onHeartClick = async (postId: number, hasLiked: boolean) => {
    if (hasLiked) {
      likeDeleteMutate(postId);
    } else {
      likeAddMutate(postId);
    }
  };

  const { mutate: loginCheckMutate, isLoading: isLoginCheckLoading } =
    useMutation(["loginCheckApiMain" as string], loginCheckApi, {
      onError: (error) => {
        if (((error as AxiosError).response as AxiosResponse).status === 401) {
          if (localStorage.getItem("key")) localStorage.removeItem("key");
          setIsLogin(false);
        }
      },
    });

  useEffect(() => {
    loginCheckMutate();
  }, []);

  type IdtypeToStyle = {
    [P: string]: {
      color: string;
      bdColor: string;
      text: string;
    };
    M: {
      color: string;
      bdColor: string;
      text: string;
    };
    S: {
      color: string;
      bdColor: string;
      text: string;
    };
  };

  const dtypeToStyle: IdtypeToStyle = {
    P: {
      color: "text-purple-400",
      bdColor: "bg-[#e0c3f8]",
      text: "프로젝트",
    },
    M: {
      color: "text-blue-400",
      bdColor: "bg-[#bdc9f2]",
      text: "멘토링",
    },
    S: {
      color: "text-gray-400",
      bdColor: "bg-[#c7c7c7]",
      text: "스터디",
    },
  };

  return (
    <>
      {isLoginCheckLoading ||
      isLikesLoading ||
      isRecentLoading ||
      isMemberLoading ||
      isEndLoading ||
      !OFFSET ? (
        <LoadingAnimation />
      ) : (
        <Container>
          {isLoginModal ? <Login /> : null}
          {isSignupModal ? <SignUp /> : null}
          {isExtraSignupModal ? <SignUpOptional /> : null}
          <Banner src="/img/mainBannerReal.png"></Banner>

          {[postslikes, postsrecent, postsmember, postsend]?.map(
            (posts?: IPosts, idx?: any) => (
              <PostCategory className="mb-[350px]">
                <TitleRow>
                  <TitleSpan>
                    <Title>{titles[idx]}</Title>
                    <Title className="ml-[30px]">
                      {" "}
                      {`( ${indexs[idx] + 1} /  ${12 / OFFSET} )`}{" "}
                    </Title>
                  </TitleSpan>
                  <svg
                    onClick={() => increaseIndex(idx)}
                    className="w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                  >
                    <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                  </svg>
                </TitleRow>

                {(posts?.posts.length as number) > 0 ? (
                  <PostContainer>
                    <AnimatePresence
                      initial={false}
                      onExitComplete={() => setLeaving(false)}
                    >
                      <PostGrid key={indexs[idx]}>
                        {posts?.posts
                          ?.slice(
                            indexs[idx] * OFFSET,
                            indexs[idx] * OFFSET + OFFSET
                          )
                          .map((post: IPost) => (
                            <PostItem
                              custom={{ windowSize, leaving }}
                              variants={postsVariants}
                              initial="hidden"
                              animate="showing"
                              exit="exit"
                              whileHover="hover"
                              key={post?.id}
                            >
                              <PostContentFirstRow
                                className={`${
                                  // post?.dtype === "P"
                                  //   ? "bg-[#e0c3f8]"
                                  //   : post?.dtype === "S"
                                  //   ? "bg-[#c7c7c7]"
                                  //   : "bg-[#bdc9f2]"
                                  dtypeToStyle[post?.dtype].bdColor
                                }`}
                              >
                                <PostCategorySpan>
                                  <PostCategoryLabel
                                    // className={`${
                                    //   post?.dtype === "P"
                                    //     ? "text-purple-400"
                                    //     : post?.dtype === "S"
                                    //     ? "text-gray-400"
                                    //     : "text-blue-400"
                                    // } `}
                                    className={`${
                                      dtypeToStyle[post?.dtype].color
                                    }`}
                                  >
                                    {/* {post?.dtype === "P"
                                      ? "프로젝트"
                                      : post?.dtype === "S"
                                      ? "스터디"
                                      : "멘토링"} */}
                                    {dtypeToStyle[post?.dtype].text}
                                  </PostCategoryLabel>
                                </PostCategorySpan>
                                <HeartSpan>
                                  <HeartIcon
                                    whileHover={{ scale: [1, 1.3, 1, 1.3, 1] }}
                                    whileTap={{ y: [0, -30, 0] }}
                                    onClick={() =>
                                      onHeartClick(
                                        post.id,
                                        post.hasLiked as boolean
                                      )
                                    }
                                    className={`${
                                      post.hasLiked
                                        ? "fa-solid fa-heart text-red-600"
                                        : "fa-regular fa-heart"
                                    }`}
                                  >
                                    {/* {post.likenum} */}
                                  </HeartIcon>
                                  &nbsp; {post?.nliked}
                                </HeartSpan>
                              </PostContentFirstRow>

                              <Link to={`/post/${post.id}`}>
                                <PostMainPart>
                                  {/* secondRow */}
                                  <PostTitle>
                                    {post?.title.length > 16
                                      ? post?.title.slice(0, 16) + "..."
                                      : post?.title}
                                  </PostTitle>

                                  {/* ThirdRow */}
                                  <PostDate>
                                    {(new Date(post?.projectEnd).getTime() -
                                      new Date(post?.projectStart).getTime()) /
                                      (1000 * 24 * 60 * 60) >=
                                    365 ? (
                                      <PostDatePlan>
                                        {Math.floor(
                                          (new Date(
                                            post?.projectEnd
                                          ).getTime() -
                                            new Date(
                                              post?.projectStart
                                            ).getTime()) /
                                            (1000 * 24 * 60 * 60 * 365)
                                        )}
                                        {""}년 플랜
                                      </PostDatePlan>
                                    ) : (new Date(post?.projectEnd).getTime() -
                                        new Date(
                                          post?.projectStart
                                        ).getTime()) /
                                        (1000 * 24 * 60 * 60) >=
                                      30 ? (
                                      <PostDatePlan>
                                        {Math.floor(
                                          (new Date(
                                            post?.projectEnd
                                          ).getTime() -
                                            new Date(
                                              post?.projectStart
                                            ).getTime()) /
                                            (1000 * 24 * 60 * 60 * 30)
                                        )}
                                        {""}달 플랜
                                      </PostDatePlan>
                                    ) : (new Date(post?.projectEnd).getTime() -
                                        new Date(
                                          post?.projectStart
                                        ).getTime()) /
                                        (1000 * 24 * 60 * 60) >=
                                      7 ? (
                                      <PostDatePlan>
                                        {Math.floor(
                                          (new Date(
                                            post?.projectEnd
                                          ).getTime() -
                                            new Date(
                                              post?.projectStart
                                            ).getTime()) /
                                            (1000 * 24 * 60 * 60 * 7)
                                        )}
                                        {""}주 플랜
                                      </PostDatePlan>
                                    ) : (
                                      <PostDatePlan>
                                        {Math.floor(
                                          (new Date(
                                            post?.projectEnd
                                          ).getTime() -
                                            new Date(
                                              post?.projectStart
                                            ).getTime()) /
                                            (1000 * 24 * 60 * 60)
                                        )}
                                        {""}일 플랜
                                      </PostDatePlan>
                                    )}
                                    <p className="mx-[7px] pb-0.5">|</p>
                                    <PostDateStart>
                                      {" "}
                                      {new Date(post?.projectStart).getMonth()}
                                      월{" "}
                                      {new Date(post?.projectStart).getDate()}일
                                      시작
                                    </PostDateStart>
                                  </PostDate>

                                  {/* lastRow */}
                                  <PostPerson>
                                    <PostPersonTotal>
                                      {post?.dtype === "P"
                                        ? post?.maxDesigner +
                                          post?.maxDeveloper +
                                          post?.maxPlanner
                                        : post?.dtype === "S"
                                        ? post?.maxMember
                                        : post?.maxMentee + post?.maxMentor}
                                      명 모집
                                    </PostPersonTotal>

                                    {post?.dtype === "P" ? (
                                      <>
                                        {post?.maxDeveloper !== 0 && (
                                          <PostPersonPosition>
                                            개발자 {post?.maxDeveloper}명
                                          </PostPersonPosition>
                                        )}
                                        {post?.maxPlanner !== 0 && (
                                          <PostPersonPosition>
                                            기획자 {post?.maxPlanner}명
                                          </PostPersonPosition>
                                        )}

                                        {post?.maxDesigner !== 0 && (
                                          <PostPersonPosition>
                                            디자이너 {post?.maxDesigner}명
                                          </PostPersonPosition>
                                        )}
                                      </>
                                    ) : post?.dtype === "S" ? (
                                      post?.maxMember !== 0 && (
                                        <PostPersonPosition>
                                          스터디원 {post?.maxMember}명
                                        </PostPersonPosition>
                                      )
                                    ) : (
                                      <>
                                        {post?.maxMentor !== 0 && (
                                          <PostPersonPosition>
                                            멘토 {post?.maxMentor}명
                                          </PostPersonPosition>
                                        )}
                                        {post?.maxMentee !== 0 && (
                                          <PostPersonPosition>
                                            멘티 {post?.maxMentee}명
                                          </PostPersonPosition>
                                        )}
                                      </>
                                    )}
                                  </PostPerson>
                                </PostMainPart>
                              </Link>
                            </PostItem>
                          ))}
                      </PostGrid>
                    </AnimatePresence>
                  </PostContainer>
                ) : (
                  <div className="flex justify-center items-center w-full h-[50px] text-[20px] ">
                    {/* <div className="flex items-center w-[300px] border-2 bg-[#eeeeee] rounded-lg h-[150px] justify-center items-center"> */}
                    <i className="fa-solid fa-triangle-exclamation text-yellow-500 ">
                      &nbsp;
                    </i>
                    <p className="font-bold">게시물이 존재하지 않습니다.</p>
                  </div>
                )}
              </PostCategory>
            )
          )}
        </Container>
      )}
    </>
  );
}

export default Main;
