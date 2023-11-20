import { useMutation, useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import {
  IReadAllPosts,
  IReadOnePost,
  keywordAutoComplete,
  loginCheckApi,
  readPosts,
} from "api";
import { AxiosError, AxiosResponse } from "axios";
import {
  isLoginModalState,
  isLoginState,
  isLogoutConfirmState,
  isPreventAlertState,
  isSignupModalState,
} from "components/atom";
import Login from "components/LoginModal";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import tw from "tailwind-styled-components";
import Thumbnail from "./Thumbnail";
import "./css/button.css";
import "./css/textfield.css";
import SignUp2 from "Routes/Main/SignUp2";
import LoadingLottie from "components/LoadingLottie";
import Outline from "components/Outline";
import AlertModal from "components/AlertModal";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { Autocomplete, TextField } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { BsPlusLg } from "react-icons/bs";
const SelectFilterBox = tw.select`
mr-[20px] px-[10px] bg-[#F9FAFB] py-[5px] rounded-lg text-center border
text-gray-500 text-[16px] w-auto
`;

const MyMajorBox = tw.div`
flex items-center bg-[#F9FAFB] py-[5px] mr-[20px] rounded-lg px-[10px] text-gray-500 border
text-[16px] w-auto
`;
const MyMajorInput = tw.input`
mr-[10px] h-[20px] 
`;
const MyMajorText = tw.label`
w-[150px]
`;

const Banner = tw.img`
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

gap-x-[50px]

`;

const Container = tw.div`
bg-gray-100
pb-[200px]
min-w-[1470px]

min-h-[1500px]

`;

function Post() {
  const location = useLocation();
  const search = location.state ? location.state.search : null;

  const [order, setOrder] = useState<string>("recent");

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

  // interface IFiltering {
  //   [key: string]: string[];
  // }

  const isLoginModal = useRecoilValue(isLoginModalState);
  const isSignupModal = useRecoilValue(isSignupModalState);

  const [getPageNums, setGetPageNums] = useState<number>(4);

  const [nowPage, setNowPage] = useState(1);

  const [LIMIT] = useState<number>(12);
  useEffect(() => {
    const fn = async () => {
      await setNowPage(1);
      refetch();
      setHideSentinel(false);
    };
    fn();
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

  useEffect(() => {
    const fn = () => {
      if (getPageNums < LIMIT) {
        setHideSentinel(true);
        return;
      }
    };
    fn();
  }, [getPageNums]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [nowPage]);

  // [사이에 필터링을 추가하기]
  const {
    data: posts,
    isLoading,
    refetch,
  } = useQuery<IReadAllPosts>(
    [
      "FilteredPosts",
      [search, order, selectedCategory, LIMIT + "", selectedKeywords, nowPage],
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
        if (scrolling) {
          setUnionData((prev) => [...prev, ...posts.posts]);
        } else {
          setUnionData(posts.posts);
        }
        setGetPageNums(posts.total);
        setScrolling(false);
      },
    }
  );

  const setIsLogin = useSetRecoilState(isLoginState);

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
    } else if (selectedId === "majorSelect") {
      setSelectedMajor(selectedValue);
    } else if (selectedId === "gradeSelect") {
      setSelectedGrade(selectedValue);
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedId = e.currentTarget.id;
    const selectedValue = e.currentTarget.value;

    setKeywordInput(selectedValue);
  };
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const selectedId = e.currentTarget.id;
    const selectedValue = e.currentTarget.childNodes[0].textContent!;

    if (selectedId === "categoryButton") {
      setSelectedCategory(selectedValue);
    }
    // else i
    else if (selectedId === "deleteKeywordButton") {
      setSelectedKeywords((prev) => prev.filter((e) => e !== selectedValue));
    } else if (selectedId === "insertKeywordButton") {
      setSelectedKeywords((prev) => {
        const newKeywords = [...prev, selectedValue];

        return newKeywords;
      });
    } else if (selectedId === "allFilterDelete") {
      setSelectedCategory("");
      setSelectedGrade("학년 무관");
      if (majorRef.current) majorRef.current.selectedIndex = 0;
      if (gradeRef.current) gradeRef.current.selectedIndex = 0;
      setSelectedKeywords([]);
      setSelectedMajor("전공 무관");
    }
  };

  const Categories = [
    // "전체",
    // "동아리",
    // "학회",
    // "공모전/대회",
    // "스터디",
    // "프로젝트",
    // "학술모임",
    // "운동/게임/취미",
    // "기타",
    "전체",
    "공모전/대회/프로젝트",
    "동아리",
    "학회",
    "수업 팀플/스터디",
    "운동/게임/취미",
    // "기타",
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

      setKeywordInput("");
    }
  };

  const [unionData, setUnionData] = useState<IReadOnePost[] | []>([]);

  const sentinel = document.getElementById("sentinel") as Element;

  const [scrolling, setScrolling] = useState<boolean>(false);
  const [hideSentinel, setHideSentinel] = useState(false);

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      setNowPage((prev) => prev + 1);
      //entry가 interscting 중이 아니라면 함수를 실행하지 않습니다.

      // if (isLoading) return;
      setScrolling(true);
      //현재 page가 불러오는 중임을 나타내는 flag를 통해 불러오는 중이면 함수를 실행하지 않습니다.
      observer.observe(document.getElementById("sentinel") as Element);
      //observer를 등록합니다.
      // page._page += 1;
      //불러올 페이지를 추가합니다.
      // page.list.search();

      refetch();
      //페이지를 불러오는 함수를 호출합니다.
    });
  });

  useEffect(() => {
    if (!sentinel) return;
    io.observe(document.getElementById("sentinel") as Element);
  }, []);

  const [keywordAutoList, setKeywordAutoList] = useState<string[] | []>([]);

  useEffect(() => {
    keywordAutoComplete(keywordInput).then((keywords) =>
      setKeywordAutoList(keywords.results)
    );
  }, [keywordInput]);

  const isLogin = useRecoilValue(isLoginState);

  const [isLogoutConfirmModal, setIsLogoutConfirmModal] =
    useRecoilState(isLogoutConfirmState);
  const [isPreventAlertModal, setIsPreventAlertModal] =
    useRecoilState(isPreventAlertState);

  const searchKeyword = (e: any) => {
    e.preventDefault();
    if (keywordInput === "") return;
    setSelectedKeywords((prev) => [...prev, keywordInput]);
    setKeywords((prev) => [...prev, keywordInput]);
    setKeywordInput("");
  };

  const onEnterPress = useCallback(
    (e: any) => {
      if (e.key === "Enter" && !autocompleteOpenRef.current) {
        searchKeyword(e);
      }
    },
    [keywordInput]
  );

  const autocompleteOpenRef = useRef(false);
  return (
    <>
      {(isLoading || isLoginCheckLoading) && <LoadingLottie isPost={true} />}
      <>
        <Helmet>
          <title>Team+</title>
        </Helmet>
        {isLoginModal ? <Login /> : null}
        {isSignupModal ? <SignUp2 /> : null}
        {isLogoutConfirmModal ? (
          <AlertModal
            text="로그아웃 되었습니다."
            onClick={() => setIsLogoutConfirmModal(false)}
          />
        ) : null}
        {isPreventAlertModal ? (
          <AlertModal
            text="로그인이 필요합니다."
            onClick={() => setIsPreventAlertModal(false)}
          />
        ) : null}

        <Container>
          <Banner src="./img/teamPlusBanner.png" className="w-full  "></Banner>

          <Outline bgColor="bg-white">
            {/* <div className=" mx-auto flex items-center w-full h-[40px] md:h-[60px] bg-white "> */}
            <div className="min-w-[1470px] mx-auto flex justify-center items-center h-[60px] bg-white ">
              <div className="flex justify-between items-center min-w-[500px] px-[70px] gap-[70px] ">
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
            <div className="min-w-[1470px] bg-gray-100 pt-[20px]">
              <div className="flex py-[20px] px-[70px]">
                <div className="flex items-start  ">
                  <span className="flex items-center ">
                    <div className="mr-[20px] py-[0px]">
                      <p className="text-[16px] font-[500]">필터링 키워드</p>
                    </div>

                    <div className=" w-[300px] mr-[20px]">
                      <Autocomplete
                        id="size-small-standard"
                        size="small"
                        options={keywordAutoList}
                        onChange={(event, newValue) => {
                          setKeywordInput(newValue as string);
                        }}
                        onOpen={() => {
                          autocompleteOpenRef.current = true;
                        }}
                        onClose={() => {
                          autocompleteOpenRef.current = false;
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            onKeyDown={onEnterPress}
                            value={keywordInput}
                            onChange={onChange}
                            variant="standard"
                            placeholder="키워드로 원하는 모집글만 볼 수 있어요"
                          />
                        )}
                      />
                    </div>
                  </span>

                  <SearchOutlinedIcon
                    className="search"
                    sx={{ width: "22px", mr: "20px" }}
                    onClick={searchKeyword}
                  />

                  <div className="">
                    <div className="mb-[0px] flex flex-wrap gap-x-[10px] gap-y-[10px]">
                      {selectedKeywords.map((keyword, index) => (
                        <button
                          id="deleteKeywordButton"
                          onClick={onClick}
                          key={index}
                          className="flex justify-center text-[14px] bg-white flex items-center py-[5px] border-0 rounded-lg text-center px-[13px] h-[30px]"
                        >
                          <p>{keyword}</p>
                          <CloseIcon sx={{ width: "17px", ml: "4px" }} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className=" flex items-start px-[70px] mb-[30px]">
                <div className="flex mr-[20px] mt-[4px]">
                  <p className="text-[14px] mb-[0px]">추천 키워드 </p>
                </div>
                <div className="flex flex-wrap gap-x-[10px] gap-y-[10px]">
                  {posts?.relatedKeywords.map(
                    (keyword, index) =>
                      !selectedKeywords.includes(keyword as never) && (
                        <button
                          id="insertKeywordButton"
                          onClick={onClick}
                          key={index}
                          className="flex justify-center text-[14px] bg-gray-200 flex items-center py-[5px] border-0 rounded-lg text-center px-[13px] h-[30px]"
                        >
                          <p>{keyword}</p>{" "}
                          <BsPlusLg style={{ marginLeft: "5px" }} />
                        </button>
                      )
                  )}
                </div>
              </div>

              <div className="px-[70px] mx-auto">
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
                  <Link to="/add">
                    <button className="min-w-[130px] text-[15px] text-white py-[5px] bg-blue-600 px-[15px] rounded-lg py-[8px]">
                      모집글 작성하기
                    </button>
                  </Link>
                </SortBox>
              </div>

              {/* { ( */}
              <div className=" flex justify-center">
                <PostGrid>
                  {/* {(posts?.posts.length as number) > 0 &&
                (posts as IPosts).posts.map((post, index) => (
                  <Card key={index} post={post} refetch={refetch} index={index}  />
                ))} */}
                  {unionData.map((post: IReadOnePost, index: number) => (
                    <Link key={index} to={`/post/${post?.id}`}>
                      <Thumbnail {...post} refetch={refetch} />
                    </Link>
                  ))}
                </PostGrid>
              </div>
            </div>
            {/* </Outline> */}
          </Outline>

          {!isLoading && unionData.length === 0 && (
            <div className="flex justify-center items-center min-w-[1470px] h-[50px] text-[17px] bg-slate-100 text-black pt-[50px]">
              <i className="fa-solid fa-circle-exclamation text-black mx-[10px]">
                &nbsp;
              </i>
              <p className="font-bold">게시물이 존재하지 않습니다</p>
            </div>
          )}
        </Container>

        {!hideSentinel && <p id="sentinel"></p>}
      </>
    </>
  );
}

export default Post;
