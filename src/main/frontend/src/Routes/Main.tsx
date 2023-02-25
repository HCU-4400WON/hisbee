import { MutationFunction, useMutation } from "@tanstack/react-query";
import { addLikePost, deleteLikePost, posts } from "api";
import { isLoginModalState } from "components/atom";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import tw from "tailwind-styled-components";
import { runInThisContext } from "vm";
import Login from "../components/LoginModal";

const titles = [
  "🔥 요즘 핫한 모집글",
  "👨‍🎨  신규 모집글",
  "📢  마감임박! 모집글",
  "👨‍👦‍👦  모집인원 임박! 모집글",
];

const Banner = tw.img`

w-screen
bg-gradient-to-r from-gray-200 to-gray-500
mt-[40px]
mb-[150px]
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

const Title = tw.p`
text-xl 
font-bold
`;

const PostGrid = tw(motion.div)`
flex justify-between w-full

`;

//justify-self-center
const PostItem = tw(motion.div)`
relative
h-[210px]
min-w-[330px]
rounded-md
overflow-hidden
z-0

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

const MAX_WIDTH = window.innerWidth;
console.log(MAX_WIDTH);
const OFFSET = 4;
const NUM_POSTS = 8;
const CARD_SIZE = 330;

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
  }),
  showing: {
    x: 0,
    transition: {
      duration: 2,
    },
  },
  exit: (windowSize: any) => ({
    x: -windowSize.windowSize.width,
    transition: {
      duration: 2,
    },
  }),
  hover: ({ leaving }: IProps) => ({
    scale: leaving ? 1 : 1.1,
    // opacity: 0.4,
    // zIndex: 1,
    transition: {
      delay: 0.1,
      duration: 0.1,

      type: "tween",
    },
  }),
};

function Main() {
  // resize되는 화면 크기 구하기

  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const onLikeClick = (postId: number, isLiked: boolean) => {
    if (!isLiked) addLikeMutate.mutate(postId);
    else deleteLikeMutate.mutate(postId);
  };

  const [indexs, setIndexs] = useState([0, 0, 0, 0]);

  const increaseIndex = (idx: number) => {
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
  };

  console.log(indexs);

  const [leaving, setLeaving] = useState(false);

  const isLoginModal = useRecoilValue(isLoginModalState);

  return (
    <div className="mb-[440px]">
      {isLoginModal ? <Login /> : null}

      <Banner src="/img/mainBannerReal.png"></Banner>
      {titles.map((title, idx) => (
        <PostCategory className="mb-[400px]">
          <TitleRow>
            <Title>{title}</Title>
            <svg
              onClick={() => increaseIndex(idx)}
              className="w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
            </svg>
          </TitleRow>

          <div className="relative mx-4">
            <AnimatePresence
              initial={false}
              onExitComplete={() => setLeaving(false)}
            >
              <PostGrid key={indexs[idx]} className="absolute">
                {posts
                  .slice(indexs[idx] * OFFSET, indexs[idx] * OFFSET + OFFSET)
                  // .slice(0, 4)
                  .map((post, index) => (
                    <PostItem
                      custom={{ windowSize, leaving }}
                      variants={postsVariants}
                      initial="hidden"
                      animate="showing"
                      exit="exit"
                      whileHover="hover"
                      // transition={{ duration: 2 }}
                      // transition={{ type: "tween" }}
                      key={post.id}
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
                          <PostCategoryLabel>
                            {post.dtype === "P"
                              ? "프로젝트"
                              : post.dtype === "S"
                              ? "스터디"
                              : "멘토링"}
                          </PostCategoryLabel>
                        </PostCategorySpan>
                        <HeartIcon
                          onClick={() =>
                            onLikeClick(post.id, true /*post.isLiked*/)
                          }
                          className="fa-regular fa-heart"
                        ></HeartIcon>
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
                          {post.title.length > 20
                            ? post.title.slice(0, 20) + "..."
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
            </AnimatePresence>
          </div>
        </PostCategory>
      ))}
    </div>
  );
}

export default Main;
