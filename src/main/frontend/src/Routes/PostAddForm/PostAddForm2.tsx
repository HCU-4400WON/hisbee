import tw from "tailwind-styled-components";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import "./css/heading.css";
import "./css/date.css";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { ContentState, EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import styled from "styled-components";

import {
  convertDateToString,
  IPostExample,
  PostExamples,
} from "./components/PostExamples";
import { createPost, ICreatePost, IUpdatePost, updatePost } from "api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useRecoilState } from "recoil";
import { isAlertModalState, isConfirmModalState } from "components/atom";
import Soon from "components/Soon";
import { AnimatePresence, motion } from "framer-motion";
import { ImageUpload } from "./components/ImageUpload";
import { Grade } from "./components/Grade";
import { Department } from "./components/Department";
import { People } from "./components/People";
import { Duration } from "./components/Duration";
import { Keywords } from "./components/Keywords";
import { Helmet } from "react-helmet";
import ConfirmModal from "components/ConfirmModal";
import AlertModal from "components/AlertModal";
import Outline from "components/Outline";
import { TextField } from "@mui/material";
import { useLocation } from "react-router";
import htmlToDraft from "html-to-draftjs";
import { LightMainBLUE, MainBLUE } from "./components/color";
import { dataConverter, stateConverter } from "./components/Converter";
import { IOnSubmitData } from "./interface/Interface";
import GoBackButton from "./components/GoBackButton";
import PostExamplesButton from "./components/PostExamplesButton";
import RequiredThumbnail from "./components/RequiredThumbnail";

const PageTitleRow = tw.div`
  flex gap-[50px] pb-[20px]
`;

const PageTitle = tw.p`
  text-[25px] font-[400]
`;

const MyBlock = styled.div`
  background-color: white;
  .wrapper-class {
    line-height: 1rem;
    margin: 0 auto;
    margin-bottom: 1rem;
    border: 2px solid lightGray !important;
  }
  .editor {
    min-height: 300px !important;
    border-top: 3px solid lightGray !important;
    padding: 10px !important;
    border-radius: 2px !important;
  }
`;

const Form = tw.form`
  px-[20px]
`;

const RequiredBox = tw.div`
bg-slate-100 p-[50px] rounded-3xl mb-[50px]
`;

const RequiredTitleExampleRow = tw.div`
flex justify-between w-full relative h-[40px] mb-[10px]
`;

const RequiredTitle = tw.p`
text-[20px] font-[400]
`;

const RequiredThumbnailDurationCategoryRow = tw.div`
w-full h-[400px] flex items-start justify-between mb-[20px]
`;

const FunctionBUTTON = `${LightMainBLUE} text-blue-600 rounded-lg px-[15px] py-[8px]`;
const MajorSeletedBUTTON = `border-2 border-blue-300 ${MainBLUE} px-[15px] py-[8px] rounded-lg`;
const UnSelectedBUTTON = `bg-gray-200 text-gray-400 px-[15px] py-[8px] rounded-lg border-2 border-gray-200`;

const Categories = [
  // "동아리",
  // "프로젝트",
  // "학회",
  // "학술모임",
  // "공모전/대회",
  // "운동/게임/취미",
  // "전공 스터디",
  // "기타 모임",
  "수업 내 프로젝트",
  "자율 프로젝트",
];

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

function PostAddForm2() {
  const [isGoBackConfirmModal, setIsGoBackConfirmModal] =
    useRecoilState(isConfirmModalState);

  const [optionalFoldToggle, setOptionalFoldToggle] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);

  const navigate = useNavigate();
  const { state } = useLocation();

  const { register, watch, handleSubmit, getValues, setValue, control } =
    useForm({
      mode: "onSubmit",
      defaultValues: {
        title: state ? state?.title : "",
        summary: state ? state?.summary : "",
        first: state ? state?.tags?.first : [],
        second: state ? state?.tags?.second : [],
        postTypes: state ? state?.postTypes : ["수업 내 프로젝트"],
        recruitStart: state
          ? dataConverter("dateTime", state?.recruitStart)
          : dataConverter("year", new Date()), // string
        recruitEnd: state
          ? dataConverter("dateTime", state?.recruitEnd)
          : dataConverter("year", new Date()), // string
        duration: state
          ? stateConverter("duration", state?.duration)
          : "미설정",
        contact: state ? state?.contact : "",
        targetCount: state ? state?.targetCount : "",
        contactDetails: state ? state?.contactDetails : "",
        years: state ? state?.years : [],
        departments: state ? state?.departments : [],
        keyword: "",
        keywords: state ? stateConverter("keywords", state) : [],
        firstKeyword: "",
        secondKeyword: "",
        qualifications: state ? state?.qualifications : "",
        positionToggle: false,
        total: state ? state?.total : "",
        categoryETC: state
          ? stateConverter("categoryETC", state?.postTypes)
          : "",
        durationText: state
          ? stateConverter("durationText", state?.duration)
          : "",
      },
    });

  const checkSubmit = () => {
    if (
      getValues("title").length !== 0 &&
      getValues("recruitStart")?.length === 10 &&
      getValues("postTypes").length !== 0 &&
      getValues("contact").length !== 0
    ) {
      return true;
    }
    return false;
  };

  watch([
    "title",
    "contact",
    "recruitStart",
    "summary",
    "categoryETC",
    "departments",
    "postTypes",
    "duration",
    "targetCount",
    "firstKeyword",
    "secondKeyword",
    "recruitStart",
    "recruitEnd",
    "keyword",
    "first",
    "second",
    "positionToggle",
    "years",
    "keywords",
    "departments",
    "years",
  ]);

  const [isPostSubmitAlertModal, setIsPostSubmitAlertModal] =
    useRecoilState(isAlertModalState);

  const { mutate: createPostMutate } = useMutation(
    ["createPostMutate" as string],

    (newPost: ICreatePost) => createPost(newPost),

    {
      onSuccess: (data) => {
        setIsPostSubmitAlertModal(true);
      },
      onError: (error) => {
        if (((error as AxiosError).response as AxiosResponse).status === 401) {
          alert("로그인이 필요합니다.");
          // setIsLoginModal(true);
          // setIsLogin(false);
          // if (localStorage.getItem("key")) localStorage.removeItem("key");
          // navigate("/");
        }
      },
    }
  );

  const [imageURLList, setImageURLList] = useState<string[] | []>(
    state?.posterPaths
  );

  const onSubmit = (data: IOnSubmitData) => {
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

    const newPost: ICreatePost = {
      title: data?.title,
      summary: data?.summary !== "" ? data?.summary : null,
      tags: {
        first: data?.first?.length === 0 ? [] : data?.first,
        second: data?.second?.length === 0 ? [] : data?.second,
      },
      postTypes: data?.postTypes,
      recruitStart:
        data?.recruitStart === ""
          ? dataConverter("year", new Date())
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
      qualifications:
        data?.qualifications?.length !== 0 ? data?.qualifications : null,
    };

    if (state) {
      if (!window.confirm("모집글을 수정 하시겠습니까?")) return;
      updatePost(state?.id, newPost as IUpdatePost);
      alert("모집글이 수정되었습니다.");
      navigate(-1);
    } else {
      if (!window.confirm("모집글을 등록 하시겠습니까?")) return;
      createPostMutate(newPost as ICreatePost);
    }
  };

  // useState로 상태관리하기 초기값은 EditorState.createEmpty()
  // EditorState의 비어있는 ContentState 기본 구성으로 새 개체를 반환 => 이렇게 안하면 상태 값을 나중에 변경할 수 없음.

  const [editorState, setEditorState] = useState(() => {
    if (!state?.content) return EditorState.createEmpty();
    const contentDraft = htmlToDraft(state?.content);
    const { contentBlocks, entityMap } = contentDraft;
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    );
    return EditorState.createWithContent(contentState);
  });

  const onEditorStateChange = (editorState: any) => {
    // editorState에 값 설정
    setEditorState(editorState);
  };

  const handleConfirmModal = async (event: any) => {
    setIsGoBackConfirmModal(false);
    if (event.currentTarget.id === "yes") {
      navigate("/");
    }
  };

  const handleAlertModal = () => {
    setIsPostSubmitAlertModal(false);
    navigate("/");
  };

  return (
    <Outline>
      <div className="p-[50px] w-[1470px]">
        {isGoBackConfirmModal && (
          <ConfirmModal
            text="정말 글 작성을 취소하시겠습니까?; 작성한 내용이 사라집니다."
            onClick={handleConfirmModal}
          />
        )}

        {isPostSubmitAlertModal && (
          <AlertModal
            text="모집글이 생성되었습니다."
            onClick={handleAlertModal}
          />
        )}
        <Helmet>
          <title>모집 글 작성하기</title>
        </Helmet>

        <PageTitleRow>
          <GoBackButton />
          <PageTitle>{state ? "모집글 수정하기" : "모집글 작성하기"}</PageTitle>
        </PageTitleRow>

        <Form>
          <RequiredBox>
            <RequiredTitleExampleRow>
              <RequiredTitle>
                썸네일을 보고 무슨 모집글인지 알기 쉽도록 만들어주세요!
              </RequiredTitle>

              <PostExamplesButton getValues={getValues} />
            </RequiredTitleExampleRow>

            <RequiredThumbnailDurationCategoryRow>
              <RequiredThumbnail
                getValues={getValues}
                setValue={setValue}
                control={control}
                register={register}
              />
              <div className="w-[400px] h-[350px] px-[60px] py-[30px]">
                <span className="text-[#ff0000]">*</span>
                <span className=""> 모집 기간</span>

                <span className="pl-[30px] mb-[200px]">
                  <span className="mt-[20px] flex items-center mb-[10px]">
                    <p className="mr-[15px] w-[30px]">시작</p>
                    <input
                      className={`w-[140px] bg-slate-100 text-blue-500`}
                      type="date"
                      {...register("recruitStart")}
                    />
                  </span>

                  <span className="flex items-center">
                    <p className="mr-[15px] ">마감</p>
                    <input
                      type="date"
                      className="w-[140px] bg-slate-100 text-blue-500"
                      {...register("recruitEnd")}
                    />
                  </span>
                  <button
                    type="button"
                    className={` ${FunctionBUTTON} float-right mt-[20px] `}
                    onClick={() => setValue("recruitEnd", null)}
                  >
                    상시 모집
                  </button>
                </span>
              </div>

              <div className=" w-[400px] h-[350px] pl-[0px] py-[30px]">
                <span className="flex items-center">
                  <span className="text-[#ff0000]">*</span>
                  모임 유형(카테고리){" "}
                  {/* <span className="text-[13px] ml-[20px]">
                    <span className="text-blue-600 font-bold">최대 1개</span>{" "}
                    선택 가능
                  </span> */}
                </span>

                <div className="flex">
                  <div className="grid grid-cols-2 gap-x-[20px] w-[350px]">
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
                          } px-[15px] py-[8px] rounded-lg w-[150px]`}
                          onClick={
                            (e) => {
                              const gv = getValues("postTypes");
                              if (gv.length === 0) {
                                setValue("postTypes", [category]);
                              } else if (category !== gv[0]) {
                                setValue("postTypes", [category]);
                              }
                            }
                            //   async () => {
                            //   const gv = getValues("postTypes");
                            //   const gvIdx = gv.indexOf(category as never);
                            //   if (
                            //     !gv.includes(category as never) &&
                            //     gv.length < 2
                            //   ) {
                            //     await setValue("postTypes", [
                            //       ...gv,
                            //       category as never,
                            //     ]);
                            //     if (category === "기타 모임") {
                            //       document.getElementById("categoryETC")?.focus();
                            //     }
                            //   } else if (
                            //     gv.includes(category as never) &&
                            //     gv.length <= 2
                            //   ) {
                            //     setValue("postTypes", [
                            //       ...gv.slice(0, gvIdx),
                            //       ...gv.slice(gvIdx + 1),
                            //     ]);
                            //   }
                            // }
                          }
                        >
                          {category}
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end w-[350px] h-[300px]">
                <p className="float-right mt-[20px] text-[17px] text-red-500 mt-[5px] min-w-[100px]">
                  * : 필수 사항
                </p>
                <div className="flex flex-col justify-end">
                  {getValues("postTypes").includes("기타 모임" as never) && (
                    <input
                      {...register("categoryETC")}
                      type="text"
                      id="categoryETC"
                      className="border-b-2 h-[35px]  border-gray-400 w-full bg-slate-100"
                      placeholder="8자 이내 자유 입력"
                      maxLength={8}
                    />
                  )}
                </div>
              </div>
            </RequiredThumbnailDurationCategoryRow>

            <div>
              {/* <p className="text-[20px] font-main">모집글 필수 내용</p> */}
              <p className="my-[20px] font-[400]">
                지원에 필요한 정보를 채워주세요!
              </p>
              <div className="flex items-start w-full justify-between ">
                {/* <div className="w-[600px] mt-[20px] mr-[100px]"> */}
                <div className="relative flex items-center w-[45%]">
                  <span className="text-[#ff0000]">*</span>
                  <div className="w-[130px] flex">신청 경로</div>
                  <div className="relative flex w-full ">
                    <Controller
                      name="contact"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          variant="standard"
                          color="primary"
                          sx={{
                            width: "100%",
                          }}
                          placeholder="신청 받을 연락처/사이트/구글폼/각종 링크를 적어주세요."
                        />
                      )}
                    />
                  </div>
                </div>

                <span className="flex items-start w-[45%]">
                  <p className="w-[130px]">신청 방법</p>
                  <div className="w-full">
                    <Controller
                      name="contactDetails"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          multiline
                          aria-label="minimum height"
                          maxRows={5}
                          placeholder="(선택) 신청 방법이 따로 있다면 설명해주세요."
                          sx={{
                            width: "100%",
                          }}
                          variant="standard"
                        />
                      )}
                    />
                    {/* <textarea
                      wrap="off"
                      id="registerMethod"
                      onKeyPress={textareaResize}
                      onKeyUp={textareaResize}
                      className="notes_slate px-[0px] vertical-center w-full "
                      placeholder="(선택) 신청 방법이 따로 있다면 설명해주세요."
                      {...register("contactDetails")}
                    /> */}
                  </div>
                </span>
                {/* </div> */}
              </div>
            </div>
          </RequiredBox>

          <div className="mb-[30px] px-[10px] text-blue-600">
            * 아래는 전부 선택 사항입니다. 필요하다고 생각 하는 부분을
            추가적으로 작성 해주세요
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
              className="flex  items-center w-full px-[50px] py-[20px] bg-gray-100 text-[18px] rounded-3xl mb-[30px]"
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
                getValues("departments").map((department: string) => (
                  <div className={`ml-[30px] ${FunctionBUTTON}`}>
                    {department}
                  </div>
                ))
              )}
              {getValues("years").length === 0 ? (
                <div className={`ml-[30px] ${FunctionBUTTON}`}>학년 무관</div>
              ) : (
                getValues("years").map((year: string) => (
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
              <p className="text-[20px] font-[400]">모집 대상 조건 설정하기</p>
              <p className="mt-[10px] text-[18px]">
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
                        {/* <textarea
                          wrap="off"
                          id="registerMethod"
                          onKeyPress={textareaResize}
                          onKeyUp={textareaResize}
                          className="notes_gray w-full px-[10px]"
                          placeholder="지원자가 갖춰야 할 역량에 대해 자유롭게 작성해주세요."
                          {...register("qualifications")}
                        /> */}
                        <Controller
                          name="qualifications"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              multiline
                              aria-label="minimum height"
                              maxRows={5}
                              placeholder="지원자가 갖춰야 할 역량에 대해 자유롭게 작성해주세요."
                              sx={{
                                width: "100%",
                              }}
                              variant="standard"
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Department getValues={getValues} setValue={setValue} />
              </div>

              <div className="my-[20px] flex w-[full] items-center justify-between mt-[40px]">
                <People
                  control={control}
                  getValues={getValues}
                  setValue={setValue}
                  register={register}
                />
                <Duration
                  control={control}
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
                setOptionalFoldToggle((prev) => [
                  prev[0],
                  true,
                  ...prev.slice(2),
                ])
              }
              className="flex items-center w-full px-[50px] py-[20px] bg-gray-100 text-[18px] rounded-3xl mb-[30px]"
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
                control={control}
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
              className="flex items-center w-full px-[50px] py-[20px] bg-gray-100 text-[18px] rounded-3xl mb-[30px]"
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
              <p className="text-[20px] font-[400]">자유 내용 입력</p>
              <p className="mt-[10px] mb-[20px] text-[18px]">
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
              className="flex items-center w-full px-[50px] py-[20px] bg-gray-100 text-[18px] rounded-3xl mb-[30px]"
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
              <p className="text-[20px] font-[400]">포스터 등록</p>
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
            {checkSubmit() ? (
              <button
                type="button"
                onClick={handleSubmit(onSubmit as any)}
                className="text-white bg-blue-500  text-[18px] px-[20px] py-[8px] rounded-lg"
              >
                {state ? "모집글 수정하기" : "모집글 등록하기"}
              </button>
            ) : (
              <button
                disabled
                type="button"
                className="text-gray-400 bg-gray-200  text-[18px] px-[20px] py-[8px] rounded-lg"
              >
                {" "}
                {state ? "모집글 수정하기" : "모집글 등록하기"}
              </button>
            )}
          </div>
        </Form>
      </div>
    </Outline>
  );
}

export default PostAddForm2;
