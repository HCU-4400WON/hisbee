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
import GatherDuration from "./components/GatherDuration";
import Category from "./components/PostTypesSelection";
import ApplyLink from "./components/ApplyLink";
import ApplyMethod from "./components/ApplyMethod";
import Qualifications from "./components/Qualifications";
import SubmitButton from "./components/SubmitButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const FoldBlockVariant = {
  initial: {
    height: "300px",
    transition: {
      type: "linear",
    },
  },
  animate: {
    height: "80px",
    transition: {
      type: "linear",
    },
  },
};

const UnFoldBlockVariant = {
  initial: { y: 0, scaleY: 0.5, transition: { type: "linear" } },
  animate: { y: 0, scaleY: 1, transition: { type: "linear" } },
};

const Container = tw.div`p-[50px] w-[1470px] relative`;
const PageTitleRow = tw.div`
  flex gap-[25px] pb-[20px]
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

const ApplyTitle = tw.p`
my-[20px] font-[400]
`;

const ApplyRow = tw.div`
flex items-start w-full justify-between
`;

const SelectionTitle = tw.p`
mb-[30px] px-[10px] text-blue-600
`;

const FoldedBlock = tw(motion.div)`
flex items-center w-full px-[50px] py-[20px] bg-gray-100 text-[18px] rounded-3xl mb-[30px]
`;

const FoldedBlockAccentText = tw.span`
text-blue-500
`;

const OpenButton = tw(KeyboardArrowDownIcon)`
ml-[10px] 
`;

const CloseButton = tw(KeyboardArrowUpIcon)`
absolute right-[50px] ml-[10px]
`;

const UnFoldedBlock = tw(motion.div)`
origin-top relative bg-gray-100 rounded-3xl p-[50px] mb-[30px]
`;

const UnFoldedTitle = tw.p`
text-[20px] font-[400]
`;

const UnFoldedDescription = tw.p`
mt-[10px] mb-[20px] text-[18px]
`;

const FunctionButton = tw.div`
ml-[30px] text-blue-600 rounded-lg px-[15px] py-[8px] bg-blue-100
`;

const FullWidthFlexRow = tw.div`
my-[30px] flex w-full justify-between items-center
`;
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
        postTypes: state ? state?.postTypes : ["공모전/대회/프로젝트"],
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
        positionToggle: state?.targetCount === "" ? false : true,
        total: state ? state?.total : "",
        categoryETC: state
          ? stateConverter("categoryETC", state?.postTypes)
          : "",
        durationText: state
          ? stateConverter("durationText", state?.duration)
          : "",
      },
    });

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
    "keywords",
    "departments",
    "years",
  ]);

  const [isPostSubmitAlertModal, setIsPostSubmitAlertModal] =
    useRecoilState(isAlertModalState);

  const [imageURLList, setImageURLList] = useState<string[] | []>(
    state?.posterPaths
  );

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

  const handleOpenFoldedBlock = (idx: number) => {
    switch (idx) {
      case 0:
        setOptionalFoldToggle((prev) => [true, ...prev.slice(1)]);
        break;
      case 1:
        setOptionalFoldToggle((prev) => [prev[0], true, ...prev.slice(2)]);
        break;
      case 2:
        setOptionalFoldToggle((prev) => [...prev.slice(0, 2), true, prev[3]]);
        break;
      case 3:
        setOptionalFoldToggle((prev) => [...prev.slice(0, 3), true]);
        break;
    }
  };

  const handleCloseUnFoldedBlock = (idx: number) => {
    switch (idx) {
      case 0:
        setOptionalFoldToggle((prev) => [false, ...prev.slice(1)]);
        break;
      case 1:
        setOptionalFoldToggle((prev) => [prev[0], false, ...prev.slice(2)]);
        break;
      case 2:
        setOptionalFoldToggle((prev) => [...prev.slice(0, 2), false, prev[3]]);
        break;
      case 3:
        setOptionalFoldToggle((prev) => [...prev.slice(0, 3), false]);
        break;
    }
  };
  return (
    <Outline>
      <Container>
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
              <GatherDuration register={register} setValue={setValue} />
              <Category getValues={getValues} setValue={setValue} />

              <div className="flex flex-col justify-between items-end w-[350px] h-[300px]">
                <p className="float-right mt-[20px] text-[17px] text-red-500 mt-[5px] min-w-[100px]">
                  * : 필수 사항
                </p>
                {/* <div className="flex flex-col justify-end">
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
                </div> */}
              </div>
            </RequiredThumbnailDurationCategoryRow>

            <ApplyTitle>지원에 필요한 정보를 채워주세요!</ApplyTitle>
            <ApplyRow>
              <ApplyLink control={control} />
              <ApplyMethod control={control} />
            </ApplyRow>
          </RequiredBox>

          <SelectionTitle>
            * 아래는 전부 선택 사항입니다. 필요하다고 생각 하는 부분을
            추가적으로 작성 해주세요
          </SelectionTitle>

          {!optionalFoldToggle[0] && (
            <FoldedBlock
              variants={FoldBlockVariant}
              initial="initial"
              animate="animate"
              onClick={() => handleOpenFoldedBlock(0)}
            >
              {optionalFoldText[0].first} &nbsp;{" "}
              <FoldedBlockAccentText>
                {optionalFoldText[0].accent}
              </FoldedBlockAccentText>
              &nbsp;{optionalFoldText[0].last}
              <OpenButton />
              {getValues("departments").length === 0 ? (
                <FunctionButton>전공 무관</FunctionButton>
              ) : (
                getValues("departments").map((department: string) => (
                  <FunctionButton>{department}</FunctionButton>
                ))
              )}
              {getValues("years").length === 0 ? (
                <FunctionButton>학년 무관</FunctionButton>
              ) : (
                getValues("years").map((year: string) => (
                  <FunctionButton>{year}</FunctionButton>
                ))
              )}
            </FoldedBlock>
          )}
          {optionalFoldToggle[0] && (
            <UnFoldedBlock
              variants={UnFoldBlockVariant}
              initial="initial"
              animate="animate"
            >
              <CloseButton onClick={() => handleCloseUnFoldedBlock(0)} />
              <UnFoldedTitle>모집 대상 조건 설정하기</UnFoldedTitle>
              <UnFoldedDescription>
                모집글들을 필터링할 때 쓰이는 정보이니 채워주시면 좋습니다.
              </UnFoldedDescription>

              <FullWidthFlexRow>
                <Grade getValues={getValues} setValue={setValue} />
                <Qualifications control={control} />
              </FullWidthFlexRow>

              <Department getValues={getValues} setValue={setValue} />

              <FullWidthFlexRow>
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
              </FullWidthFlexRow>
            </UnFoldedBlock>
          )}

          {!optionalFoldToggle[1] && (
            <FoldedBlock
              variants={FoldBlockVariant}
              initial="initial"
              animate="animate"
              onClick={() => handleOpenFoldedBlock(1)}
            >
              {optionalFoldText[1].first} &nbsp;{" "}
              <FoldedBlockAccentText>
                {optionalFoldText[1].accent}
              </FoldedBlockAccentText>
              &nbsp;{optionalFoldText[1].last}
              <OpenButton />
            </FoldedBlock>
          )}

          {optionalFoldToggle[1] && (
            <UnFoldedBlock
              variants={UnFoldBlockVariant}
              initial="initial"
              animate="animate"
            >
              <CloseButton onClick={() => handleCloseUnFoldedBlock(1)} />

              <Keywords
                control={control}
                getValues={getValues}
                setValue={setValue}
                register={register}
              />
            </UnFoldedBlock>
          )}

          {!optionalFoldToggle[2] && (
            <FoldedBlock
              variants={FoldBlockVariant}
              initial="initial"
              animate="animate"
              onClick={() => handleOpenFoldedBlock(2)}
            >
              {optionalFoldText[2].first} &nbsp;{" "}
              <FoldedBlockAccentText>
                {optionalFoldText[2].accent}
              </FoldedBlockAccentText>
              &nbsp;{optionalFoldText[2].last}
              <OpenButton />
            </FoldedBlock>
          )}

          {optionalFoldToggle[2] && (
            <UnFoldedBlock
              variants={UnFoldBlockVariant}
              initial="initial"
              animate="animate"
            >
              <CloseButton onClick={() => handleCloseUnFoldedBlock(2)} />
              <UnFoldedTitle>자유 내용 입력</UnFoldedTitle>
              <UnFoldedDescription>
                모임의 목적,활동 내용 등에 대한 자세한 내용을 자유롭게
                작성해주세요!
              </UnFoldedDescription>
              <MyBlock>
                <Editor
                  wrapperClassName="wrapper-class"
                  editorClassName="editor"
                  toolbarClassName="toolbar-class"
                  toolbar={{
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    history: { inDropdown: false },
                    blockType: {
                      inDropdown: true,
                      options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"],
                    },
                  }}
                  placeholder="내용을 작성해주세요."
                  localization={{
                    locale: "ko",
                  }}
                  editorState={editorState}
                  onEditorStateChange={onEditorStateChange}
                />
              </MyBlock>
            </UnFoldedBlock>
          )}

          {!optionalFoldToggle[3] && (
            <FoldedBlock
              variants={FoldBlockVariant}
              initial="initial"
              animate="animate"
              onClick={() => handleOpenFoldedBlock(3)}
            >
              {optionalFoldText[3].first} &nbsp;{" "}
              <FoldedBlockAccentText>
                {optionalFoldText[3].accent}
              </FoldedBlockAccentText>
              &nbsp;{optionalFoldText[3].last}
              <OpenButton />
            </FoldedBlock>
          )}

          {optionalFoldToggle[3] && (
            <UnFoldedBlock
              variants={UnFoldBlockVariant}
              initial="initial"
              animate="animate"
            >
              <CloseButton onClick={() => handleCloseUnFoldedBlock(3)} />
              <UnFoldedTitle>포스터 등록</UnFoldedTitle>
              <UnFoldedDescription>
                포스터가 있다면 업로드해주세요! 모집글 페이지 및 포스터 모아보기
                페이지에서 보여집니다.
              </UnFoldedDescription>

              <ImageUpload
                imageURLList={imageURLList}
                setImageURLList={setImageURLList}
              />
            </UnFoldedBlock>
          )}
          <SubmitButton
            getValues={getValues}
            handleSubmit={handleSubmit}
            editorState={editorState}
            imageURLList={imageURLList}
            state={state}
          />
        </Form>
      </Container>
    </Outline>
  );
}

export default PostAddForm2;
