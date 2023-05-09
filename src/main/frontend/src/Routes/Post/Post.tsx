import { useMutation, useQuery } from "@tanstack/react-query";
import LoadingAnimation from "components/LoadingAnimation";
import { Helmet } from "react-helmet";
import {
  addLikePost,
  createMentoring,
  deleteLikePost,
  departments,
  IReadAllPosts,
  IReadOnePost,
  loginCheckApi,
  posts,
  readPosts,
} from "api";
import { AxiosError, AxiosResponse } from "axios";
import {
  isLoginModalState,
  isLoginState,
  isSignupModalState,
} from "components/atom";
import Login from "components/LoginModal";
import { motion } from "framer-motion";
import React, {
  ChangeEvent,
  ComponentRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useMatch, useNavigate } from "react-router";
import { Link, useFetcher } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import tw from "tailwind-styled-components";
import Card from "Routes/Post/Card";
import Thumbnail from "./Thumbnail";
import { PostExamples } from "Routes/PostAddForm/components/PostExamples";
import "./css/button.css";
import "./css/textfield.css";
import SignUp2 from "Routes/Main/SignUp2";
import LoadingLottie from "components/LoadingLottie";
import Outline from "components/Outline";

const SelectFilterBox = tw.select`
mr-[20px] px-[10px] bg-[#F9FAFB] py-[5px] rounded-lg text-center
text-gray-500 text-[16px] w-auto
`;

const MyMajorBox = tw.div`
flex items-center bg-[#F9FAFB] py-[5px] mr-[20px] rounded-lg px-[10px] text-gray-500
text-[16px] w-auto
`;
const MyMajorInput = tw.input`
mr-[10px] h-[20px] 
`;
const MyMajorText = tw.label`
w-[150px]
`;

const Banner = tw.img`
bg-gradient-to-r from-gray-300 to-gray-500
`;

const SortBox = tw.div`
flex 
justify-between
pt-[20px]
pb-[40px]

`;

const PostGrid = tw.div`
grid
grid-cols-4

place-content-center

gap-x-[20px]

`;

const Container = tw.div`
bg-gray-100
pb-[100px]


min-h-[2000px]

`;

function Post() {
  const location = useLocation();
  const search = location.state ? location.state.search : null;

  const [order, setOrder] = useState<string>("recent");

  // Filtering
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterPosition, setFilterPosition] = useState<string>("");
  const [filterPay, setFilterPay] = useState<string>("");

  const [selectedMyDeptOnly, setSelectedMyDeptOnly] = useState<boolean>(false);
  const [selectedMajor, setSelectedMajor] = useState<string | "">("");
  const [selectedGrade, setSelectedGrade] = useState<string | "">("");
  const [selectedCategory, setSelectedCategory] = useState<string | "">("전체"); // about category
  const [keywordInput, setKeywordInput] = useState<string | "">("");
  const [keywords, setKeywords] = useState<string[] | []>([
    "취업",
    "스터디",
    "밥고",
    "팀 프로젝트",
    "기독교",
    "주말",
    "취미",
    "보컬",
  ]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[] | []>([]);

  useEffect(() => {
    console.log(filterCategory, filterPosition, filterPay);
  }, [filterCategory, filterPosition, filterPay]);

  interface IFiltering {
    [key: string]: string[];
  }

  const isLoginModal = useRecoilValue(isLoginModalState);
  const isSignupModal = useRecoilValue(isSignupModalState);

  const [getPageNums, setGetPageNums] = useState<number>(12);

  const POSTS_PER_PAGE = 12;
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

  const [LIMIT, useLIMIT] = useState<number>(12);
  useEffect(() => {
    const pageOneRefetch = async () => {
      await setNowPage(1);
      // setGetPageNums(1);
      refetch();
    };
    pageOneRefetch();
    console.log(
      nowPage,
      search,
      order,
      selectedCategory,
      LIMIT,
      selectedKeywords
    );
  }, [
    search,
    order,
    selectedCategory,
    LIMIT,
    selectedKeywords,
    selectedMyDeptOnly,
    selectedGrade,
    selectedMajor,
  ]);

  // [사이에 필터링을 추가하기]
  const {
    data: posts,
    isLoading,
    refetch,
  } = useQuery<IReadAllPosts>(
    [
      "FilteredPosts",
      [nowPage, search, order, selectedCategory, LIMIT + "", selectedKeywords],
    ],
    () =>
      readPosts(
        // page:
        nowPage + "",
        // search:
        search,
        // order:
        order,
        // type:
        selectedCategory === "전체" ? null : selectedCategory,
        // limit:
        LIMIT + "",
        // keywords:
        selectedKeywords,

        selectedMyDeptOnly,
        selectedGrade === "" || selectedGrade === "학년 무관"
          ? null
          : selectedGrade,
        selectedMajor === "" || selectedMajor === "학부 무관"
          ? null
          : selectedMajor
      ),
    {
      onSuccess: (posts) => {
        // keywords 변경
        // setKeywords(posts.relatedKeywords);

        //   // console.log("1");
        // }
        console.log(
          nowPage + "",
          // search:
          search,
          // order:
          order,
          // type:
          selectedCategory === "전체" ? null : selectedCategory,
          // limit:
          LIMIT + "",
          // keywords:
          selectedKeywords,
          // filterPosition === "" ? null : filterPosition,
          // filterPay === "" ? null : filterPay,
          // null
          selectedMyDeptOnly,
          selectedGrade,
          selectedMajor
        );
        // setGetPageNums(posts.total);
        setGetPageNums(posts.total);
        console.log("debug", posts.total);

        if (scrolling) {
          setUnionData((prev) => [...prev, ...posts.posts]);
        } else {
          setUnionData(posts.posts);
        }
        window.scrollTo(0, 0);
        // setUnionDataLoading(true);
        console.log("Fetched!", posts as any);

        setScrolling(false);
        // setTimeout(() => {
        //   setUnionDataLoading(true);
        // }, 1000);
      },
    }
  );
  const setIsLogin = useSetRecoilState(isLoginState);
  const setIsLoginModal = useSetRecoilState(isLoginModalState);

  const { mutate: loginCheckMutate, isLoading: isLoginCheckLoading } =
    useMutation(["loginCheckApiPost" as string], loginCheckApi, {
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

  const onInput = (event: React.FormEvent<HTMLSelectElement>) => {
    const selectedId = event.currentTarget.id;
    const selectedValue = event.currentTarget.value;
    if (selectedId === "sortSelect") {
      setOrder(selectedValue);
      console.log(selectedValue);
    } else if (selectedId === "majorSelect") {
      setSelectedMajor(selectedValue);
      console.log(selectedValue);
    } else if (selectedId === "gradeSelect") {
      setSelectedGrade(selectedValue);
      console.log(selectedValue);
    }
  };
  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const selectedId = e.currentTarget.id;
    const selectedValue = e.currentTarget.value;
    console.log("onChange inputValue : ", selectedValue);

    if (selectedId === "keywordInput") setKeywordInput(selectedValue);
  };
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const selectedId = e.currentTarget.id;
    const selectedValue = e.currentTarget.childNodes[0].textContent!;
    // if(Categories.includes(buttonName)){
    //   const targetIndex = Categories.findIndex( elem => elem === buttonName);
    //   setSelectedCategory(targetIndex);
    // }

    if (selectedId === "categoryButton") {
      setSelectedCategory(selectedValue);
      // setSelectedKeywords([]);
      console.log(selectedValue);
    }

    // else i
    else if (selectedId === "deleteKeywordButton") {
      setSelectedKeywords((prev) => {
        const deleteIdx = prev.findIndex((elem) => elem === selectedValue);
        const newKeywords = [
          ...prev.slice(0, deleteIdx),
          ...prev.slice(deleteIdx + 1),
        ];
        console.log("keyWords : ", newKeywords);
        return newKeywords;
      });
    } else if (selectedId === "insertKeywordButton") {
      setSelectedKeywords((prev) => {
        const newKeywords = [...prev, selectedValue];

        console.log("keyWords : ", newKeywords);
        return newKeywords;
      });
    } else if (selectedId === "allFilterDelete") {
      setSelectedCategory("");
      setSelectedGrade("학년 무관");
      if (majorRef.current) majorRef.current.selectedIndex = 0;
      if (gradeRef.current) gradeRef.current.selectedIndex = 0;
      setSelectedKeywords([]);
      setSelectedMajor("전공 무관");
      //다시 전체 모집글 refetch
    }
  };

  const Categories = [
    "전체",
    "동아리",
    "학회",
    "공모전/대회",
    "스터디",
    "프로젝트",
    "학술모임",
    "운동/게임/취미",
    "기타",
  ];
  const Majors = [
    "학부 무관",
    "글로벌리더십학부",
    "국제어문학부",
    "경영경제학부",
    "법학부",
    "커뮤니케이션학부",
    "공간환경시스템공학부",
    "기계제어공학부",
    "콘텐츠융합디자인학부",
    "생명과학부",
    "전산전자공학부",
    "상담심리사회복지학부",
    "ICT창업학부",
  ];

  const Grades = [
    "학년 무관",

    "1학년",
    "2학년",
    "3학년",
    "4학년",
    "9학기 이상",
  ];

  const majorRef = useRef<HTMLSelectElement>(null);
  const gradeRef = useRef<HTMLSelectElement>(null);

  const onKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSelectedKeywords((prev) => [...prev, keywordInput]);
      setKeywords((prev) => [...prev, keywordInput]);
    }
  };

  const [unionData, setUnionData] = useState<IReadOnePost[] | []>([]);

  const [stopFetching, setStopFetching] = useState<boolean>(false);

  const sentinel = document.getElementById("sentinel") as Element;

  const [scrolling, setScrolling] = useState<boolean>(false);

  useEffect(() => {
    if (!sentinel) return;

    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        console.log("a", getPageNums);
        if (getPageNums < LIMIT) {
          // window.removeEventListener("scroll", handleScroll);
          // observer.unobserve(document.getElementById("sentinel") as Element);

          return;
        }

        console.log("b");
        if (!entry.isIntersecting) return;
        //entry가 interscting 중이 아니라면 함수를 실행하지 않습니다.
        console.log("c");
        if (isLoading) return;
        console.log("d");
        setScrolling(true);
        //현재 page가 불러오는 중임을 나타내는 flag를 통해 불러오는 중이면 함수를 실행하지 않습니다.
        observer.observe(document.getElementById("sentinel") as Element);
        //observer를 등록합니다.
        // page._page += 1;
        setNowPage((prev) => prev + 1);
        //불러올 페이지를 추가합니다.
        // page.list.search();

        refetch();
        //페이지를 불러오는 함수를 호출합니다.
      });
    });
    io.observe(sentinel);
  }, [sentinel]);

  const isLogin = useRecoilValue(isLoginState);

  return (
    <>
      {(isLoading || isLoginCheckLoading) && <LoadingLottie isPost={true} />}
      <>
        <Helmet>
          <title>Hisbee</title>
        </Helmet>
        {isLoginModal ? <Login /> : null}
        {isSignupModal ? <SignUp2 /> : null}

        <Container>
          <Banner src="./img/banner_post.png"></Banner>

          <Outline bgColor="bg-white">
            {/* <div className=" mx-auto flex items-center w-full h-[40px] md:h-[60px] bg-white "> */}
            <div className="w-[1470px] mx-auto flex items-center w-full h-[60px] bg-white ">
              <div className="flex justify-between items-center w-full px-[70px] ">
                {Categories.map((category, index) => (
                  <button
                    id="categoryButton"
                    onClick={onClick}
                    className={`${
                      selectedCategory === category
                        ? "text-blue-600 font-semibold"
                        : "text-gray-400"
                    }   text-[16px] hover:text-blue-300`}
                    key={index}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </Outline>

          <Outline bgColor="bg-gray-100">
            {/* <div className="mt-[20px]"> */}
            <div className="w-[1470px] mt-[20px]">
              <div className="flex py-[20px] px-[70px] ">
                <div className="flex items-start ">
                  {/* <select ref={majorRef} id="majorSelect" onInput={onInput} className="px-[10px] border-2 border-black">
                    {Majors.map((major, index) => (
                      <option key={index}>
                        {major}
                      </option>
                    ))}
                  </select>
                  <select ref={gradeRef} id="gradeSelect" onInput={onInput} className="ml-[50px] px-[10px] border-2 border-black">
                    {Grades.map((grade,index)=> (
                      <option key={index}>
                        {grade}
                      </option>
                    ))}
                  </select> */}
                  <span className="flex items-center">
                    <div className=" mr-[20px] py-[0px]">
                      <p className="text-[16px] font-[500]">필터링 키워드</p>
                    </div>
                    <div className="w-[280px] mr-[30px]">
                      <input
                        value={keywordInput}
                        id="keywordInput"
                        onKeyPress={onKeyPress}
                        onChange={onChange}
                        type="text"
                        className="w-full text-[15px] border-b border-gray-400 bg-gray-100 "
                        placeholder="키워드로 원하는 모집글만 볼 수 있어요."
                      />
                    </div>
                  </span>
                  <div className="">
                    <div className="mb-[0px] grid grid-cols-7 gap-x-[10px] gap-y-[10px]">
                      {/* {selectedCategory !== "전체" && (
                        <button
                          id="deleteKeywordButton"
                          className="text-[16px] bg-white flex items-center h-[30px] border-0 rounded-lg text-center px-[10px] mr-[30px]"
                        >
                          {selectedCategory}
                        </button>
                      )} */}
                      {selectedKeywords.map((keyword, index) => (
                        <button
                          id="deleteKeywordButton"
                          onClick={onClick}
                          key={index}
                          className=" flex justify-center text-[14px] bg-white flex items-center py-[5px] border-0 rounded-lg text-center px-[13px] h-[30px]"
                        >
                          {keyword}
                          <div className="text-[15px] font-[100] text-black ml-[5px] ">
                            X
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* <button id="allFilterDelete" onClick={onClick}>
                      필터 전체 삭제 버튼
                </button> */}
              </div>
              <div className=" flex items-start px-[70px]  mb-[30px] ">
                <div className="flex mr-[20px] mt-[4px]">
                  <p className="text-[14px] mb-[0px]">추천 키워드 </p>
                </div>
                <div className="grid grid-cols-8 gap-x-[10px] gap-y-[10px]">
                  {keywords.map(
                    (keyword, index) =>
                      !selectedKeywords.includes(keyword as never) && (
                        <button
                          id="insertKeywordButton"
                          onClick={onClick}
                          key={index}
                          className="flex justify-center text-[14px] bg-gray-200 flex items-center py-[5px] border-0 rounded-lg text-center px-[13px] h-[30px]"
                        >
                          <p>{keyword}</p>
                          <div className="text-[25px] font-[100] ml-[5px]">
                            +
                          </div>
                        </button>
                      )
                  )}
                </div>
              </div>

              <div className="px-[65px] mx-auto">
                <SortBox className="">
                  <div className=" flex items-center justify-between">
                    {isLogin && (
                      <MyMajorBox className="">
                        <MyMajorInput
                          checked={selectedMyDeptOnly}
                          onChange={async () => {
                            setSelectedMyDeptOnly((prev) => !prev);
                          }}
                          type="checkBox"
                          id="myMajor"
                        />

                        <MyMajorText htmlFor="myMajor">
                          내 전공 관련글만 보기
                        </MyMajorText>
                      </MyMajorBox>
                    )}

                    <div className="flex mt-[0px]">
                      <SelectFilterBox
                        className=""
                        value={selectedMajor}
                        onChange={(e: any) => {
                          setSelectedMajor(e.currentTarget.value);
                          // console.log(selectedGrade);
                        }}
                        // ref={majorRef}
                        id="majorSelect"
                        // onInput={onInput}
                      >
                        {Majors.map((major, index) => (
                          <option key={index}>{major}</option>
                        ))}
                      </SelectFilterBox>
                      <SelectFilterBox
                        // ref={gradeRef}
                        value={selectedGrade}
                        onChange={(e: any) => {
                          setSelectedGrade(e.currentTarget.value);
                          console.log(selectedGrade);
                        }}
                        id="gradeSelect"
                        // onInput={onInput}
                        className=""
                      >
                        {Grades.map((grade, index) => (
                          <option key={index} value={grade}>
                            {grade}
                          </option>
                        ))}
                      </SelectFilterBox>
                      <div className="flex items-center">
                        {/* <SortTitle>Sort by</SortTitle> */}
                        <SelectFilterBox
                          id="sortSelect"
                          className=""
                          onInput={onInput}
                          value={order}
                        >
                          <option id="recent" value="recent">
                            최신 순
                          </option>
                          <option id="likes" value="likes">
                            찜 많은 순
                          </option>
                          <option id="member" value="member">
                            모집 인원 마감 임박
                          </option>
                          <option id="end" value="end">
                            모집마감 임박순
                          </option>
                        </SelectFilterBox>
                      </div>
                    </div>
                  </div>
                  <Link to="/add2">
                    <button className="min-w-[130px] text-[15px] text-white py-[5px] bg-blue-600 px-[15px] rounded-lg py-[8px]">
                      모집글 작성하기
                    </button>
                  </Link>
                </SortBox>
              </div>

              {/* { ( */}
              <div className="w-full flex justify-center">
                <PostGrid>
                  {/* {(posts?.posts.length as number) > 0 &&
                (posts as IPosts).posts.map((post, index) => (
                  <Card key={index} post={post} refetch={refetch} index={index}  />
                ))} */}
                  {unionData.map((post: IReadOnePost, index: number) => (
                    <Link key={index} to={`/post2/${post?.id}`}>
                      <Thumbnail {...post} refetch={refetch} />
                    </Link>
                  ))}
                </PostGrid>
              </div>
            </div>
            {/* </Outline> */}
          </Outline>
          {unionData.length === 0 && (
            <div className="flex justify-center items-center w-full h-[50px] text-[17px] text-black mt-[50px]">
              <i className="fa-solid fa-circle-exclamation text-black mx-[10px]">
                &nbsp;
              </i>
              <p className="font-bold">게시물이 존재하지 않습니다</p>
            </div>
          )}
        </Container>

        <p id="sentinel"></p>
      </>
    </>
  );
}

export default Post;
