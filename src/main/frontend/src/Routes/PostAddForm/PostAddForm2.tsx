import tw from "tailwind-styled-components";
import React, { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import "./css/heading.css";
import "./css/textarea.css";
import "./css/date.css";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import styled from "styled-components";

import Thumbnail from "./components/Thumbnail";

import {
  convertDateToString,
  converter,
  IPostExample,
  PostExamples,
} from "./components/PostExamples";
import { createPost, ICreatePost } from "api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useSetRecoilState } from "recoil";
import { isLoginModalState, isLoginState } from "components/atom";
import Soon from "components/Soon";
import { AnimatePresence, motion } from "framer-motion";
import { ImageUpload } from "./components/ImageUpload";
import { Grade } from "./components/Grade";
import { Department } from "./components/Department";
import { People } from "./components/People";
import { Duration } from "./components/Duration";
import { Keywords } from "./components/Keywords";

const MyBlock = styled.div`
  background-color: white;
  .wrapper-class {
    line-height: 0.5;
    margin: 0 auto;
    margin-bottom: 4rem;
    border: 2px solid lightGray !important;
  }
  .editor {
    min-height: 300px !important;
    border-top: 3px solid lightGray !important;
    padding: 10px !important;
    border-radius: 2px !important;
  }
`;

const ExplainText = tw.p`
text-blue-600 text-[18px] mb-[30px]
`;

const MainBLUE = "bg-blue-200";
const LightMainBLUE = "bg-blue-100";

const FunctionBUTTON = `${LightMainBLUE} text-blue-600 rounded-lg px-[15px] py-[8px]`;
const DetailSelectedBUTTON = `border-2 border-blue-300 ${LightMainBLUE} px-[15px] py-[8px] rounded-lg`;
const DetailUnSelectedBUTTON = `${LightMainBLUE} px-[15px] py-[8px] rounded-lg`;

const MajorSeletedBUTTON = `border-2 border-blue-300 ${MainBLUE} px-[15px] py-[8px] rounded-lg`;
const MajorUnSelectedBUTTON = `${MainBLUE} px-[15px] py-[8px] rounded-lg`;
const UnSelectedBUTTON = `bg-gray-200 text-gray-400 px-[15px] py-[8px] rounded-lg`;

const ThumbnailKeywordsButton = tw(motion.div)`
  text-[15px] px-[15px] py-[2px] rounded-full mr-[10px] bg-blue-100
  
`;
//LightMainBlue
const ThumbnailCategoryButton = tw(motion.div)`
  min-h-[28px] py-[2px] mb-[10px] px-[15px] rounded-full mr-[10px] bg-blue-200
`;

//MainBlue

function PostAddForm2() {
  const {
    register,
    watch,
    formState,
    handleSubmit,
    getValues,
    setValue,
    trigger,
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      title: "",
      summary: "",
      first: [],
      second: [],
      postTypes: [],

      recruitStart: converter("year", new Date()), // string
      recruitEnd: converter("year", new Date()), // string
      // projectStart: "",
      duration: "미설정",

      // positions: [],
      // positionName: "",
      // positionCount: "",
      contact: "",
      targetCount: "",
      contactDetails: "",
      content: "",
      years: [],
      departments: [],
      keyword: "",
      keywords: [],
      firstKeyword: "",
      secondKeyword: "",
      qualifications: "",
      positionToggle: false,
      total: "",
      durationText: "",
      categoryETC: "",
      // first: [],
      // second: [],

      // poster : "",
    },
  });

  interface ISubmitDate {
    title: string;
    summary?: string;
    first?: string[];
    second?: string[];
    postTypes: string[];
    recruitStart: string; // string
    recruitEnd?: string; // string
    // projectStart?: string;

    duration?: string;
    durationText?: string;
    targetCount?: string;
    // positions?: IPositionList[];
    // positionName?: string;
    // positionCount?: string;
    contact: string;
    contactDetails?: string;
    content?: string;
    years?: string[];
    departments?: string[];
    keyword?: "";
    keywords?: string[];
    firstKeyword?: string;
    secondKeyword?: string;
    qualifications?: string;
    positionToggle?: boolean;
    total?: string;
    categoryETC?: string;
  }

  watch([
    "summary",
    "categoryETC",
    "departments",
    "postTypes",
    "duration",
    // "durationIndex",
    "targetCount",
    "firstKeyword",
    "secondKeyword",
    "recruitStart",
    "recruitEnd",
    // "positionName",
    // "positionCount",
    "keyword",
    "first",
    "second",
    "positionToggle",
    "years",
    "keywords",
    "departments",
    "years",
  ]);

  console.log(getValues("firstKeyword"), getValues("secondKeyword"));

  // const keywordWatchs = [watch("firstKeyword"), watch("secondKeyword")];

  const setIsLogin = useSetRecoilState(isLoginState);
  const setIsLoginModal = useSetRecoilState(isLoginModalState);

  const navigate = useNavigate();

  const { mutate: createPostMutate, isLoading: createPostLoading } =
    useMutation(
      ["createPostMutate" as string],

      (newPost: ICreatePost) => createPost(newPost),

      {
        onSuccess: (data) => {
          console.log("모집글이 생성되었습니다.", data);
          alert("모집글이 생성되었습니다.");
          navigate("/post");
        },
        onError: (error) => {
          if (
            ((error as AxiosError).response as AxiosResponse).status === 401
          ) {
            // alert("로그인이 필요합니다.");
            // setIsLoginModal(true);
            // setIsLogin(false);
            // if (localStorage.getItem("key")) localStorage.removeItem("key");
            // navigate("/");
          }
        },
      }
    );

  const [imageURLList, setImageURLList] = useState<string[] | []>([]);

  const onSubmit = (data: ISubmitDate, e: any) => {
    console.log(getValues("years"));
    console.log(getValues("departments"));
    console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    // console.log(imageURL);

    console.log("데이터");

    let newIsETC = false;

    const categoryETCIdx = data?.postTypes.findIndex(
      (elem) => elem === "기타 모임"
    );
    let newKeywords: string[] = [];

    if (categoryETCIdx !== -1 && data?.categoryETC !== "") {
      newIsETC = true;
      data?.postTypes.splice(categoryETCIdx, 1);
      data?.postTypes.push(data?.categoryETC as string);
    } else if (categoryETCIdx !== -1 && data?.categoryETC === "") {
      //""를 빼줘야함 ..
      data?.postTypes.splice(categoryETCIdx, 1);
    }

    const unionKeywords = [
      ...(data?.postTypes as string[] | []),
      ...(data?.first as string[] | []),
      ...(data?.second as string[] | []),
      ...(data?.keywords as string[] | []),
    ];

    unionKeywords.forEach((element) => {
      if (!newKeywords.includes(element)) {
        newKeywords.push(element);
      }
    });

    //duration
    const newDuration =
      data.duration === ""
        ? null
        : data?.duration === "직접 입력"
        ? data?.durationText
        : data?.duration === "미설정"
        ? ""
        : data?.duration;

    const newPost = {
      title: data?.title,
      summary: data?.summary !== "" ? data?.summary : null,
      tags: {
        first: data?.first?.length === 0 ? [] : data?.first,
        second: data?.second?.length === 0 ? [] : data?.second,
      },
      postTypes: data?.postTypes,
      recruitStart:
        data?.recruitStart === ""
          ? converter("year", new Date())
          : data?.recruitStart,
      recruitEnd: data?.recruitEnd !== "" ? data?.recruitEnd : null,
      duration: newDuration,
      targetCount: data?.targetCount,
      contact: data?.contact,
      contactDetails: data?.contactDetails !== "" ? data?.contactDetails : null,
      content:
        draftToHtml(convertToRaw(editorState.getCurrentContent())) ===
        "<p></p>\n"
          ? null
          : draftToHtml(convertToRaw(editorState.getCurrentContent())),
      years: data?.years?.length !== 0 ? data?.years : null,
      departments: data?.departments?.length !== 0 ? data?.departments : null,
      keywords: newKeywords,
      posterPaths: imageURLList?.length !== 0 ? imageURLList : null,
      isETC: newIsETC,
    };

    console.log(newPost);
    // createPostMutate(newPost as any);

    const nPost = {
      title: "시각디자인 학회 도트 리쿠르팅",
      summary:
        "도트는 그래픽, 편집, 타이포 등 다양한 분야의 디자인을 실험적으로 연구하는 학회입니다.",
      tags: {
        first: ["콘디,콘디2전공가능"],
        second: ["재학생"],
      },
      postTypes: ["학회", "학술모임"],
      recruitStart: "2023-04-02",
      recruitEnd: "2023-04-16",
      projectStart: "2023-05-01",
      duration: "d",
      targetCount: "전체00명",
      contact: "ccdot@gmail.com",
      contactDetails: "포트폴리오 제출 필수",
      content: "시각디자인 학회 도트에서 신입 학회원을 모집합니다! ...",
      years: ["1학년", "2학년"],
      departments: ["콘텐츠디자인융합학부"],
      keywords: ["포트폴리오필수", "2학기필수"],
      posterPaths: ["https://firebasestorage.googleapis.com/v0/b/…"],
    };
    console.log(nPost);
    createPostMutate(newPost as any);
  };

  // const Grades = [
  //   "23학번 새내기",
  //   "1학년",
  //   "2학년",
  //   "3학년",
  //   "4학년",
  //   "9학기 이상",
  // ];
  const Majors = [
    // {"상관없음":[]},
    { 경영경제학부: ["경영학", "경제학", "GM"] },
    { 상당심리사회복지학부: ["상담심리학", "사회복지학"] },
    { 생명과학부: ["생명과학부"] },
    { 전산전자공학부: ["AI", "컴퓨터공학", "전자공학"] },
    { ICT창업학부: ["GE", "ICT융합", "ACE"] },
    { 커뮤니케이션학부: ["언론정보학", "공연영상학"] },
    { 기계제어공학부: ["기계공학", "전자제어공학"] },
    { 국제어문학부: ["국제지역학", "영어"] },
    { 법학부: ["한국법", "UIL"] },
    { 공간환경시스템공학부: ["건설공학", "도시환경공학"] },
    { 콘텐츠융합디자인학부: ["시각디자인", "제품디자인"] },
  ];

  const Categories = [
    "동아리",
    "프로젝트",
    "학회",
    "학술모임",
    "공모전/대회",
    "운동/게임/취미",
    "전공 스터디",
    "기타 모임",
  ];

  // const [visible, setVisible] = useState<Boolean[]>(
  //   Array.from({ length: Majors.length }, () => false)
  // );

  // useState로 상태관리하기 초기값은 EditorState.createEmpty()
  // EditorState의 비어있는 ContentState 기본 구성으로 새 개체를 반환 => 이렇게 안하면 상태 값을 나중에 변경할 수 없음.

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState: any) => {
    // editorState에 값 설정
    setEditorState(editorState);
  };

  // const [gradeToggle, setGradeToggle] = useState<boolean>(false);
  // const [majorToggle, setMajorToggle] = useState<boolean>(false);
  const [postExampleToggle, setPostExampleToggle] = useState<boolean>(false);
  const [registerToggle, setRegisterToggle] = useState<boolean>(false);

  const textareaResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const targetId = e.currentTarget.id;
    const targetValue = e.currentTarget.value;

    if (targetId === "summary" && targetValue.split("\n").length > 2) {
      let modifiedText = targetValue.split("\n").slice(0, 2);
      e.currentTarget.value = modifiedText.join("\n");
      return;
    } else if (
      targetId === "registerMethod" &&
      targetValue.split("\n").length > 5
    ) {
      let modifiedText = targetValue.split("\n").slice(0, 5);
      e.currentTarget.value = modifiedText.join("\n");
      return;
    }

    e.currentTarget.style.height = "10px";
    e.currentTarget.style.height = 12 + e.currentTarget.scrollHeight + "px";
  };
  const [optionalFoldToggle, setOptionalFoldToggle] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);

  const optionalFoldText = [
    {
      first: "",
      accent: "지원 자격, 인원, 활동 기간",
      last: "등 모임에 관한 추가적인 정보도 알려주세요!",
    },
    { first: "검색에 잘 걸리도록 ", accent: "검색 키워드 추가", last: "하기!" },
    {
      first: "모임 목적, 활동 내용 등 자세한 ",
      accent: "내용 작성",
      last: "을 해보세요",
    },
    { first: "", accent: "포스터", last: "가 있다면 업로드 해주세요!" },
  ];

  const duration = [
    "미설정",
    "봄학기",
    "가을학기",
    "여름방학",
    "겨울방학",
    "1년",
    "1학기",
    "2학기",
    "3학기",
    "4학기",
    "직접 입력",
  ];

  const inputTextVariants = {
    focused: {},
    unfocused: {
      borderBottom: "1px solid lightgray",
    },
  };

  const presenseVariant = {
    initial: {
      scale: 0.5,
    },
    showing: {
      scale: 1,
    },
    exit: {
      scale: 0,
    },
  };

  return (
    <div className="p-[50px]">
      <div className="flex justify-between pb-[20px]">
        <span className="flex w-[210px] items-center justify-between">
          <Link to="/post">
            <div className="">
              <i className="fa-solid fa-arrow-left-long text-[20px]"></i>
            </div>
          </Link>
          <p className="md:text-[25px] text-[20px] font-unique">
            모집글 작성하기
          </p>
        </span>
        {/* <div className="flex justify-between items-center">
                    
                    <div className="flex h-[40px] items-end">
                    {[ "radial-gradient(closest-side, #7b87e7, rgba(235, 235, 235, 0.13) 100%)" ,"radial-gradient(closest-side, #e3a3ff, rgba(235, 235, 235, 0.13) 100%)" , "radial-gradient(closest-side, #9c9c9c, rgba(235, 235, 235, 0.13) 100%)"].map((color,index) => (
                        <div key={index}
                        className="w-[15px] h-[15px]"
                        style={{
                        backgroundImage: color,
                        }}
                    />
                    ))}
                    </div>
                    </div> */}
      </div>

      <form onSubmit={handleSubmit(onSubmit as any)} className="px-[20px]">
        <div className="bg-slate-100 p-[50px] rounded-3xl mb-[50px]">
          <div className="flex justify-between w-full relative">
            <p className="text-[20px] font-main">
              썸네일을 보고 무슨 모집글인지 알기 쉽도록 만들어주세요!
            </p>

            {!postExampleToggle && (
              <button
                type="button"
                className={`bg-white py-[5px] text-[16px] px-[15px] border-2 border-blue-500 text-blue-500 rounded-lg`}
                onClick={(e) => setPostExampleToggle(true)}
              >
                다른 모집글은 어떻게 작성되었는지 살펴보세요!
              </button>
            )}

            <AnimatePresence>
              {postExampleToggle && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "linear" }}
                  className="origin-top-right w-[600px] rounded-xl overflow-hidden absolute right-0"
                >
                  <div className="w-[600px] h-[50px] flex px-[20px] justify-between items-center bg-white">
                    <p>다른 모집글은 어떻게 작성되었는지 살펴보세요!</p>
                    <button
                      type="button"
                      onClick={() => setPostExampleToggle(false)}
                    >
                      닫기
                    </button>
                  </div>
                  <motion.div className="w-600px h-[300px] bg-gray-200 flex items-center overflow-scroll">
                    {postExampleToggle &&
                      (
                        PostExamples[
                          getValues("postTypes").length === 0
                            ? "선택안됨"
                            : getValues("postTypes")[0]
                        ] as IPostExample[]
                      )?.map((postExample: IPostExample, index: number) => (
                        <Thumbnail {...postExample} key={index} />
                      ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* <p className="flex justify-end text-[#0000ff] ">
                        필수 작성란입니다.
                    </p> */}
          </div>
          {/* <p className="mt-[10px]">
            썸네일을 보고 무슨 모집글인지 알기 쉽도록 만들어주세요!
          </p> */}

          <div className="w-full h-[400px] flex items-center justify-between my-[20px] ">
            <div className="w-[400px] border h-[350px] bg-white p-[30px] rounded-2xl shadow-sm">
              <div className="mb-[10px]">
                <span className="flex items-center justify-between mb-[20px]">
                  <span className="flex items-center">
                    {/* <input className="w-[70px] px-[10px] rounded-full mr-[20px]" placeholder="일정 입력"/> */}
                    {/* <input className="w-[70px] px-[5px] rounded-full " placeholder="모집유형1"/> */}
                    <span className="px-[10px] rounded-full bg-gray-200 font-light">
                      {/* {getValues("durationIndex") === "0" ? 
                                        "상시 모집"
                                 : new Date(getValues("recruitStart")!) > new Date() ?
                                 "모집 예정" :
                                 getValues("recruitEnd")==="" ?
                                 "상시 모집"
                                 :dateDifference(getValues("recruitEnd")!) === 0 ?
                                 "오늘 마감"

                                  : "D-"+ dateDifference(getValues("recruitEnd")! )} */}

                      {convertDateToString(
                        getValues("recruitStart"),
                        getValues("recruitEnd")
                      )}
                    </span>
                    <Soon
                      bgColor="bg-gray-200"
                      recruitStart={new Date()}
                      recruitEnd={getValues("recruitEnd")}
                      closed={false}
                    />
                  </span>
                  <i className="fa-regular fa-heart text-[23px] text-gray-400"></i>
                </span>

                <input
                  className="w-[340px] text-[19px] py-[5px] px-[15px] mb-[10px] border-b-2"
                  {...register("title")}
                  type="text"
                  placeholder="제목을 입력해주세요"
                />
                <div className="h-[70px]">
                  <div className="w-full">
                    <textarea
                      wrap="off"
                      id="summary"
                      onKeyPress={textareaResize}
                      onKeyUp={textareaResize}
                      className="notes w-[350px] text-[15px] px-[15px]"
                      {...register("summary")}
                      placeholder="(선택) 두줄 이내의 간결한 모임 설명글을 적어주세요"
                    />
                  </div>
                  {/* <p className="text-gray-500 text-[13px] float-right">
                    {" "}
                    {getValues("summary").length} / 40
                  </p> */}
                </div>
              </div>

              <div className="flex items-center">
                <AnimatePresence>
                  {getValues("postTypes").length !== 0 &&
                    getValues("postTypes").map(
                      (category: string, index: number) => (
                        <ThumbnailCategoryButton
                          key={index}
                          variants={presenseVariant}
                          initial="initial"
                          animate="showing"
                          exit="exit"
                        >
                          {category === "기타 모임"
                            ? getValues("categoryETC")
                            : category}
                        </ThumbnailCategoryButton>
                      )
                    )}
                </AnimatePresence>
              </div>
              {[
                { array: "first", str: "firstKeyword" },
                { array: "second", str: "secondKeyword" },
              ].map((lineObj, LineIndex) => (
                <div key={LineIndex} className="flex mb-[10px] items-center">
                  {/* firstLine Keyword */}
                  <AnimatePresence>
                    {getValues(lineObj.array as any)?.map(
                      (keyword: string, keywordIndex: number) => (
                        <ThumbnailKeywordsButton
                          key={keywordIndex}
                          variants={presenseVariant}
                          initial="initial"
                          animate="showing"
                          exit="exit"
                        >
                          {keyword}
                          <i
                            className="fa-solid fa-xmark ml-[5px]"
                            onClick={(e) => {
                              // first , second keywords 구분하여 삭제
                              console.log(LineIndex);

                              let v: any;
                              if (LineIndex === 0) v = "first";
                              else v = "second";

                              const gv = getValues(v) as any;

                              setValue(v, [
                                ...gv.slice(0, keywordIndex),
                                ...gv.slice(keywordIndex + 1),
                              ]);
                            }}
                          ></i>
                        </ThumbnailKeywordsButton>
                      )
                    )}
                  </AnimatePresence>

                  {getValues(lineObj.array as any).length < 3 && (
                    <>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          className={`KeywordInput py-[2px] text-[15px] px-[15px] rounded-full ${LightMainBLUE}`}
                          style={{
                            width:
                              (getValues(lineObj.str as any).length + 5) * 11,
                          }}
                          {...register(lineObj.str as any)}
                          onKeyPress={async (
                            e: React.KeyboardEvent<HTMLInputElement>
                          ) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (getValues(lineObj.str as any) === "") return;
                              setValue(
                                lineObj.array as any,
                                (await [
                                  ...getValues(lineObj.array as any),
                                  getValues(lineObj.str as any),
                                ]) as never
                              );
                              setValue(lineObj.str as any, "");
                            }
                          }}
                          onBlur={async () => {
                            if (getValues(lineObj.str as any) !== "") {
                              setValue(
                                lineObj.array as any,
                                (await [
                                  ...getValues(lineObj.array as any),
                                  getValues(lineObj.str as any),
                                ]) as never
                              );
                              setValue(lineObj.str as any, "");
                            }
                          }}
                        />

                        <button
                          type="button"
                          onClick={async () => {
                            if (getValues(lineObj.str as any) === "") return;
                            setValue(
                              lineObj.array as any,
                              (await [
                                ...getValues(lineObj.array as any),
                                getValues(lineObj.str as any),
                              ]) as never
                            );
                            setValue(lineObj.str as any, "");
                          }}
                          className={`absolute right-0 px-[10px] ml-[5px] rounded-full text-blue-500`}
                        >
                          {" "}
                          +{" "}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {/* <div className=" mb-[10px]">
                        <input type="text" className="px-[5px] w-[100px]" placeholder="키워드 입력"/>
                        </div>
                        <div className=" mb-[10px]">
                        <input type="text" className="px-[5px] w-[100px]" placeholder="키워드 입력"/>
                        </div> */}
            </div>

            <div className="w-[300px] h-[350px] px-[40px] py-[30px]">
              <span>모집 기간</span>

              <span className="pl-[30px] mb-[200px]">
                <span className="mt-[20px] flex items-center mb-[10px]">
                  <p className="mx-[15px] ">시작</p>
                  <input
                    className={`w-[140px] bg-slate-100 text-blue-500`}
                    type="date"
                    {...register("recruitStart")}
                  />
                </span>

                <span className="flex items-center">
                  <p className="mx-[15px] ">마감</p>
                  <input
                    type="date"
                    className="w-[140px] bg-slate-100 text-blue-500"
                    {...register("recruitEnd")}
                  />
                </span>
                <button
                  type="button"
                  className={` ${FunctionBUTTON} ml-[100px] mt-[20px] `}
                  onClick={() => setValue("recruitEnd", "")}
                >
                  상시 모집
                </button>
              </span>
            </div>

            <div className="w-[600px] h-[350px] px-[40px] py-[30px]">
              <span className="flex items-center">
                모임 유형(카테고리){" "}
                <span className="text-[13px] ml-[20px]">
                  <span className="text-blue-600 font-bold">최대 2개</span> 선택
                  가능
                </span>
              </span>

              <div className="flex">
                <div className="grid grid-cols-2 w-[330px]">
                  {Categories.map((category, index) => (
                    <span key={index} className="flex items-center mt-[20px]">
                      {/* <input {...register("postTypes")} value={category} type="checkBox" className="mx-[10px]" /> */}
                      {/* <p>{category}</p> */}
                      <button
                        type="button"
                        className={`${
                          getValues("postTypes")?.includes(category as never)
                            ? MajorSeletedBUTTON
                            : UnSelectedBUTTON
                        } px-[15px] py-[8px] rounded-lg w-[135px]`}
                        onClick={async () => {
                          const gv = getValues("postTypes");
                          const gvIdx = gv.indexOf(category as never);
                          if (
                            !gv.includes(category as never) &&
                            gv.length < 2
                          ) {
                            await setValue("postTypes", [
                              ...gv,
                              category as never,
                            ]);
                            if (category === "기타 모임") {
                              document.getElementById("categoryETC")?.focus();
                            }
                          } else if (
                            gv.includes(category as never) &&
                            gv.length <= 2
                          ) {
                            setValue("postTypes", [
                              ...gv.slice(0, gvIdx),
                              ...gv.slice(gvIdx + 1),
                            ]);
                            // 기타모임 포함 x
                          }
                        }}
                      >
                        {category}
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex flex-col justify-end">
                  {getValues("postTypes").includes("기타 모임" as never) && (
                    <input
                      {...register("categoryETC")}
                      type="text"
                      id="categoryETC"
                      className="border-b-2 h-[35px] border-gray-400 w-full px-[10px] bg-slate-100"
                      placeholder="모집 유형을 입력해주세요"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* <p className="text-[20px] font-main">모집글 필수 내용</p> */}
            <p className="mt-[10px]">지원에 필요한 정보를 채워주세요!</p>
            <div className="flex items-center w-full justify-between">
              {/* <div className="w-[600px] mt-[20px] mr-[100px]"> */}
              <div className="flex items-start w-[45%]">
                <div className="w-[130px] mt-[8px]">신청 경로</div>
                <div className="w-full">
                  <input
                    // onFocus={{

                    // }}
                    type="text"
                    className="w-full border-b border-gray-300 h-[40px] px-[10px] bg-slate-100"
                    placeholder="신청 받을 연락처/사이트/구글폼/각종 링크를 적어주세요."
                    {...register("contact")}
                  />
                </div>
              </div>
              <span className="flex mt-[10px] items-start w-[45%]">
                <p className="w-[200px]">신청 방법 (선택)</p>
                <div className="w-full">
                  <textarea
                    wrap="off"
                    id="registerMethod"
                    onKeyPress={textareaResize}
                    onKeyUp={textareaResize}
                    className="notes_slate px-[10px] vertical-center w-full "
                    placeholder="(선택) 신청 방법이 따로 있다면 설명해주세요."
                    {...register("contactDetails")}
                  />
                </div>
              </span>
              {/* </div> */}
            </div>
          </div>
        </div>

        <div className="mb-[30px] px-[10px] text-blue-600">
          * 아래는 전부 선택 사항입니다. 필요하다고 생각 하는 부분을 추가적으로
          작성 해주세요
        </div>
        {/* 선택 옵션 접었을 때 */}

        {!optionalFoldToggle[0] && (
          <motion.div
            initial={{
              height: "300px",
            }}
            animate={{
              height: "80px",
            }}
            transition={{
              type: "linear",
            }}
            onClick={() =>
              setOptionalFoldToggle((prev) => [true, ...prev.slice(1)])
            }
            className="flex  items-center w-full px-[50px] py-[20px] bg-gray-100 text-[18px] rounded-lg mb-[30px]"
          >
            {optionalFoldText[0].first} &nbsp;{" "}
            <span className={`text-blue-500`}>
              {optionalFoldText[0].accent}
            </span>
            &nbsp;{optionalFoldText[0].last}
            <i className="fa-solid fa-caret-down ml-[10px] text-[25px]"></i>
            {getValues("departments").length === 0 ? (
              <div className={`ml-[30px] ${FunctionBUTTON}`}>전공 무관</div>
            ) : (
              getValues("departments").map((department) => (
                <div className={`ml-[30px] ${FunctionBUTTON}`}>
                  {department}
                </div>
              ))
            )}
            {getValues("years").length === 0 ? (
              <div className={`ml-[30px] ${FunctionBUTTON}`}>학년 무관</div>
            ) : (
              getValues("years").map((year) => (
                <div className={`ml-[30px] ${FunctionBUTTON}`}>{year}</div>
              ))
            )}
          </motion.div>
        )}
        {optionalFoldToggle[0] && (
          <motion.div
            initial={{ y: 0, scaleY: 0.5 }}
            animate={{ y: 0, scaleY: 1 }}
            transition={{
              type: "linear",
            }}
            className="origin-top relative bg-gray-100 rounded-3xl p-[50px] mb-[30px]"
          >
            <i
              className="fa-solid fa-caret-up absolute right-[50px] ml-[10px] text-[25px]"
              onClick={() =>
                setOptionalFoldToggle((prev) => [false, ...prev.slice(1)])
              }
            ></i>
            <p className="text-[20px] font-main">모집 대상 조건 설정하기</p>
            <p className="mt-[10px]">
              모집글들을 필터링할 때 쓰이는 정보이니 채워주시면 좋습니다.
            </p>

            <div className="w-full">
              <div className="flex">
                {/* 학년 중복선택  */}
                <div className="py-[20px] flex w-full justify-between items-center ">
                  <Grade getValues={getValues} setValue={setValue} />

                  {/* 지원 자격 */}

                  <div className="mt-[20px] w-[40%]">
                    <p className="mb-[10px] text-[18px] ">지원 자격</p>
                    <div className="flex">
                      <textarea
                        wrap="off"
                        id="registerMethod"
                        onKeyPress={textareaResize}
                        onKeyUp={textareaResize}
                        className="notes_gray w-full px-[10px]"
                        placeholder="지원자가 갖춰야 할 역량에 대해 자유롭게 작성해주세요."
                        {...register("qualifications")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Department getValues={getValues} setValue={setValue} />
            </div>

            <div className="my-[20px] flex w-[full] items-center justify-between mt-[40px]">
              <People
                getValues={getValues}
                setValue={setValue}
                register={register}
              />
              <Duration
                getValues={getValues}
                setValue={setValue}
                register={register}
              />
            </div>
          </motion.div>
        )}

        {!optionalFoldToggle[1] && (
          <motion.div
            initial={{
              height: "300px",
            }}
            animate={{
              height: "80px",
            }}
            transition={{
              type: "linear",
            }}
            onClick={() =>
              setOptionalFoldToggle((prev) => [prev[0], true, ...prev.slice(2)])
            }
            className="flex items-center w-full px-[50px] py-[20px] bg-gray-100 text-[18px] rounded-lg mb-[30px]"
          >
            {optionalFoldText[1].first} &nbsp;{" "}
            <span className={`text-blue-500`}>
              {optionalFoldText[1].accent}
            </span>
            &nbsp;{optionalFoldText[1].last}
            <i className="fa-solid fa-caret-down ml-[10px] text-[25px]"></i>
          </motion.div>
        )}

        {optionalFoldToggle[1] && (
          <motion.div
            initial={{ y: 0, scaleY: 0.5 }}
            animate={{ y: 0, scaleY: 1 }}
            transition={{
              type: "linear",
            }}
            className="origin-top relative bg-gray-100 rounded-3xl p-[50px] mb-[30px]"
          >
            <i
              className="fa-solid fa-caret-up absolute right-[50px] ml-[10px] text-[25px]"
              onClick={() =>
                setOptionalFoldToggle((prev) => [
                  prev[0],
                  false,
                  ...prev.slice(2),
                ])
              }
            ></i>

            <Keywords
              getValues={getValues}
              setValue={setValue}
              register={register}
            />
          </motion.div>
        )}

        {!optionalFoldToggle[2] && (
          <motion.div
            initial={{
              height: "300px",
            }}
            animate={{
              height: "80px",
            }}
            transition={{
              type: "linear",
            }}
            onClick={() =>
              setOptionalFoldToggle((prev) => [
                ...prev.slice(0, 2),
                true,
                prev[3],
              ])
            }
            className="flex items-center w-full px-[50px] py-[20px] bg-gray-100 text-[18px] rounded-lg mb-[30px]"
          >
            {optionalFoldText[2].first} &nbsp;{" "}
            <span className={`text-blue-500`}>
              {optionalFoldText[2].accent}
            </span>
            &nbsp;{optionalFoldText[2].last}
            <i className="fa-solid fa-caret-down ml-[10px] text-[25px]"></i>
          </motion.div>
        )}

        {optionalFoldToggle[2] && (
          <motion.div
            initial={{ y: 0, scaleY: 0.5 }}
            animate={{ y: 0, scaleY: 1 }}
            transition={{
              type: "linear",
            }}
            className="relative origin-top bg-gray-100 rounded-3xl p-[50px] mb-[30px]"
          >
            <i
              className="fa-solid fa-caret-up absolute right-[50px] ml-[10px] text-[25px]"
              onClick={() =>
                setOptionalFoldToggle((prev) => [
                  ...prev.slice(0, 2),
                  false,
                  prev[3],
                ])
              }
            ></i>
            <p className="text-[20px] font-main">자유 내용 입력</p>
            <p className="mt-[10px] mb-[20px]">
              모임의 목적,활동 내용 등에 대한 자세한 내용을 자유롭게
              작성해주세요!
            </p>
            <MyBlock>
              <Editor
                // 에디터와 툴바 모두에 적용되는 클래스
                wrapperClassName="wrapper-class"
                // 에디터 주변에 적용된 클래스
                editorClassName="editor"
                // 툴바 주위에 적용된 클래스
                toolbarClassName="toolbar-class"
                // 툴바 설정
                toolbar={{
                  // inDropdown: 해당 항목과 관련된 항목을 드롭다운으로 나타낼것인지
                  list: { inDropdown: true },
                  textAlign: { inDropdown: true },
                  link: { inDropdown: true },
                  history: { inDropdown: false },
                  blockType: {
                    inDropdown: true,
                    options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"],
                    // 기본값은 'Normal'입니다.
                  },
                }}
                placeholder="내용을 작성해주세요."
                // 한국어 설정
                localization={{
                  locale: "ko",
                }}
                // 초기값 설정
                editorState={editorState}
                // 에디터의 값이 변경될 때마다 onEditorStateChange 호출
                onEditorStateChange={onEditorStateChange}
              />
            </MyBlock>
          </motion.div>
        )}

        {!optionalFoldToggle[3] && (
          <motion.div
            initial={{
              height: "300px",
            }}
            animate={{
              height: "80px",
            }}
            transition={{
              type: "linear",
            }}
            onClick={() =>
              setOptionalFoldToggle((prev) => [...prev.slice(0, 3), true])
            }
            className="flex items-center w-full px-[50px] py-[20px] bg-gray-100 text-[18px] rounded-lg mb-[30px]"
          >
            {optionalFoldText[3].first} &nbsp;{" "}
            <span className={`text-blue-500`}>
              {optionalFoldText[3].accent}
            </span>
            &nbsp;{optionalFoldText[3].last}
            <i
              className="fa-solid fa-caret-down ml-[10px] text-[25px]"
              // onClick={() =>
              //   setOptionalFoldToggle((prev) => [...prev.slice(0, 3), true])
              // }
            ></i>
          </motion.div>
        )}

        {/* 포스터 등록 */}
        {optionalFoldToggle[3] && (
          <motion.div
            initial={{ y: 0, scaleY: 0.5 }}
            animate={{ y: 0, scaleY: 1 }}
            transition={{
              type: "linear",
            }}
            className="origin-top relative bg-gray-100 rounded-3xl p-[50px] mb-[30px]"
          >
            <i
              className="fa-solid fa-caret-up absolute right-[50px] ml-[10px] text-[25px]"
              onClick={() =>
                setOptionalFoldToggle((prev) => [...prev.slice(0, 3), false])
              }
            ></i>
            {/* <div> */}
            <p className="text-[20px] font-main">포스터 등록</p>
            <p className="mt-[10px]">
              포스터가 있다면 업로드해주세요! 모집글 페이지 및 포스터 모아보기
              페이지에서 보여집니다.
            </p>

            {/* 포스터 업로드 부분 */}
            <ImageUpload
              imageURLList={imageURLList}
              setImageURLList={setImageURLList}
            />
          </motion.div>
        )}
        <div className="flex justify-center mt-[50px]">
          <button
            type="submit"
            className="text-white bg-blue-500  text-[18px] px-[20px] py-[8px] rounded-lg"
          >
            {" "}
            모집글 등록하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostAddForm2;
