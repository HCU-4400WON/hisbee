import { async } from "@firebase/util";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import "./textarea.css";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import styled from "styled-components";

import {
  ref,
  getDownloadURL,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../firebase";
import { get } from "http";
import Thumbnail from "./Thumbnail";
import {
  convertDateToString,
  converter,
  IPostExample,
  PostExamples,
} from "./PostExamples";

const MyBlock = styled.div`
  background-color: white;
  .wrapper-class {
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

const MainBLUE = "bg-blue-200";
const LightMainBLUE = "bg-blue-100";

const FunctionBUTTON = `${LightMainBLUE} text-blue-600 rounded-lg px-[15px] py-[8px]`;
const DetailSelectedBUTTON = `border-2 border-blue-300 ${LightMainBLUE} px-[15px] py-[8px] rounded-lg`;
const DetailUnSelectedBUTTON = `${LightMainBLUE} px-[15px] py-[8px] rounded-lg`;

const MajorSeletedBUTTON = `border-2 border-blue-300 ${MainBLUE} px-[15px] py-[8px] rounded-lg`;
const MajorUnSelectedBUTTON = `${MainBLUE} px-[15px] py-[8px] rounded-lg`;
const UnSelectedBUTTON = `bg-gray-200 text-gray-400 px-[15px] py-[8px] rounded-lg`;

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
      categories: [],
      //   durationIndex: "0",
      postStart: converter("year", new Date()),
      postEnd: converter("year", new Date()),
      title: "",
      subTitle: "",
      keywordsFirstLine: [],
      keywordsSecondLine: [],
      // keywordsThirdLine : [],
      position: "",
      positionNum: "",
      grades: [],
      majors: [],
      keyword: "",
      firstKeyword: "",
      secondKeyword: "",
      positionToggle: false,
      total: "",
      // poster : "",
    },
  });

  watch([
    "categories",
    // "durationIndex",
    "postStart",
    "postEnd",
    "position",
    "positionNum",
    "keyword",
    "keywordsFirstLine",
    "keywordsSecondLine",
    "positionToggle",
    "grades",
  ]);

  interface IPositionList {
    position: string;
    positionNum: number;
  }

  const [positionList, setPositionList] = useState<IPositionList[] | []>([]);

  // const categoriesWatch = watch("categories");
  // https://dotorimook.github.io/post/2020-10-05-rhf-watch-vs-getvalues/

  const onSubmit = () => {
    console.log(getValues("grades"));
    console.log(getValues("majors"));
    console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    console.log(imageURL);
  };

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

  // const onClick = (e : React.FormEvent<HTMLButtonElement>) => {
  //     const selectedId = e.currentTarget.id;

  // // }
  // const onDelete = (id : number) => {
  //     ;
  // }

  const Grades = [
    "23학번 새내기",
    "1학년",
    "2학년",
    "3학년",
    "4학년",
    "9학기 이상",
  ];
  const Majors = [
    // {"상관없음":[]},
    { 경영경제학부: ["경영학", "경제학", "GM"] },
    { 상당심리사회복지학부: ["상담심리학", "사회복지학"] },
    { 생명과학부: ["생명과학부"] },
    { 전산전자공학부: ["AI 컴퓨터공학심화", "컴퓨터공학", "전자공학심화"] },
    { ICT창업학부: ["GE", "ICT융합", "ACE"] },
    { 커뮤니케이션학부: ["언론정보학", "공연영상학"] },
    { 기계제어공학부: ["기계공학", "전자제어공학"] },
    { 국제어문학부: ["국제지역학", "영어"] },
    { 법학부: ["한국법", "UIL"] },
    { 공간환경시스템공학부: ["건설공학", "도시환경공학"] },
    { 콘텐츠융합디자인학부: ["시각디자인", "제품디자인"] },
  ];

  const [visible, setVisible] = useState<Boolean[]>(
    Array.from({ length: Majors.length }, () => false)
  );

  const [keywords, setKeywords] = useState<string[] | []>([]);

  const [firstKeywords, setFirstKeywords] = useState<string[]>();

  // useState로 상태관리하기 초기값은 EditorState.createEmpty()
  // EditorState의 비어있는 ContentState 기본 구성으로 새 개체를 반환 => 이렇게 안하면 상태 값을 나중에 변경할 수 없음.
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState: any) => {
    // editorState에 값 설정
    setEditorState(editorState);
  };

  // content : draftToHtml(convertToRaw(editorState.getCurrentContent();

  const [imageURL, setImageURL] = useState<string>("");
  const [imageURLList, setImageURLList] = useState<string[] | []>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onUploadImageButtonClick = useCallback(() => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.click();
  }, []);

  const onImageChange = (
    e: React.ChangeEvent<EventTarget & HTMLInputElement>
  ) => {
    e.preventDefault();
    const file = e.target.files;
    if (!file) return null;

    const storageRef = ref(storage, `files/${file[0].name}`);
    const uploadTask = uploadBytesResumable(storageRef, file[0]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // setProgressPercent(progress);
      },
      (error) => {
        switch (error.code) {
          case "storage/canceld":
            alert("Upload has been canceled");
            break;
        }
      },
      () => {
        e.target.value = "";
        getDownloadURL(storageRef).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImageURL(downloadURL);
          setImageURLList((prev) => [...prev, downloadURL]);
          setPosterUploadList((prev) => [...prev.slice(0, prev.length - 1)]);

          //   setValue("poster", downloadURL);

          //   (
          //     document.querySelector("#basicImage") as HTMLElement
          //   ).style.backgroundColor = "white";
          //   (document.querySelector("#basicImage") as HTMLElement).style.color =
          //     "black";
        });
      }
    );
  };

  const [gradeToggle, setGradeToggle] = useState<boolean>(false);
  const [majorToggle, setMajorToggle] = useState<boolean>(false);
  const [postExampleToggle, setPostExampleToggle] = useState<boolean>(false);
  const [registerToggle, setRegisterToggle] = useState<boolean>(false);

  const textareaResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const targetId = e.currentTarget.id;
    const targetValue = e.currentTarget.value;
    if (targetId === "subTitle" && targetValue.split("\n").length > 2) {
      let modifiedText = targetValue.split("\n").slice(0, 2);
      e.currentTarget.value = modifiedText.join("\n");
      return;
    } else if (
      (targetId === "registerMethod" || targetId === "registerDeserve") &&
      targetValue.split("\n").length > 5
    ) {
      let modifiedText = targetValue.split("\n").slice(0, 5);
      e.currentTarget.value = modifiedText.join("\n");
      return;
    }

    if (targetId === "subTitle" || targetId === "registerMethod")
      e.currentTarget.style.height = "50px";
    else e.currentTarget.style.height = "10px";
    e.currentTarget.style.height = 12 + e.currentTarget.scrollHeight + "px";
  };
  const [optionalFoldToggle, setOptionalFoldToggle] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);

  const optionalFoldText = [
    { first: "모집 대상의 ", accent: "지원 조건을 설정하고", last: "싶다면?" },
    { first: "검색에 잘 걸리도록 ", accent: "검색 키워드 추가", last: "하기!" },
    {
      first: "모임 목적, 활동 내용 등 자세한 ",
      accent: "내용 작성",
      last: "을 해보세요",
    },
    { first: "", accent: "포스터", last: "가 있다면 업로드 해주세요!" },
  ];

  const [posterUploadList, setPosterUploadList] = useState<number[]>([0, 1, 2]);

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

      <form onSubmit={handleSubmit(onSubmit)} className="px-[20px]">
        <div className="bg-slate-100 p-[50px] rounded-3xl mb-[50px]">
          <div className="flex justify-between w-full relative">
            <p className="text-[20px] font-main">필수 작성 내용</p>
            {!postExampleToggle && (
              <button
                type="button"
                className={`bg-white py-[5px] text-[16px] px-[15px] border-2 border-blue-500 text-blue-500 rounded-lg`}
                onClick={(e) => setPostExampleToggle(true)}
              >
                다른 모집글은 어떻게 작성되었는지 살펴보세요!
              </button>
            )}
            {postExampleToggle && (
              <div className="w-[600px] rounded-xl overflow-hidden absolute right-0">
                <div className="w-[600px] h-[50px] flex px-[20px] justify-between items-center bg-white">
                  <p>다른 모집글은 어떻게 작성되었는지 살펴보세요!</p>
                  <button onClick={() => setPostExampleToggle(false)}>
                    닫기
                  </button>
                </div>
                <div className="w-600px h-[300px] bg-gray-200 flex items-center overflow-scroll">
                  {postExampleToggle &&
                    (
                      PostExamples[
                        getValues("categories").length === 0
                          ? "선택안됨"
                          : getValues("categories")[0]
                      ] as IPostExample[]
                    )?.map((postExample: IPostExample, index: number) => (
                      <Thumbnail {...postExample} key={index} />
                    ))}
                </div>
              </div>
            )}

            {/* <p className="flex justify-end text-[#0000ff] ">
                        필수 작성란입니다.
                    </p> */}
          </div>
          <p className="mt-[10px]">
            썸네일을 보고 무슨 모집글인지 알기 쉽도록 만들어주세요!
          </p>

          <div className="w-full h-[400px] flex items-center justify-between my-[20px] ">
            <div className="w-[400px] bg-white p-[30px]">
              <div className="mb-[30px]">
                <span className="flex items-center justify-between mb-[20px]">
                  <span className="flex items-center">
                    {/* <input className="w-[70px] px-[10px] rounded-full mr-[20px]" placeholder="일정 입력"/> */}
                    {/* <input className="w-[70px] px-[5px] rounded-full " placeholder="모집유형1"/> */}
                    <span className="px-[10px] rounded-full mr-[20px] bg-gray-200 font-light">
                      {/* {getValues("durationIndex") === "0" ? 
                                        "상시 모집"
                                 : new Date(getValues("postStart")!) > new Date() ?
                                 "모집 예정" :
                                 getValues("postEnd")==="" ?
                                 "상시 모집"
                                 :dateDifference(getValues("postEnd")!) === 0 ?
                                 "오늘 마감"

                                  : "D-"+ dateDifference(getValues("postEnd")! )} */}
                      {/* {getValues("durationIndex") === "0"
                        ? "상시 모집" */}
                      {convertDateToString(
                        getValues("postStart"),
                        getValues("postEnd")
                      )}
                    </span>
                  </span>
                  <i className="fa-regular fa-heart text-[23px] text-gray-400"></i>
                </span>

                <input
                  className="w-[340px] text-[20px] py-[5px] px-[15px] mb-[10px] border-b-2"
                  {...register("title")}
                  type="text"
                  placeholder="제목을 입력해주세요"
                />
                <textarea
                  id="subTitle"
                  onKeyPress={textareaResize}
                  onKeyUp={textareaResize}
                  className="notes w-[340px] text-[15px] px-[15px] pt-[5px] h-[65px]"
                  {...register("subTitle")}
                  placeholder="두줄 이내의 간결한 모임 설명글을 적어주세요"
                />
              </div>
              <div className="flex items-center">
                {getValues("categories").length !== 0 &&
                  getValues("categories").map(
                    (category: string, index: number) => (
                      <div
                        className={` py-[1px] mb-[10px] px-[15px] rounded-full mr-[10px] ${LightMainBLUE}`}
                        key={index}
                      >
                        {category}
                      </div>
                    )
                  )}
              </div>
              {[
                { array: "keywordsFirstLine", str: "firstKeyword" },
                { array: "keywordsSecondLine", str: "secondKeyword" },
              ].map((lineObj, index) => (
                <div key={index} className="flex mb-[10px] items-center">
                  {/* firstLine Keyword */}

                  {getValues(lineObj.array as any)?.map(
                    (keyword: string, index: number) => (
                      <div
                        key={index}
                        className={`text-[15px] px-[15px] py-[1px] rounded-full mr-[10px] ${MainBLUE}`}
                      >
                        {keyword}
                      </div>
                    )
                  )}
                  <input
                    type="text"
                    className={`py-[2px] px-[15px] w-[110px] rounded-full ${MainBLUE}`}
                    {...register(lineObj.str as any)}
                    onKeyPress={async (
                      e: React.KeyboardEvent<HTMLInputElement>
                    ) => {
                      if (e.key === "Enter") {
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
                    placeholder="키워드 입력"
                  />
                  <button
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
                    className={`px-[10px] bg-white ml-[5px] rounded-full ${MainBLUE} text-blue-500`}
                  >
                    {" "}
                    +{" "}
                  </button>
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
              <p>모집 기간</p>

              <span className="pl-[30px]">
                <span className="flex items-center mb-[10px]">
                  <p className="mr-[15px]">시작</p>
                  <input
                    className="w-[140px] px-[5px]"
                    type="date"
                    {...register("postStart")}
                  />
                </span>

                <span className="flex items-center">
                  <p className="mr-[15px]">마감</p>
                  <input
                    type="date"
                    className="w-[140px] px-[5px]"
                    {...register("postEnd")}
                  />
                </span>
                <button
                  className={` ${FunctionBUTTON} ml-[65px] mt-[20px] `}
                  onClick={() => setValue("postEnd", "")}
                >
                  마감일 미설정
                </button>
              </span>
              {/* )} */}
            </div>

            <div className="w-[600px] h-[350px] px-[40px] py-[30px]">
              <span className="flex items-center">
                모임 유형(카테고리){" "}
                <p className="text-[13px] ml-[20px]">최대 2개 선택 가능</p>
              </span>

              <div className="flex">
                <div className="grid grid-cols-2 w-[300px]">
                  {Categories.map((category, index) => (
                    <span key={index} className="flex items-center mt-[20px]">
                      {/* <input {...register("categories")} value={category} type="checkBox" className="mx-[10px]" /> */}
                      {/* <p>{category}</p> */}
                      <button
                        className={`${
                          getValues("categories").includes(category as never)
                            ? MajorSeletedBUTTON
                            : UnSelectedBUTTON
                        } px-[15px] py-[8px] rounded-lg`}
                        onClick={async () => {
                          const gv = getValues("categories");
                          const gvIdx = gv.indexOf(category as never);
                          if (
                            !gv.includes(category as never) &&
                            gv.length < 2
                          ) {
                            await setValue("categories", [
                              ...gv,
                              category as never,
                            ]);
                            if (category === "기타 모임")
                              document.getElementById("categoryETC")?.focus();
                          } else if (
                            gv.includes(category as never) &&
                            gv.length <= 2
                          ) {
                            setValue("categories", [
                              ...gv.slice(0, gvIdx),
                              ...gv.slice(gvIdx + 1),
                            ]);
                          }
                        }}
                      >
                        {category}
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex flex-col justify-end">
                  {getValues("categories").includes("기타 모임" as never) && (
                    <input
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
            <div className="flex">
              <div className="w-[600px] mt-[20px] mr-[100px]">
                <span className="flex items-start">
                  <p className="w-[130px] mt-[8px]">신청 방법</p>
                  <input
                    type="text"
                    className="w-full border-b-2 h-[40px] ml-[20px] px-[10px]"
                    placeholder="신청 받을 연락처/사이트/구글폼/각종 링크를 적어주세요."
                  />
                </span>
                <span className="flex mt-[10px] items-start">
                  <p className="w-[130px] mt-[8px]">신청 안내</p>
                  <textarea
                    id="registerMethod"
                    onKeyPress={textareaResize}
                    onKeyUp={textareaResize}
                    className="notes px-[10px] vertical-center w-full ml-[20px] h-[65px]"
                    placeholder="(선택) 신청 방법이 따로 있다면 설명해주세요."
                  />
                </span>
              </div>
              <div className="w-[400px] mt-[20px]">
                <p>모집 인원</p>

                {getValues("positionToggle") === true ? (
                  <span className="flex mt-[10px] items-center">
                    <div></div>
                    <input
                      className="border-b-2 px-[10px] w-[100px]"
                      {...register("position")}
                      placeholder="포지션"
                      type="text"
                    />
                    <p className="mx-[10px] text-gray-400">:</p>
                    <input
                      className="border-b-2 px-[10px] w-[50px] px-[10px]"
                      {...register("positionNum")}
                      type="number"
                    />
                    <p className="ml-[5px]">명</p>
                    <button
                      onClick={() => setValue("positionToggle", false)}
                      className="ml-[20px] bg-blue-100 text-blue-400 rounded-lg px-[15px] py-[5px]"
                    >
                      인원만 입력하기
                    </button>
                  </span>
                ) : (
                  <span className="flex mt-[10px] items-center">
                    <input
                      className="border-b-2 px-[10px] w-[80px]"
                      {...register("total")}
                      type="number"
                      placeholder="(선택)"
                    />
                    <p className="ml-[5px]">명</p>
                    <button
                      onClick={() => setValue("positionToggle", true)}
                      className={`ml-[20px] ${FunctionBUTTON}`}
                    >
                      포지션: 인원으로 입력하기
                    </button>
                  </span>
                )}

                {getValues("positionToggle") === true &&
                  positionList.length > 0 &&
                  positionList?.map((elem, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-2 border-blue-500 rounded-lg py-[2px] px-[10px] w-[200px] lg:w-[300px] xl:w-[343px] text-blue-500 my-[20px]"
                    >
                      <i className="fa-solid fa-link"></i>
                      <p>{elem.position}</p>
                      {/* <p>{elem.positionNum}명</p> */}
                      <span className="flex items-center ">
                        <span
                          onClick={() => {
                            const newElem = {
                              position: elem.position,
                              positionNum: elem.positionNum + 1,
                            };
                            setPositionList((prev) => [
                              ...prev.slice(0, index),
                              newElem,
                              ...prev.slice(index + 1),
                            ]);
                          }}
                        >
                          +
                        </span>
                        <p className="mx-[10px]">{elem.positionNum}명</p>
                        <span
                          onClick={() => {
                            const newElem = {
                              position: elem.position,
                              positionNum: elem.positionNum - 1,
                            };
                            setPositionList((prev) => [
                              ...prev.slice(0, index),
                              newElem,
                              ...prev.slice(index + 1),
                            ]);
                          }}
                        >
                          -
                        </span>
                      </span>
                      <i
                        className="fa-regular fa-trash-can"
                        onClick={() =>
                          setPositionList((prev) => [
                            ...prev.slice(0, index),
                            ...prev.slice(index + 1),
                          ])
                        }
                      ></i>
                    </div>
                  ))}
                {getValues("positionToggle") === true && (
                  <button
                    className="flex items-center justify-center text-[25px] w-[27px] h-[27px] rounded-lg bg-blue-100 text-blue-400 mt-[20px]"
                    onClick={() => {
                      //    if (positionList.find((elem) => elem.position === getValues("position")) || (positionList.find((elem) => elem.position === "아무나") && getValues("position")==="")){

                      //     setValue("position","");
                      //     setValue("positionNum" ,"");
                      //     return;
                      //    }
                      if (getValues("position") !== "") {
                        const newPosition = {
                          position: getValues("position"),
                          positionNum: +getValues("positionNum"),
                        };
                        setPositionList((prev) => [...prev, newPosition]);
                        setValue("position", "");
                        setValue("positionNum", "");
                      }
                    }}
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 선택 옵션 접었을 때 */}

        {!optionalFoldToggle[0] && (
          <div className="flex items-center w-full px-[50px] py-[20px] bg-gray-100 text-[18px] rounded-lg mb-[30px]">
            {optionalFoldText[0].first} &nbsp;{" "}
            <span className={`text-blue-500`}>
              {optionalFoldText[0].accent}
            </span>
            &nbsp;{optionalFoldText[0].last}
            <i
              className="fa-solid fa-caret-down ml-[10px] text-[25px]"
              onClick={() =>
                setOptionalFoldToggle((prev) => [true, ...prev.slice(1)])
              }
            ></i>
          </div>
        )}

        {optionalFoldToggle[0] && (
          <div className="relative bg-gray-100 rounded-3xl p-[50px] mb-[30px]">
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
                {/* {Grades.map((grade,index) => (
                                <span key={index} className="flex items-center mt-[10px]">
                                    <input type="checkBox" {...register("grades")} value={grade} className="mx-[10px]" onClick = {
                                        (e : any) => {
                                            if(index === 0 && e.target.checked){
                                                setValue("grades", [grade as never]);
                                            }
                                            else if( index!== 0 && getValues("grades").includes("상관없음" as never)){
                                                // e.preventDefault();
                                                setValue("grades", [grade as never]);
                                                return;
                                            }
                                        }
                                    } />
                                    <p>{grade}</p>
                                </span>
                            ))} */}

                {/* 학년 중복선택  */}
                <span className="py-[20px]">
                  <span className="flex items-center text-[20px] mb-[10px]">
                    학년{" "}
                    <p className="ml-[10px] text-[15px] text-gray-400">
                      중복 선택 가능
                    </p>
                  </span>

                  <div className="flex">
                    <div className="flex"></div>
                    <button
                      onClick={() => {
                        setGradeToggle(false);
                        setValue("grades", ["상관없음" as never]);
                      }}
                      value="상관없음"
                      className={`border-2 px-[15px] py-[5px] rounded-lg ${
                        !gradeToggle ? MajorSeletedBUTTON : UnSelectedBUTTON
                      }`}
                    >
                      상관 없음
                    </button>

                    {/* <p className="mx-[10px]">학년 선택하기</p> */}
                    {!gradeToggle && (
                      <button
                        className={`border-2 ${
                          gradeToggle ? MajorSeletedBUTTON : UnSelectedBUTTON
                        } px-[15px] py-[5px] rounded-lg ml-[10px]`}
                        onClick={() => {
                          // if(gradeToggle) setValue("grades" , ["상관없음"] as any);
                          setValue("grades", []);
                          setGradeToggle(true);
                          console.log(getValues("grades"));
                        }}
                      >
                        학년 설정
                      </button>
                    )}

                    {gradeToggle && (
                      <>
                        {Grades.map((grade, index) => (
                          <button
                            value={grade}
                            key={index}
                            className={`ml-[10px] px-[15px] py-[5px] rounded-lg ${
                              !gradeToggle
                                ? MajorSeletedBUTTON
                                : MajorUnSelectedBUTTON
                            }`}
                            onClick={(e: any) => {
                              const gV = getValues("grades");
                              const gvIdx = gV.indexOf(grade as never);
                              const btn = e.currentTarget;
                              if (gvIdx === -1) {
                                setValue("grades", [...gV, grade as never]);
                                btn.className = ` px-[15px] py-[5px] rounded-lg ml-[10px] ${MajorSeletedBUTTON}`;
                              } else {
                                setValue("grades", [
                                  ...gV.slice(0, gvIdx),
                                  ...gV.slice(gvIdx + 1),
                                ]);
                                btn.className = `px-[15px] py-[5px] rounded-lg ml-[10px] ${MajorUnSelectedBUTTON}`;
                              }
                            }}
                          >
                            {grade}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </span>
              </div>
              <span className="flex items-center text-[20px] my-[10px]">
                전공{" "}
                <p className="ml-[10px] text-[15px] text-gray-400">
                  중복 선택 가능
                </p>
              </span>
              <div className="flex">
                <span
                  className={`flex items-start mt-[10px] ${
                    majorToggle && "text-gray-400"
                  }`}
                >
                  <button
                    onClick={() => {
                      setMajorToggle(false);
                      setValue("grades", ["상관없음" as never]);
                    }}
                    value="상관없음"
                    className={`border-2 px-[15px] min-w-[120px] py-[5px] rounded-lg ${
                      !majorToggle ? MajorSeletedBUTTON : UnSelectedBUTTON
                    }`}
                  >
                    상관 없음
                  </button>

                  {!majorToggle && (
                    <button
                      className={`border-2 ${UnSelectedBUTTON}  w-[120px] px-[15px] py-[5px] rounded-lg ml-[10px]`}
                      onClick={() => {
                        // if(majorToggle) setValue("majors" , ["상관없음"] as any);
                        setValue("majors", []);
                        setMajorToggle(true);
                      }}
                    >
                      전공 선택
                    </button>
                  )}
                </span>

                <div className="w-full grid grid-cols-2">
                  {majorToggle && (
                    <>
                      {Majors?.map((major, index) => {
                        const key = Object.keys(major)[0];
                        const values = Object.values(major)[0];
                        let clicked = false;
                        return (
                          <div className="flex flex-col">
                            <span
                              key={index}
                              className="flex items-center px-[20px] py-[10px]"
                            >
                              <button
                                key={index}
                                onClick={(e) => {
                                  setVisible((prev) => [
                                    ...prev.slice(0, index),
                                    !prev[index],
                                    ...prev.slice(index + 1),
                                  ]);
                                }}
                                className={`${
                                  visible[index]
                                    ? MajorSeletedBUTTON
                                    : MajorUnSelectedBUTTON
                                } flex items-center px-[15px] py-[5px] rounded-lg ml-[10px]`}
                              >
                                <p>{Object.keys(major)}</p>
                                <i className="fa-solid fa-chevron-right ml-[10px]"></i>
                              </button>

                              {visible[index] &&
                                values.map((value: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="pl-[20px] flex items-center"
                                  >
                                    {/* check point */}
                                    <button
                                      className={`${DetailUnSelectedBUTTON}`}
                                      onClick={(e) => {
                                        const gV = getValues("majors");
                                        const gvIdx = gV.indexOf(
                                          value as never
                                        );
                                        const btn = e.currentTarget;
                                        if (gvIdx === -1) {
                                          setValue("majors", [
                                            ...gV,
                                            value as never,
                                          ]);
                                          btn.className = `px-[15px] py-[5px] rounded-lg ml-[10px] ${DetailSelectedBUTTON}`;
                                        } else {
                                          setValue("majors", [
                                            ...gV.slice(0, gvIdx),
                                            ...gV.slice(gvIdx + 1),
                                          ]);
                                          btn.className = `px-[15px] py-[5px] rounded-lg ml-[10px] ${DetailUnSelectedBUTTON}`;
                                        }
                                      }}
                                    >
                                      {value}
                                    </button>
                                  </span>
                                ))}
                            </span>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 지원 자격 */}

            <div className="mt-[20px] w-[700px]">
              <p className="mb-[10px] text-[18px] ">지원 자격</p>

              {registerToggle ? (
                <div className="flex">
                  <textarea
                    id="registerDeserve"
                    onKeyPress={textareaResize}
                    onKeyUp={textareaResize}
                    className="notes w-full px-[10px]"
                    placeholder="지원자 자격에 대해 자유롭게 작성해주세요."
                  />
                  <button
                    onClick={() => setRegisterToggle(false)}
                    className={`${UnSelectedBUTTON} ml-[20px] w-[80px] h-[40px]`}
                  >
                    접기
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setRegisterToggle(true)}
                  className={`${FunctionBUTTON}`}
                >
                  필드 추가
                </button>
              )}
            </div>
          </div>
        )}

        {!optionalFoldToggle[1] && (
          <div className="flex items-center w-full px-[50px] py-[20px] bg-gray-100 text-[18px] rounded-lg mb-[30px]">
            {optionalFoldText[1].first} &nbsp;{" "}
            <span className={`text-blue-500`}>
              {optionalFoldText[1].accent}
            </span>
            &nbsp;{optionalFoldText[1].last}
            <i
              className="fa-solid fa-caret-down ml-[10px] text-[25px]"
              onClick={() =>
                setOptionalFoldToggle((prev) => [
                  prev[0],
                  true,
                  ...prev.slice(2),
                ])
              }
            ></i>
          </div>
        )}

        {optionalFoldToggle[1] && (
          <div className="relative bg-gray-100 rounded-3xl p-[50px] mb-[30px]">
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

            <p className="text-[20px] font-main">검색 키워드 입력</p>
            <p className="mt-[10px]">모집글과 관련된 키워드를 입력해주세요</p>
            <p className="my-[10px]">키워드</p>
            <div className="flex items-center">
              {["categories", "keywordsFirstLine", "keywordsSecondLine"].map(
                (elem) =>
                  getValues(elem as any)?.map((v: string, index: number) => (
                    <span
                      key={index}
                      className={`flex items-center px-[20px] ${LightMainBLUE} rounded-lg py-[5px] mr-[10px]`}
                    >
                      <p>{v}</p>
                    </span>
                  ))
              )}
              {keywords.map((keyword, index) => (
                <span
                  key={index}
                  className={`flex items-center px-[20px] ${LightMainBLUE} rounded-lg py-[5px] mr-[10px]`}
                >
                  <p className="mr-[10px]">{keyword}</p>
                  <i
                    className="fa-solid fa-xmark mt-[2px] text-gray-400"
                    onClick={() =>
                      setKeywords((prev) => [
                        ...prev.slice(0, index),
                        ...prev.slice(index + 1),
                      ])
                    }
                  ></i>
                </span>
              ))}
            </div>

            <div className="">
              <p className="mr-[20px] my-[10px]">키워드 입력</p>
              <input
                type="text"
                className="w-[300px] border-b-2 h-[40px] px-[10px]"
                placeholder="엔터키로 키워드를 등록하세요"
                onKeyPress={async (e) => {
                  if (e.key === "Enter") {
                    await setKeywords((prev) => [
                      ...prev,
                      getValues("keyword"),
                    ]);
                    setValue("keyword", "");
                  }
                }}
                {...register("keyword")}
              />
            </div>
          </div>
        )}

        {!optionalFoldToggle[2] && (
          <div className="flex items-center w-full px-[50px] py-[20px] bg-gray-100 text-[18px] rounded-lg mb-[30px]">
            {optionalFoldText[2].first} &nbsp;{" "}
            <span className={`text-blue-500`}>
              {optionalFoldText[2].accent}
            </span>
            &nbsp;{optionalFoldText[2].last}
            <i
              className="fa-solid fa-caret-down ml-[10px] text-[25px]"
              onClick={() =>
                setOptionalFoldToggle((prev) => [
                  ...prev.slice(0, 2),
                  true,
                  prev[3],
                ])
              }
            ></i>
          </div>
        )}

        {optionalFoldToggle[2] && (
          <div className="relative bg-gray-100 rounded-3xl p-[50px] mb-[30px]">
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
          </div>
        )}

        {!optionalFoldToggle[3] && (
          <div className="flex items-center w-full px-[50px] py-[20px] bg-gray-100 text-[18px] rounded-lg mb-[30px]">
            {optionalFoldText[3].first} &nbsp;{" "}
            <span className={`text-blue-500`}>
              {optionalFoldText[3].accent}
            </span>
            &nbsp;{optionalFoldText[3].last}
            <i
              className="fa-solid fa-caret-down ml-[10px] text-[25px]"
              onClick={() =>
                setOptionalFoldToggle((prev) => [...prev.slice(0, 3), true])
              }
            ></i>
          </div>
        )}

        {/* 포스터 등록 */}
        {optionalFoldToggle[3] && (
          <div className="relative bg-gray-100 rounded-3xl p-[50px] mb-[30px]">
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

            <input
              className="hidden"
              type="file"
              accept="image/*"
              ref={inputRef}
              onChange={onImageChange}
            />
            {/* <div className=" items-center justify-between flex left-[30px] top-[20px] w-[90%] md:w-[190px]"> */}
            {/* <i className="fa-solid fa-panorama w-[40px]"
                      onClick={onUploadImageButtonClick}
                    ></i> */}

            {/* </div> */}
            <div className="flex">
              {imageURLList?.map((imageUrl: string, index: number) => (
                <div className="relative mt-[30px] mr-[30px]">
                  <img className="w-[400px]" src={imageUrl} key={index} />
                  <button
                    className="absolute right-0 top-0"
                    onClick={() => {
                      setImageURLList((prev) => [
                        ...prev.slice(0, index),
                        ...prev.slice(index + 1),
                      ]);
                      setPosterUploadList((prev) => [...prev, prev.length]);
                    }}
                  >
                    <i className="fa-solid fa-square-xmark text-[30px] text-gray-700 opacity-50"></i>
                  </button>
                </div>
              ))}

              {posterUploadList.map((posterUploadBox, index) => (
                <div
                  key={index}
                  onClick={onUploadImageButtonClick}
                  className="mr-[30px] w-[100px] h-[100px] border border-black mt-[30px] flex justify-center items-center rounded-xl"
                >
                  <i className="fa-solid fa-plus text-black text-[30px] "></i>
                </div>
              ))}
            </div>

            {/* <div className="flex justify-center">
                  {imageURLList.length !== 0 ? (<img className="w-[500px] border-2 mt-[30px]" src={imageURLList[0]}
                    ></img>) : (<div onClick={onUploadImageButtonClick} className="w-[400px] h-[400px] border-2 border-gray-300 mt-[30px] flex justify-center items-center">
                        <i className="fa-solid fa-plus text-gray-300 text-[40px]"></i>
                    </div>)}

                    </div> */}
          </div>
        )}
        <div className="flex justify-center mt-[50px]">
          <button className="text-white bg-blue-600 h-[40px] rounded-lg text-[17px] px-[20px]">
            모집글 등록하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostAddForm2;
