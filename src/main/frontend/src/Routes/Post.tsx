import { useMutation, useQuery } from "@tanstack/react-query";
import LoadingAnimation from "components/LoadingAnimation";
import {
  addLikePost,
  createMentoring,
  deleteLikePost,
  departments,
  IPost,
  IPosts,
  loginCheckApi,
  posts,
  readPosts,
} from "api";
import { AxiosError, AxiosResponse } from "axios";
import { isLoginModalState, isLoginState } from "components/atom";
import Login from "components/LoginModal";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useLocation, useMatch, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import tw from "tailwind-styled-components";

const Banner = tw.img`
bg-gradient-to-r from-gray-300 to-gray-500
`;

const FilterRow = tw.div`
relative
flex 
h-12
md:h-16
my-1
border-b-2 
border-gray-300 
item-center
vertical-center
`;

const FilterTitle = tw.p`
font-unique
block
text-md
md:text-xl
mx-10
my-auto
w-20
md:w-60
`;

const FilterButtonBox = tw.span`

flex 
items-center 
text-sm
md:text-lg
`;

const Button = tw.button`
border-2 
border-gray-300 
px-[15px]
rounded-3xl
mx-3
`;

const SortBox = tw.div`
flex 
justify-between
pt-[20px]
pb-[40px]
px-10

`;

const SortTitle = tw.p`
font-bold 
mr-5

`;

const SortSelect = tw.select`
  w-40
  
  
`;

const PostGrid = tw.div`
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-3
xl:grid-cols-4
gap-x-10
px-5
place-items-center

`;

const PostItem = tw(motion.div)`
relative
h-[210px] 
w-[320px]
rounded-md
overflow-hidden
mb-[80px]
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
font-unique
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

const HeartIcon = tw(motion.i)`
`;

const PostMainPart = tw.div`
bg-[#e9e9eb] 
w-full 
h-full 
px-[25px] 
py-[15px]
`;

const PostTitle = tw.p`
font-unique
text-lg 

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

const Container = tw.div`
min-w-[480px]`;

function Post() {
  const location = useLocation();
  const search = location.state ? location.state.search : null;

  const [order, setOrder] = useState<string | null>(null);
  const onInput = (event: React.FormEvent<HTMLSelectElement>) => {
    setOrder(event.currentTarget.value);
    console.log(event.currentTarget.value);
  };

  // Filtering
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterPosition, setFilterPosition] = useState<string>("");
  const [filterPay, setFilterPay] = useState<string>("");

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.currentTarget.id === "category") {
      // 필터링 취소
      if (filterCategory === event.currentTarget.name) {
        setFilterCategory("");
      } else setFilterCategory(event.currentTarget.name);
      setFilterPosition("");
      setFilterPay("");
    } else if (event.currentTarget.id === "position") {
      // 2차 필터링 취소
      if (filterPosition === event.currentTarget.name) {
        setFilterPosition("");
      } else setFilterPosition(event.currentTarget.name);
    } else if (event.currentTarget.id === "pay") {
      //3차 필터링 취소
      if (filterPay === event.currentTarget.name) {
        setFilterPay("");
      } else {
        setFilterPay(event.currentTarget.name);
      }
    }
  };

  useEffect(() => {
    console.log(filterCategory, filterPosition, filterPay);
  }, [filterCategory, filterPosition, filterPay]);

  interface IFiltering {
    [key: string]: string[];
  }

  // const positions: IFiltering = {
  //   study: ["member"],
  //   mentoring: ["mentor", "mentee"],
  //   project: ["planner", "developer", "designer"],
  // };

  // const pays: IFiltering = {
  //   mentoring: ["true", "false"],
  //   project: ["true", "false"],
  // };

  const categories: string[] = ["study", "mentoring", "project"];

  const positions: IFiltering = {
    study: ["member"],
    mentoring: ["mentor", "mentee"],
    project: ["planner", "developer", "designer"],
  };

  const pays: IFiltering = {
    // study: [],
    mentoring: ["yes", "no"],
    project: ["yes", "no"],
  };

  const windowPx = window.innerWidth;
  console.log(windowPx, "px");

  const isLoginModal = useRecoilValue(isLoginModalState);

  // let TOTAL_POSTS = 10;
  // let POSTS_PER_PAGE = 12;
  // let TOTAL_PAGES = Math.ceil(TOTAL_POSTS / POSTS_PER_PAGE);

  // const TOTAL_POSTS = 200;
  const POSTS_PER_PAGE = 12;
  // let TOTAL_PAGES = Math.ceil(posts?.total as number / POSTS_PER_PAGE);
  const [nowPage, setNowPage] = useState(1);
  const [prevPage, setPrevPage] = useState(Math.floor((nowPage - 1) / 10) * 10);
  const [nextPage, setNextPage] = useState(Math.ceil(nowPage / 10) * 10 + 1);

  const onPageClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { id },
    } = event;
    if (id === "next") {
      if (nextPage <= Math.ceil((posts?.total as number) / POSTS_PER_PAGE))
        setNowPage(nextPage);
      else setNowPage(Math.ceil((posts?.total as number) / POSTS_PER_PAGE));
    } else if (id === "prev") {
      if (prevPage > 0) setNowPage(prevPage);
      else setNowPage(1);
    } else {
      setNowPage(+id);
    }
  };

  useEffect(() => {
    setNextPage(Math.ceil(nowPage / 10) * 10 + 1);
    setPrevPage(Math.floor((nowPage - 1) / 10) * 10);
    console.log(prevPage, nextPage);
    // refetch();
  }, [nowPage]);

  useEffect(() => {
    // refetch();
  }, [search, order, filterCategory, filterPosition, filterPay]);

  // [사이에 필터링을 추가하기]
  const {
    data: posts,
    isLoading,
    refetch,
  } = useQuery<IPosts>(
    [
      "PostsPostFiltered",

      [nowPage, search, order, filterCategory, filterPosition, filterPay],
    ],
    () =>
      readPosts(
        nowPage + "",
        search,
        order,
        filterCategory === "" ? null : filterCategory,
        filterPosition === "" ? null : filterPosition,
        filterPay === "" ? null : filterPay,
        null
      ),
    {
      onSuccess: () => {
        console.log("Fetched!");
      },
    }
  );
  const setIsLogin = useSetRecoilState(isLoginState);
  const setIsLoginModal = useSetRecoilState(isLoginModalState);

  const { mutate: likeAddMutate, isLoading: isLikeAddLoading } = useMutation(
    ["likeAddMutatePostPage" as string],
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
        }
      },
    }
  );

  const { mutate: loginCheckMutate, isLoading: isLoginCheckLoading } =
    useMutation(["loginCheckApiPost" as string], loginCheckApi, {
      onError: (error) => {
        if (((error as AxiosError).response as AxiosResponse).status === 401) {
          if (localStorage.getItem("key")) localStorage.removeItem("key");
          setIsLogin(false);
        }
      },
    });

  const { mutate: likeDeleteMutate, isLoading: isLikeDeleteLoading } =
    useMutation(
      ["likeDeleteMutatePostPage" as string],
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

  const onHeartClick = async (postId: number, hasLiked: boolean) => {
    if (hasLiked) {
      likeDeleteMutate(postId);
    } else {
      likeAddMutate(postId);
    }
  };

  useEffect(() => {
    loginCheckMutate();
  }, []);

  return (
    <>
      {isLoading || isLoginCheckLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          {isLoginModal ? <Login /> : null}
          <Container>
            <Banner src="/img/postBannerReal.png"></Banner>
            <FilterRow>
              <FilterTitle>CATEGORY</FilterTitle>
              <FilterButtonBox>
                {categories.map((category) => (
                  <Button
                    key={category}
                    id="category"
                    name={category}
                    onClick={onClick}
                    className={`${
                      category === filterCategory &&
                      "border-black bg-black text-white"
                    }`}
                  >
                    {category === "study"
                      ? "스터디"
                      : category === "mentoring"
                      ? "멘토링"
                      : "프로젝트"}
                  </Button>
                ))}
              </FilterButtonBox>
            </FilterRow>
            {filterCategory === "" ? null : (
              <FilterRow>
                <FilterTitle>POSITION</FilterTitle>
                <FilterButtonBox>
                  {positions[filterCategory].map((position) => (
                    <Button
                      id="position"
                      name={position}
                      key={position}
                      onClick={onClick}
                      className={`${
                        position === filterPosition &&
                        "border-black bg-black text-white"
                      }`}
                    >
                      {position === "member"
                        ? "맴버"
                        : position === "mentor"
                        ? "멘토"
                        : position === "mentee"
                        ? "멘티"
                        : position === "planner"
                        ? "기획자"
                        : position === "developer"
                        ? "개발자"
                        : "디자인"}
                    </Button>
                  ))}
                </FilterButtonBox>
              </FilterRow>
            )}

            {filterCategory === "" || filterCategory === "study" ? null : (
              <FilterRow>
                <FilterTitle>PAY</FilterTitle>
                <FilterButtonBox>
                  {pays[filterCategory].map((pay) => (
                    <Button
                      id="pay"
                      name={pay}
                      key={pay}
                      onClick={onClick}
                      className={`${
                        pay === filterPay && "border-black bg-black text-white"
                      }`}
                    >
                      {pay === "yes" ? "있음" : "없음"}
                    </Button>
                  ))}
                </FilterButtonBox>
              </FilterRow>
            )}

            <SortBox>
              <div className="flex items-center">
                <SortTitle>Sort by</SortTitle>
                <SortSelect className="vertical-center" onInput={onInput}>
                  <option value="recent">최신 순</option>
                  <option value="likes">찜 많은 순</option>
                  <option value="member">모집 인원 마감 임박</option>
                  <option value="end">모집마감 임박순</option>
                </SortSelect>
              </div>
              <Link to="/add">
                <button className="text-[12px] md:text-[16px] text-white border border-black py-[5px] bg-black px-[20px] ">
                  모집글 쓰기
                </button>
              </Link>
            </SortBox>
            {/* { ( */}
            <PostGrid>
              {(posts?.posts.length as number) > 0 &&
                (posts as IPosts).posts.map((post, index) => (
                  <PostItem
                    // initial={{ scale: 1 }}
                    whileHover={{ scale: 1.08 }}
                    key={index}
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
                      <div>
                        <HeartIcon
                          whileHover={{ scale: [1, 1.3, 1, 1.3, 1] }}
                          whileTap={{ y: [0, -30, 0] }}
                          onClick={() =>
                            onHeartClick(post.id, post.hasLiked as boolean)
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
                      </div>
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
                    <Link to={`/post/${post.id}`}>
                      <PostMainPart>
                        {/* secondRow */}
                        <PostTitle>
                          {post.title.length > 16
                            ? post.title.slice(0, 16) + " ..."
                            : post.title}
                        </PostTitle>

                        {/* ThirdRow */}
                        <PostDate>
                          {(new Date(post.projectEnd).getTime() -
                            new Date(post.projectStart).getTime()) /
                            (1000 * 24 * 60 * 60) >=
                          365 ? (
                            <PostDatePlan>
                              {Math.floor(
                                (new Date(post.projectEnd).getTime() -
                                  new Date(post.projectStart).getTime()) /
                                  (1000 * 24 * 60 * 60 * 365)
                              )}
                              {""}년 플랜
                            </PostDatePlan>
                          ) : (new Date(post.projectEnd).getTime() -
                              new Date(post.projectStart).getTime()) /
                              (1000 * 24 * 60 * 60) >=
                            30 ? (
                            <PostDatePlan>
                              {Math.floor(
                                (new Date(post.projectEnd).getTime() -
                                  new Date(post.projectStart).getTime()) /
                                  (1000 * 24 * 60 * 60 * 30)
                              )}
                              {""}달 플랜
                            </PostDatePlan>
                          ) : (new Date(post.projectEnd).getTime() -
                              new Date(post.projectStart).getTime()) /
                              (1000 * 24 * 60 * 60) >=
                            7 ? (
                            <PostDatePlan>
                              {Math.floor(
                                (new Date(post.projectEnd).getTime() -
                                  new Date(post.projectStart).getTime()) /
                                  (1000 * 24 * 60 * 60 * 7)
                              )}
                              {""}주 플랜
                            </PostDatePlan>
                          ) : (
                            <PostDatePlan>
                              {Math.floor(
                                (new Date(post.projectEnd).getTime() -
                                  new Date(post.projectStart).getTime()) /
                                  (1000 * 24 * 60 * 60)
                              )}
                              {""}일 플랜
                            </PostDatePlan>
                          )}
                          <p className="mx-[7px] pb-0.5">|</p>
                          <PostDateStart>
                            {" "}
                            {new Date(post.projectStart).getMonth()}월{" "}
                            {new Date(post.projectStart).getDate()}일 시작
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
                    </Link>
                  </PostItem>
                ))}
            </PostGrid>
            {/* )} */}

            {posts?.total === 0 ? (
              <div className="flex justify-center items-center w-full h-[50px] text-[20px] ">
                {/* <div className="flex items-center w-[300px] border-2 bg-[#eeeeee] rounded-lg h-[150px] justify-center items-center"> */}
                <i className="fa-solid fa-triangle-exclamation text-yellow-500 ">
                  &nbsp;
                </i>
                <p className="font-bold">게시물이 존재하지 않습니다.</p>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-[100px]  ">
                <button
                  id="prev"
                  onClick={onPageClick}
                  className="w-[70px] h-[30px] flex justify-center items-center "
                >
                  <i className="fa-solid fa-circle-left text-[30px]"></i>
                </button>

                {Array.from(
                  {
                    length: Math.ceil(
                      (posts?.total as number) / POSTS_PER_PAGE
                    ),
                  },
                  (v, i) => i + 1
                )
                  .slice(prevPage, nextPage - 1)
                  .map((page) => (
                    <button
                      id={page + ""}
                      onClick={onPageClick}
                      className={`w-[30px] h-[30px] mx-1 border-2 rounded bg-black text-white border-black font-bold hover:opacity-70
                     ${page === nowPage && "opacity-30"} `}
                    >
                      {page}
                    </button>
                  ))}
                {/* </>
              )} */}

                <button
                  id="next"
                  onClick={onPageClick}
                  className="w-[70px] h-[30px] flex justify-center items-center"
                >
                  <i className="fa-solid fa-circle-right text-[30px]"></i>
                </button>
              </div>
            )}
          </Container>
        </>
      )}
    </>
  );
}

export default Post;
