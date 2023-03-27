import { useMutation, useQuery } from "@tanstack/react-query";
import LoadingAnimation from "components/LoadingAnimation";
import {
  addLikePost,
  createMentoring,
  deleteLikePost,
  departments,
  loginCheckApi,
  posts,
  readPosts,
} from "api";
import { AxiosError, AxiosResponse } from "axios";
import { isLoginModalState, isLoginState } from "components/atom";
import Login from "components/LoginModal";
import { motion } from "framer-motion";
import React, { ChangeEvent, ComponentRef, useEffect, useRef, useState } from "react";
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



const FormModifyOKIcon = tw.i`
fa-solid fa-check text-[15px] text-black mr-[5px]
`

export interface IPost {
  id: number;
  writer: string;
  title: string;
  content: string;
  contact: string;
  postStart: Date;
  postEnd: Date;
  projectStart: Date;
  duration: string[];
  keywords: string[];
  nliked: number;
  total: number;
  curr: number;
  views: number;
  createdDate: Date;
  lastModifiedDate: Date;
  varified?: boolean;
  hasLiked?: boolean;
  

  // period: number;
  // total: number;
  // category: string;
}
export interface IPosts {
  total: number;
  posts: IPost[];
}


function Post() {
  const location = useLocation();
  const search = location.state ? location.state.search : null;

  const [order, setOrder] = useState<string>("recent");
  

  // Filtering
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterPosition, setFilterPosition] = useState<string>("");
  const [filterPay, setFilterPay] = useState<string>("");

  // const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   if (event.currentTarget.id === "category") {
  //     // 필터링 취소
  //     if (filterCategory === event.currentTarget.name) {
  //       setFilterCategory("");
  //     } else setFilterCategory(event.currentTarget.name);
  //     setFilterPosition("");
  //     setFilterPay("");
  //   } else if (event.currentTarget.id === "position") {
  //     // 2차 필터링 취소
  //     if (filterPosition === event.currentTarget.name) {
  //       setFilterPosition("");
  //     } else setFilterPosition(event.currentTarget.name);
  //   } else if (event.currentTarget.id === "pay") {
  //     //3차 필터링 취소
  //     if (filterPay === event.currentTarget.name) {
  //       setFilterPay("");
  //     } else {
  //       setFilterPay(event.currentTarget.name);
  //     }
  //   }
  // };
  
 


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
      onSuccess: (posts) => {
        // console.log(nowPage,order,filterCategory , filterPosition , filterPay);
        console.log("Fetched!" ,posts as any);
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

  



  const [selectedMajor , setSelectedMajor ] = useState<string | "">("");
  const [selectedGrade , setSelectedGrade] = useState<string | "">("");
  const [selectedCategory , setSelectedCategory] = useState<string | "">(""); // about category
  const [keywordInput , setKeywordInput] = useState<string | "">("dd");
  const [keywords , setKeywords] = useState<string[] | []>(["프로젝트" , "스터디" , "멘토링" , "밥고" , "팀 프로젝트"]);
  const [selectedKeywords , setSelectedKeywords] = useState<string[] | []>([]);
  
  const onInput = (event: React.FormEvent<HTMLSelectElement>) => {
    const selectedId = event.currentTarget.id;
    const selectedValue = event.currentTarget.value;
    if(selectedId === "sortSelect"){
      setOrder(selectedValue);
      console.log(selectedValue);
    }
    else if(selectedId === "majorSelect"){
      setSelectedMajor(selectedValue);
      console.log(selectedValue)
    }
    else if(selectedId ==="gradeSelect"){
      setSelectedGrade(selectedValue);
      console.log(selectedValue)

    }
    
  };
  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const selectedId = e.currentTarget.id;
    const selectedValue = e.currentTarget.value;
    console.log("onChange inputValue : " , selectedValue);
    
    if(selectedId === "keywordInput") setKeywordInput(selectedValue);
  }
  const onClick = (e : React.MouseEvent<HTMLButtonElement>) => {
   
    const selectedId = e.currentTarget.id;
    const selectedValue = e.currentTarget.innerText;
    // if(Categories.includes(buttonName)){
    //   const targetIndex = Categories.findIndex( elem => elem === buttonName);
    //   setSelectedCategory(targetIndex);
    // }

    if(selectedId ==="categoryButton"){
      setSelectedCategory(selectedValue);

      console.log(selectedValue);

    }
   
    // else i
    else if(selectedId === "deleteKeywordButton" ){
      setSelectedKeywords( (prev) => {
        const deleteIdx = prev.findIndex( (elem) => elem === selectedValue)
        const newKeywords = [...prev.slice(0,deleteIdx) , ...prev.slice(deleteIdx+1)]
        console.log("keyWords : " , newKeywords)
        return newKeywords;
        })

    }
    else if(selectedId === "insertKeywordButton"){
      setSelectedKeywords(prev => {
        const newKeywords = [...prev , selectedValue];

        console.log("keyWords : " , newKeywords);
        return newKeywords;
      }
    );
    }
    else if(selectedId ==="allFilterDelete"){
      setSelectedCategory("");
      setSelectedGrade("모든 학년");
      if(majorRef.current) majorRef.current.selectedIndex = 0;
      if(gradeRef.current) gradeRef.current.selectedIndex = 0;
      setSelectedKeywords([]);
      setSelectedMajor("모든 전공");
      //다시 전체 모집글 refetch
    }

   
  }

  const Categories = ["동아리" , "학회" , "공모전/대회" , "스터디" , "프로젝트" , "학술모임" , "운동/게임/취미" , "기타"];
  const Majors =  ["모든 전공" ,"글로벌리더십학부" , "국제어문학부" , "경영경제학부" , "법학부" , "커뮤니케이션학부" , "공간환경시스템공학부" , "기계제어공학부" , "콘텐츠융합디자인학부" , "생명과학부" , "전산전자공학부" , "상담심리사회복지학부" , "ICT창업학부"];
  const Grades = ["모든 학년", "23학번 새내기" , "1학년" , "2학년" , "3학년" , "4학년" , "9학기 이상"];

  const majorRef = useRef<HTMLSelectElement>(null);
  const gradeRef = useRef<HTMLSelectElement>(null);
  return (
    <>
      {isLoading || isLoginCheckLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          {isLoginModal ? <Login /> : null}
          <Container>
            <Banner src="/img/postBannerReal.png"></Banner>
            
          <div>
            <div className=" flex justify-between items-center px-[50px] border-black border-b-2 w-full h-[60px]">
              <div className="w-full flex justify-evenly">
                {Categories.map((category, index) => (
                
                <button id="categoryButton" onClick={onClick} className={`${selectedCategory === category ? 'text-black' :'text-gray-400'}`} key={index}>
                  {category}
                </button>
                ))}
              
              </div>
                  
                  
            </div>
              <div className="flex h-[60px] justify-between px-[50px] border-b-2 border-black">
                <div className="flex  items-center">
                  <select ref={majorRef} id="majorSelect" onInput={onInput} className="px-[10px] border-2 border-black">
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
                  </select>
                  <span className="flex items-center">
                    <p className="ml-[50px]">키워드</p>
                    <input value={keywordInput} id="keywordInput" onChange={onChange} type="text" className="w-[100px] ml-[20px] px-[10px] border-2 border-black rounded-lg"/>
                    <button className="ml-[20px] border border-black px-[5px] rounded-lg bg-black text-white">추가</button>
                  </span>
                  <span>
                      <div className="w-full ml-[50px] flex items-center">
                    {selectedKeywords.map((keyword , index) => (
                      <button id="deleteKeywordButton" onClick={onClick} 
                      key={index} className="text-[14px] flex items-center border-2 h-[25px] border-black rounded-lg text-center px-[10px] mr-[30px]">
                        <FormModifyOKIcon />
                        {keyword}
                        </button>))}
                        

                      {keywords.map( ( keyword, index) => (
                        !selectedKeywords.includes(keyword as never) &&(<button id="insertKeywordButton" onClick={onClick} key={index} className="text-[14px] flex items-center border-2 h-[25px] border-black rounded-lg text-center px-[10px] mr-[30px] ">
                          <p>{keyword}</p>
                          </button>)
                        
                      ))}
                      

                    </div>
                  </span>
                </div>
              
            
              
                <button id="allFilterDelete" onClick={onClick}>
                      필터 전체 삭제 버튼
                </button>
              
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
              <div className="flex items-center justify-between w-[350px]">
                <div className="flex">
                내 전공 관련글만 보기
                  <input type="checkBox" className=" ml-[10px] mt-[4px] w-[20px] h-[20px] bg-[#eeeeee]" />
                </div>
                <div className="flex items-center">
                  {/* <SortTitle>Sort by</SortTitle> */}
                  <SortSelect id="sortSelect" className="vertical-center" onInput={onInput} value={order}>
                    <option id="recent" value="recent">최신 순</option>
                    <option id="likes" value="likes">찜 많은 순</option>
                    <option id="member" value="member">모집 인원 마감 임박</option>
                    <option id="end" value="end">모집마감 임박순</option>
                  </SortSelect>
                </div>
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
                  <Card key={index} post={post} refetch={refetch} index={index}  />
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
                      (Number(posts?.total)) / POSTS_PER_PAGE
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
