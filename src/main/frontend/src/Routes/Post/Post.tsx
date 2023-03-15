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
import React, { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useMatch, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import tw from "tailwind-styled-components";
import Card from "Routes/Post/Card";

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

const Container = tw.div`
min-w-[480px]`;

function Post() {
  const location = useLocation();
  const search = location.state ? location.state.search : null;

  const [order, setOrder] = useState<string>("recent");
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


  const categories: string[] = ["project" ,"study", "mentoring"];

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
                      "border-black bg-black text-white "
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
                        ? "멤버"
                        : position === "mentor"
                        ? "멘토"
                        : position === "mentee"
                        ? "멘티"
                        : position === "planner"
                        ? "기획자"
                        : position === "developer"
                        ? "개발자"
                        : "디자이너"}
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
                <SortSelect  className="vertical-center" onInput={onInput} value={order}>
                  <option id="recent" value="recent">최신 순</option>
                  <option id="likes" value="likes">찜 많은 순</option>
                  <option id="member" value="member">모집 인원 마감 임박</option>
                  <option id="end" value="end">모집마감 임박순</option>
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
                  <Card post={post} refetch={refetch} index={index}  />
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
