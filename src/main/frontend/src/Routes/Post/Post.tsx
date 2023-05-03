import { useMutation, useQuery } from "@tanstack/react-query";
import LoadingAnimation from "components/LoadingAnimation";
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
import SignUp2 from "Routes/Main/SignUp2";

const SelectFilterBox = tw.select`
mr-[20px] px-[10px] bg-[#F9FAFB] py-[5px] rounded-lg text-center
text-gray-500 text-[10px] w-[80px] md:w-[100px] md:text-[14px] lg:text-[16px] lg:w-auto
`;

const MyMajorBox = tw.div`
flex items-center bg-[#F9FAFB] py-[5px] mr-[20px] rounded-lg px-[10px] text-gray-500
text-[9px] w-[135px] md:text-[14px] lg:text-[16px] md:w-auto
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
px-[20px]

`;

const SortTitle = tw.p`
font-bold 
mr-5

`;

const SortSelect = tw.select`
  
  
  
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
bg-gray-100
min-w-[480px]
pb-[100px]

h-[2000px]

`;

const FormCancelIcon = tw.i`
fa-solid fa-xmark text-[10px] lg:text-[16px] text-black ml-[5px] lg:mt-[2px] 
`;

// export interface IPost {
//   id: number;
//   writer: string;
//   title: string;
//   content: string;
//   contact: string;
//   postStart: Date;
//   postEnd: Date;
//   projectStart: Date;
//   duration: string[];
//   keywords: string[];
//   nliked: number;
//   total: number;
//   curr: number;
//   views: number;
//   createdDate: Date;
//   lastModifiedDate: Date;
//   varified?: boolean;
//   hasLiked?: boolean;

//   // period: number;
//   // total: number;
//   // category: string;
// }
// export interface IPosts {
//   total: number;
//   posts: IPost[];
// }

function Post() {
  const location = useLocation();
  const search = location.state ? location.state.search : null;

  const [order, setOrder] = useState<string>("recent");

  const [myMajorToggle, setMyMajorToggle] = useState<boolean>(false);

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
    "프로젝트",
    "스터디",
    "멘토링",
    "밥고",
    "팀 프로젝트",
  ]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[] | []>([]);

  useEffect(() => {
    console.log(filterCategory, filterPosition, filterPay);
  }, [filterCategory, filterPosition, filterPay]);

  interface IFiltering {
    [key: string]: string[];
  }

  const categories: string[] = ["project", "study", "mentoring"];

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
  // console.log(windowPx, "px");

  const isLoginModal = useRecoilValue(isLoginModalState);
  const isSignupModal = useRecoilValue(isSignupModalState);

  // let TOTAL_POSTS = 10;
  // let POSTS_PER_PAGE = 12;
  // let TOTAL_PAGES = Math.ceil(TOTAL_POSTS / POSTS_PER_PAGE);
  const [getPageNums, setGetPageNums] = useState<number>(12);
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
        // filterPosition === "" ? null : filterPosition,
        // filterPay === "" ? null : filterPay,
        // null
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
    const selectedValue = e.currentTarget.innerText;
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
  // const handleScroll = async () => {
  //   // if (stopFetching) return;
  //   const scrollHeight = document.documentElement.scrollHeight;
  //   const scrollTop = document.documentElement.scrollTop;
  //   const clientHeight = document.documentElement.clientHeight;

  //   console.log(scrollHeight, scrollTop, clientHeight);

  //   if (unionDataLoading) return;
  //   if (scrollHeight - scrollTop === clientHeight) {
  //     // window.scrollTo(0, 0);

  //     setUnionDataLoading(true);
  //     setTimeout(() => {
  //       window.scrollTo(0, 0);
  //       // sleep(3000).then(() => console.log("1"));
  //       setNowPage((prev) => prev + 1);
  //       refetch();
  //     }, 3000);
  //   }
  // };

  // const {isLoading, data, refetch} = useMoreData(page);

  // useEffect(() => {

  //   refetch();
  // }, [nowPage]);

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  // const [unionDataLoading, setUnionDataLoading] = useState<boolean>(false);

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
      {isLoading || isLoginCheckLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          {isLoginModal ? <Login /> : null}
          {isSignupModal ? <SignUp2 /> : null}
          <Container>
            <Banner src="./img/banner_post.png"></Banner>

            <div className="">
              <div className="flex justify-center items-center w-full h-[40px] md:h-[60px] bg-white">
                <div className=" flex justify-evenly w-[90%]  ">
                  {Categories.map((category, index) => (
                    <button
                      id="categoryButton"
                      onClick={onClick}
                      className={`${
                        selectedCategory === category
                          ? "text-blue-600 font-semibold"
                          : "text-gray-400"
                      }   md:text-[16px] text-[10px] hover:text-blue-300`}
                      key={index}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex py-[0px] md:py-[20px] justify-between px-[20px] ">
                <div className="md:flex items-center">
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
                    <div className="md:w-[130px] flex md:justify-end mr-[20px] py-[10px] md:py-[0px]">
                      <p className="md:text-[18px] text-[12px] ">
                        필터링 키워드
                      </p>
                    </div>
                    <div className="w-[280px] mr-[30px]">
                      <input
                        value={keywordInput}
                        id="keywordInput"
                        onKeyPress={onKeyPress}
                        onChange={onChange}
                        type="text"
                        className="w-full md:text-[16px] text-[12px] px-[10px]  border-b border-gray-400 bg-gray-100 "
                        placeholder="키워드로 원하는 모집글만 볼 수 있어요."
                      />
                    </div>
                  </span>
                  <span>
                    <div className="mb-[20px] md:mb-[0px] w-full flex items-center ">
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
                          className="  min-w-[80px] text-[10px] lg:min-w-[100px] lg:text-[16px] py-[3px] lg:py-[5px] bg-white flex items-center justify-center border-0 rounded-lg text-center px-[7px] lg:px-[15px] mr-[15px] lg:mr-[30px]"
                        >
                          {keyword}
                          <FormCancelIcon />
                        </button>
                      ))}
                    </div>
                  </span>
                </div>

                {/* <button id="allFilterDelete" onClick={onClick}>
                      필터 전체 삭제 버튼
                </button> */}
              </div>
              <div className="md:flex items-center mx-[20px] items-center mb-[0px] md:mb-[30px] ">
                <div className="md:w-[130px] flex md:justify-end mr-[20px] ">
                  <p className="text-[12px] md:text-[16px] mb-[10px] md:mb-[0px]">
                    추천 키워드{" "}
                  </p>
                </div>
                <div className="grid grid-cols-5 md:flex">
                  {keywords.map(
                    (keyword, index) =>
                      !selectedKeywords.includes(keyword as never) && (
                        <button
                          id="insertKeywordButton"
                          onClick={onClick}
                          key={index}
                          className="flex justify-center text-[10px] md:text-[16px] bg-gray-200 flex items-center py-[5px] border-0 rounded-lg text-center px-[5px] md:px-[15px] mr-[15px]"
                        >
                          <p>{keyword}</p>
                          <i className="fa-solid fa-plus ml-[5px] md:mt-[1px] text-[10px] md:text-[14px]"></i>
                        </button>
                      )
                  )}
                </div>
              </div>
            </div>

            {/* keyword */}
            {/* <div className="flex items-center h-[60px] border-b-2 border-gray-300 px-[50px] text-[17px]">
                <div className="flex items-center min-w-[330px] justify-between">
                <label htmlFor="filtering" className="">키워드</label>
                <input id="filtering" type="text" className="border-2 border-gray-400 px-[10px]" placeholder="키워드 입력"></input>
                <button className="px-[10px] text-white h-[29px] bg-black">검색</button>
                </div>
                <div className="w-full ml-[50px] flex items-center">
                {selectedKeywords.map((keyword , index) => (
                  <div id={keyword} onClick={() => {
                    setSelectedKeywords( (prev) => {
                      const deleteIdx = prev.findIndex( (elem) => elem === keyword)
                    return [...prev.splice(0,deleteIdx) , ...prev.splice(deleteIdx+1)];
                    })
                  }} 
                  key={index} className="border-2 bg-black flex items-center h-[33px] text-white rounded-full text-center px-[20px] mr-[30px] ">
                    <p>{keyword}</p>
                    </div>))}
                    

                  {keywords.map( ( keyword, index) => (
                    !selectedKeywords.includes(keyword as never) &&(<div id={keyword} onClick={
                      () => {
                        setSelectedKeywords(prev => [...prev , keyword]);
                      }
                    } key={index} className=" flex items-center border-2 h-[33px] border-gray-300 rounded-full text-center px-[20px] mr-[30px] ">
                      <p>{keyword}</p>
                      </div>)
                    
                  ))}
                  

                </div>
              </div> */}

            {/* <FilterRow>
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
            )} */}

            <SortBox>
              <div className="md:flex items-center justify-between">
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

                <div className="flex md:none mt-[10px] md:mt-[0px]">
                  <SelectFilterBox
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
                <button className=" md:min-w-[130px] text-[10px] md:text-[15px] text-white py-[5px] bg-blue-600 px-[15px] rounded-lg py-[8px]">
                  모집글 작성하기
                </button>
              </Link>
            </SortBox>

            {/* { ( */}
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

            {
              unionData.length === 0 && (
                <div className="flex justify-center items-center w-full h-[50px] text-[17px] text-black mt-[50px]">
                  <i className="fa-solid fa-circle-exclamation text-black mx-[10px]">
                    &nbsp;
                  </i>
                  <p className="font-bold">게시물이 존재하지 않습니다</p>
                </div>
              )

              // : (
              // <div className="flex justify-center items-center w-full h-[100px]  ">
              //   <button
              //     id="prev"
              //     onClick={onPageClick}
              //     className="w-[70px] h-[30px] flex justify-center items-center "
              //   >
              //     <i className="fa-solid fa-circle-left text-[30px]"></i>
              //   </button>

              //   {Array.from(
              //     {
              //       length: Math.ceil(
              //         (Number(posts?.total)) / POSTS_PER_PAGE
              //       ),
              //     },
              //     (v, i) => i + 1
              //   )
              //     .slice(prevPage, nextPage - 1)
              //     .map((page) => (
              //       <button
              //         id={page + ""}
              //         onClick={onPageClick}
              //         className={`w-[30px] h-[30px] mx-1 border-2 rounded bg-black text-white border-black font-bold hover:opacity-70
              //        ${page === nowPage && "opacity-30"} `}
              //       >
              //         {page}
              //       </button>
              //     ))}
              //   {/* </>
              // )} */}

              //   <button
              //     id="next"
              //     onClick={onPageClick}
              //     className="w-[70px] h-[30px] flex justify-center items-center"
              //   >
              //     <i className="fa-solid fa-circle-right text-[30px]"></i>
              //   </button>
              // </div>
              // )
            }
          </Container>
          <p id="sentinel"></p>
        </>
      )}
    </>
  );
}

export default Post;
