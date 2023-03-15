import { useQuery } from "@tanstack/react-query";
import { fakeUsers, IUser, IUsers, readMembers } from "api";
import { AxiosError, AxiosResponse } from "axios";
import { isLoginModalState, isLoginState } from "components/atom";
import LoadingAnimation from "components/LoadingAnimation";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import tw from "tailwind-styled-components";
import Login from "../../components/LoginModal";
import "./button.css";

const Item = tw(motion.div)`
 shadow-md
 h-[170px] 
 w-[260px]
 bg-[#f6f6f6]
 rounded-xl
 p-[10px]



`;

const StyledSidebar = tw.div`
min-w-[235px]
border-r-2
border-b-2
border-t-2
border-gray-200
hidden
md:block
px-[20px]
pt-[20px] 
pb-[60px]
`;

const StyledFilterItem = tw.div`
mt-[50px]
`;

const StyledSpan = tw.span`
flex 

items-start
justify-between
`;

const StyledSubTitle = tw.p`
mb-[10px]
text-[20px] 
font-unique
`;
const StyledButton = tw.svg`
w-[15px]
mt-1
`;

const Styledli = tw.li`
flex 
my-[10px]

`;

const Styledul = tw.ul`
`;

const StyledRadio = tw.input`
mr-3
`;

const StyledliText = tw.label`
text-[15px]
font-unique
hover:text-blue-700

`;

function Person() {
  const [showPositions, setShowPositions] = useState(true);
  const [showGrades, setShowGrades] = useState(true);
  const [showDepartments, setShowDepartments] = useState(true);

  const [position, setPosition] = useState<string | null>(null);
  const [grade, setGrade] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);

  const onClick = (event: React.MouseEvent) => {
    const {
      currentTarget: { id },
    } = event;

    if (id === "포지션") {
      setShowPositions((prev) => !prev);
    } else if (id === "학년") {
      setShowGrades((prev) => !prev);
    } else if (id === "학부") {
      setShowDepartments((prev) => !prev);
    } else {
      if (
        (
          (event.currentTarget.parentElement as HTMLElement)
            .parentElement as HTMLElement
        ).id === "포지션ul"
      ) {
        setPosition(id);
      } else if (
        (
          (event.currentTarget.parentElement as HTMLElement)
            .parentElement as HTMLElement
        ).id === "학년ul"
      ) {
        setGrade(id);
      } else if (
        (
          (event.currentTarget.parentElement as HTMLElement)
            .parentElement as HTMLElement
        ).id === "학부ul"
      ) {
        setDepartment(id);
      }
    }

    if (id === "reset") {
      if (position) {
        (document.querySelector(`#${position}`) as HTMLInputElement).checked =
          false;
        setPosition(null);
      }

      if (grade) {
        (
          document
            .querySelectorAll("#학년ul li")
            [Number(grade ? grade?.slice(0, 1) : 1) - 1].querySelector(
              "input"
            ) as HTMLInputElement
        ).checked = false;
        setGrade(null);
      }

      if (department) {
        (document.querySelector(`#${department}`) as HTMLInputElement).checked =
          false;
        setDepartment(null);
      }
    }
  };

  // const Users = fakeUsers;

  // const TOTAL_POSTS = 200;
  const POSTS_PER_PAGE = 12;
  // const TOTAL_PAGES = Math.ceil(TOTAL_POSTS / POSTS_PER_PAGE);
  const [nowPage, setNowPage] = useState(1);
  const [prevPage, setPrevPage] = useState(Math.floor((nowPage - 1) / 10) * 10);
  const [nextPage, setNextPage] = useState(Math.ceil(nowPage / 10) * 10 + 1);

  const onPageClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { id },
    } = event;
    if (id === "next") {
      if (nextPage <= Math.ceil((Users?.total as number) / POSTS_PER_PAGE))
        setNowPage(nextPage);
      else setNowPage(Math.ceil((Users?.total as number) / POSTS_PER_PAGE));
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
    // console.log(prevPage, nextPage);
    console.log(nowPage);
  }, [nowPage]);

  const {
    data: Users,
    isLoading,
    refetch,
  } = useQuery<IUsers>(
    ["members"],
    () => readMembers(nowPage, position, grade, department),

    {
      onSuccess: () => {
        console.log("성공하였습니다.");
      },
      onError: (error) => {
        console.log("실패하였습니다.");
        if (
          ((error as AxiosError).response as AxiosResponse).status === 401 ||
          ((error as AxiosError).response as AxiosResponse).status === 403
        ) {
          alert("로그인이 필요합니다.");
          if (localStorage.getItem("key")) localStorage.removeItem("key");
          setIsLoginModal(true);
          setIsLogin(false);
          navigate("/");
        }
      },
    }
  );

  const setIsLogin = useSetRecoilState(isLoginState);
  const setIsLoginModal = useSetRecoilState(isLoginModalState);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(nowPage);
    refetch();
    console.log(position, grade, department, nowPage);
  }, [position, grade, department, nowPage]);

  interface IFilterLists {
    position : string[],
    grade : string[],
    department : string[],
  }

  const FilterLists : IFilterLists = {
    position : ["일반" , "기획자" , "개발자" , "디자이너"],
    grade : ["1학년" , "2학년" , "3학년" , "4학년"],
    department : ["글로벌리더십학부" , "국제어문학부" , "경영경제학부" , "법학부" , "커뮤니케이션학부" , "공간환경시스템공학부" , "기계제어공학부" , "콘텐츠융합디자인학부" , "생명과학부" , "전산전자공학부" , "상담심리사회복지학부" , "ICT창업학부"]

  }

  return (
    <>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <div className="flex w-full">
          <StyledSidebar>
            <div className="flex justify-between items-center">
              <p className="text-[30px] font-unique mt-[10px] mb-[15px]">
                Filter
              </p>
            </div>
            <button
              onClick={onClick}
              id="reset"
              className="flex mt-[10px] float-right text-[13px] items-center border-2 border-blue-700 text-blue-800 rounded-md p-[3px] hover:opacity-70 hover:scale-110"
            >
              <i className="fa-solid fa-arrow-rotate-left"></i>
            </button>

            <StyledFilterItem>
              <StyledSpan>
                <StyledSubTitle>포지션</StyledSubTitle>

                <StyledButton
                  id="포지션"
                  onClick={onClick}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                </StyledButton>
              </StyledSpan>
              {!showPositions ? null : (
                <Styledul id="포지션ul">
                  {FilterLists["position"].map((position, index) => (
                  <Styledli key={index} className="checks etrans">
                    <StyledRadio
                      name="포지션"
                      id={position}
                      type="radio"
                      onClick={onClick}
                    />
                    <StyledliText htmlFor={position}>{position}</StyledliText>
                  </Styledli>
                  ) )}
                </Styledul>
              )}
            </StyledFilterItem>

            <StyledFilterItem className="">
              <StyledSpan>
                <StyledSubTitle>학년</StyledSubTitle>
                <StyledButton
                  id="학년"
                  onClick={onClick}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                </StyledButton>
              </StyledSpan>
              {!showGrades ? null : (
                <Styledul id="학년ul">
                  {FilterLists["grade"].map( (grade, index) => (
                  <Styledli key={index} className="checks etrans">
                    <StyledRadio
                      name="학년"
                      id={grade}
                      onClick={onClick}
                      type="radio"
                    />
                    <StyledliText htmlFor={grade}>{grade}</StyledliText>
                  </Styledli>
                  ) )}
                </Styledul>
              )}
            </StyledFilterItem>

            <StyledFilterItem className="">
              <StyledSpan>
                <StyledSubTitle>학부</StyledSubTitle>
                <StyledButton
                  id="학부"
                  onClick={onClick}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                </StyledButton>
              </StyledSpan>

              {!showDepartments ? null : (
                <Styledul id="학부ul">
                  {FilterLists["department"].map((department,index) => (
                    <Styledli key={index} className="checks etrans">
                    <StyledRadio
                      name="학부"
                      id={department}
                      onClick={onClick}
                      type="radio"
                    />
                    <StyledliText htmlFor={department}>
                      {department}
                    </StyledliText>
                  </Styledli>

                  ))}
                </Styledul>
              )}
            </StyledFilterItem>
          </StyledSidebar>

          <div
            className="w-full flex flex-col border-b-2
              border-gray-200 pb-[50px]"
          >
            <img
              className=" mb-[40px] w-full mx-[0px] bg-[#898989]"
              src="img/personBanner2.png"
            ></img>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 px-[20px] pb-[70px]">

              {(Users?.members.length as number) > 0 &&
                Users?.members.map((user) => (
                  <Link
                    className="max-h-[170px] mx-auto"
                    to="/profile"
                    state={{
                      user,
                    }}
                  >
                    <Item whileHover={{ scale: 1.08 }}>
                      <div
                        className={`flex border rounded-full bg-white w-[65px] h-[20px] justify-center items-center
${
  user?.position === "디자이너"
    ? "border-[#d0a5fe] text-[#d0a5fe]"
    : user?.position === "개발자"
    ? "border-[#7b87e7] text-[#7b87e7]"
    : "border-[#9797aa] text-[#9797aa]"
}
`}
                      >
                        <p className="text-[12px] font-bold">
                          {user?.position}
                        </p>
                      </div>
                      <div className="flex flex-col items-center">
                        <img
                          src={user?.pictureUrl}
                          className="rounded-full w-[60px] h-[60px]"
                        />
                        <p className="text-[16px] mt-[7px] font-semibold">
                          {user?.nickname}
                        </p>
                        <p className="text-[12px] mt-[3px] text-[#aaaaaa]">
                          {user?.department}
                        </p>
                        <p className="text-[12px] mt-[3px] text-[#aaaaaa]">
                          {user.grade}
                        </p>
                      </div>
                    </Item>
                  </Link>
                ))}
            </div>
            {Users?.total === 0 ? (
              <div className="flex justify-center items-center w-full h-[50px] text-[20px] ">
                <i className="fa-solid fa-triangle-exclamation text-yellow-500 ">
                  &nbsp;
                </i>
                <p className="font-bold">해당하는 사람이 존재하지 않습니다.</p>
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
                      (Users?.total as number) / POSTS_PER_PAGE
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

                <button
                  id="next"
                  onClick={onPageClick}
                  className="w-[70px] h-[30px] flex justify-center items-center"
                >
                  <i className="fa-solid fa-circle-right text-[30px]"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Person;
