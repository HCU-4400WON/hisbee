import { useMutation } from "@tanstack/react-query";
import {
  createMentoring,
  createProject,
  createStudy,
  IPost,
  loginCheckApi,
} from "api";
import axios, { AxiosError, AxiosResponse } from "axios";
import { isLoginModalState, isLoginState } from "components/atom";
import LoadingAnimation from "components/LoadingAnimation";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import tw from "tailwind-styled-components";
import "./date.css";

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
import { storage } from "../firebase";

const StyledUl = tw.ul`
flex
`;

const Styledli = tw.li`
  flex
  items-center
`;

const StyledInput = tw.input`

mr-[10px]

`;
//accent-gray-500

const StyledInputName = tw.label`
mr-[20px]
`;
const StyledInputNumber = tw.input`
w-[40px]
border-b-2
border-gray-300
mx-[20px]
text-center

`;
const StyledFieldTitle = tw.label`
w-[90px] 
md:w-[130px]
font-semibold
font-main

`;

const FieldBox = tw.div`
w-1/2
flex

`;

const FieldRow = tw.div`
 flex
 flex-col
 md:flex-row
 h-[80px]
 md:h-auto
 justify-between
 min-w-[1000px]
 
`;

const FieldContainer = tw.div`
border-b-2 
border-t-2 
border-gray-300
align-center 
py-[30px]
mt-[20px]
mb-[40px]
`;

const StyledSpan = tw.span`
md:px-[30px]
px-[10px]
`;

const ValidationVariant = {
  hidden: {
    y: -10,
    color: "red",
    opacity: 0,
  },

  showing: {
    y: 0,
    opacity: 1,
  },

  exit: {
    y: 10,
    opacity: 0,
  },
};

interface IStudy {
  dtype: string;
  title: string;
  content: string;
  contact: string;
  maxMember: number;
  postStart: Date;
  postEnd: Date;
  projectStart: Date;
  projectEnd: Date;
}

interface IProject {
  dtype: string;
  title: string;
  content: string;
  contact: string;
  maxDeveloper: number;
  maxPlanner: number;
  maxDesigner: number;
  postStart: Date;
  postEnd: Date;
  projectStart: Date;
  projectEnd: Date;
  hasPay: boolean;
}

interface IMentoring {
  dtype: string;
  title: string;
  content: string;
  contact: string;
  maxMentor: number;
  maxMentee: number;
  postStart: Date;
  postEnd: Date;
  projectStart: Date;
  projectEnd: Date;
  hasPay: boolean;
}

interface IData {
  mentor: string;
  mentee: string;
  member: string;
  category: string;
  projectStart: string;
  projectEnd: string;
  postStart: string;
  postEnd: string;
  contact: string;
  developer: string;
  planner: string;
  designer: string;
  pay: string;
  title: string;
  content: string;
}

const MyBlock = styled.div`
  .wrapper-class {
    margin: 0 auto;
    margin-bottom: 4rem;
    border: 2px solid lightGray !important;
  }
  .editor {
    min-height: 500px !important;
    border-top: 3px solid lightGray !important;
    padding: 10px !important;
    border-radius: 2px !important;
  }
`;

function PostAddForm() {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState,
    setValue,
    getValues,
    getFieldState,
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      mentor: "0",
      mentee: "0",
      member: "0",
      category: "",
      projectStart: "",
      projectEnd: "",
      postStart:
        new Date().getFullYear() +
        "" +
        "-" +
        (new Date().getMonth() + 1 + "").padStart(2, "0") +
        "-" +
        (new Date().getDate() + "").padStart(2, "0"),
      postEnd: "",
      contact: "",
      developer: "0",
      planner: "0",
      designer: "0",
      pay: "",
      title: "",
      content: "",
    },
  });

  const setIsLogin = useSetRecoilState(isLoginState);
  const setIsLoginModal = useSetRecoilState(isLoginModalState);

  const navigate = useNavigate();
  const [cat, setCat] = useState("");

  const onClick = (e: React.FormEvent<HTMLInputElement>) => {
    setCat(e.currentTarget.value);
  };

  const { mutate: studyMutate, isLoading: studyMutateLoading } = useMutation(
    ["createStudyMutate" as string],

    (newPost: IStudy) => createStudy(newPost) as any,

    {
      onError: (error) => {
        if (((error as AxiosError).response as AxiosResponse).status === 401) {
          alert("로그인이 필요합니다.");
          setIsLoginModal(true);
          setIsLogin(false);
          if (localStorage.getItem("key")) localStorage.removeItem("key");
          navigate("/");
        }
      },
    }
  );
  const { mutate: mentoringMutate, isLoading: mentoringMutateLoading } =
    useMutation(
      ["createMentoringMutate" as string],

      (newPost: IMentoring) => createMentoring(newPost) as any,

      {
        onError: (error) => {
          if (
            ((error as AxiosError).response as AxiosResponse).status === 401
          ) {
            alert("로그인이 필요합니다.");
            setIsLoginModal(true);
            setIsLogin(false);
            if (localStorage.getItem("key")) localStorage.removeItem("key");
            navigate("/");
          }
        },
      }
    );
  const { mutate: projectMutate, isLoading: projectMutateLoading } =
    useMutation(
      ["createProjectMutate" as string],

      (newPost: IProject) => createProject(newPost) as any,

      {
        onError: (error) => {
          if (
            ((error as AxiosError).response as AxiosResponse).status === 401
          ) {
            alert("로그인이 필요합니다.");
            setIsLoginModal(true);
            setIsLogin(false);
            if (localStorage.getItem("key")) localStorage.removeItem("key");
            navigate("/");
          }
        },
      }
    );

  const onValid = (data: IData) => {
    // onTextEditorSubmit();

    console.log(data);

    if (data.projectStart >= data.projectEnd) {
      setError("projectEnd", { message: "마감일이 이릅니다." });
      return;
    }
    if (data.postStart >= data.postEnd) {
      setError("postEnd", { message: "마감일이 이릅니다." });
      return;
    }

    if (data.category === "study") {
      if (data.member === "0") {
        setError("member", { message: "0보다 커야 합니다." });
        return;
      }

      const newPost: IStudy = {
        dtype: "S",
        title: data.title,
        // content: data.content,
        content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        contact: data.contact,
        maxMember: +data.member,
        // postStart: new Date(data.postStart),
        postStart: new Date("2023-02-17"),
        postEnd: new Date(data.postEnd),
        projectStart: new Date(data.projectStart),
        projectEnd: new Date(data.projectEnd),
      };

      studyMutate(newPost);

      // navigate("/");
      window.location.replace("/post");
    } else if (data.category === "mentoring") {
      if (Number(data.mentor) + Number(data.mentee) === 0) {
        setError("mentor", { message: "0보다 커야 합니다." });
        return;
      }

      const newPost: IMentoring = {
        dtype: "M",
        title: data.title,
        // content: data.content,
        content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        contact: data.contact,
        maxMentor: +data.mentor,
        maxMentee: +data.mentee,
        postStart: new Date(data.postStart),
        postEnd: new Date(data.postEnd),
        projectStart: new Date(data.projectStart),
        projectEnd: new Date(data.projectEnd),
        hasPay: data.pay === "yes" ? true : false,
      };

      mentoringMutate(newPost);
      window.location.replace("/post");
    } else {
      if (
        Number(data.developer) +
          Number(data.planner) +
          Number(data.designer) ===
        0
      ) {
        setError("planner", { message: "0보다 커야 합니다." });
        return;
      }

      const newPost: IProject = {
        dtype: "P",
        title: data.title,
        // content: data.content,
        content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        contact: data.contact,
        maxDeveloper: +data.developer,
        maxPlanner: +data.planner,
        maxDesigner: +data.designer,
        postStart: new Date(data.postStart),
        postEnd: new Date(data.postEnd),
        projectStart: new Date(data.projectStart),
        projectEnd: new Date(data.projectEnd),
        hasPay: data.pay === "yes" ? true : false,
      };

      projectMutate(newPost);
      window.location.replace("/post");
    }
  };

  console.log(getValues().category);

  const { mutate: loginCheckMutate, isLoading: isLoginCheckLoading } =
    useMutation(["loginCheckApiAddForm" as string], loginCheckApi, {
      onError: (error) => {
        if (((error as AxiosError).response as AxiosResponse).status === 401) {
          if (localStorage.getItem("key")) localStorage.removeItem("key");
          navigate("/");
          alert("로그인이 필요합니다.");
          setIsLogin(false);
          setIsLoginModal(true);
        }
      },
    });

  useEffect(() => {
    loginCheckMutate();
  }, []);

  // useState로 상태관리하기 초기값은 EditorState.createEmpty()
  // EditorState의 비어있는 ContentState 기본 구성으로 새 개체를 반환 => 이렇게 안하면 상태 값을 나중에 변경할 수 없음.
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState: any) => {
    // editorState에 값 설정
    setEditorState(editorState);
  };

  // const onTextEditorSubmit = () => {
  //   console.log("editorState : ", editorState);
  //   console.log(
  //     "converted to Html : ",
  //     draftToHtml(convertToRaw(editorState.getCurrentContent()))
  //   );
  // };

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [imageURL, setImageURL] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const onImageChange = async (file: any) => {
    // return new Promise((resolve, reject) => {
    //   resolve({ data: { link: "www.naver.com" } });
    // });
    console.log(file);
    let newImage: any;
    // file.preventDefault();
    // const file = e;
    if (!file) return null;

    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    console.log(
      storageRef,
      uploadTask.then((snapshot) => snapshot)
    );

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgressPercent(progress);
      },
      (error) => {
        switch (error.code) {
          case "storage/canceld":
            alert("Upload has been canceled");
            break;
        }
      },
      async () => {
        getDownloadURL(storageRef).then((downloadURL) => {
          console.log("File available at", typeof downloadURL);
          setImageURL(downloadURL);

          return new Promise((resolve, reject) => {
            resolve({
              data: {
                link: downloadURL,
              },
            });
          });
        });
      }
    );
  };

  return (
    <>
      {isLoginCheckLoading ||
      studyMutateLoading ||
      projectMutateLoading ||
      mentoringMutateLoading ? (
        <LoadingAnimation />
      ) : (
        <form
          onSubmit={handleSubmit(onValid as any)}
          className="md:text-[16px] text-[13px] md:w-[1470px] md:px-[100px] px-[30px] py-[50px] pb-[100px] relative"
        >
          <Link to="/post">
            <div className="absolute md:top-[62px] md:left-[40px] top-[25px] left-[30px]">
              <i className="fa-solid fa-arrow-left-long text-[20px]"></i>
            </div>
          </Link>
          <div className="flex justify-between items-center">
            <p className="w-full md:text-[30px] text-[20px] font-unique">모집글 작성하기</p>
            <div className="flex h-[40px] items-end">
              <div
                className="w-[15px] h-[15px]"
                style={{
                  backgroundImage:
                    "radial-gradient(closest-side, #7b87e7, rgba(235, 235, 235, 0.13) 100%)",
                }}
              />
              <div
                className="w-[15px] h-[15px]"
                style={{
                  backgroundImage:
                    "radial-gradient(closest-side, #e3a3ff, rgba(235, 235, 235, 0.13) 100%)",
                }}
              />
              <div
                className="w-[15px] h-[15px]"
                style={{
                  backgroundImage:
                    "radial-gradient(closest-side, #9c9c9c, rgba(235, 235, 235, 0.13) 100%)",
                }}
              />
            </div>
          </div>
          <FieldContainer>
            <FieldRow>
              <FieldBox>
                <StyledFieldTitle>모집유형</StyledFieldTitle>
                <StyledUl>
                  <Styledli>
                    <StyledInput
                      id="study"
                      type="radio"
                      {...register("category", {
                        required: "필수 항목",
                      })}
                      value="study"
                      onClick={onClick}
                    />
                    <StyledInputName htmlFor="study">스터디</StyledInputName>
                  </Styledli>
                  <Styledli>
                    <StyledInput
                      id="mentoring"
                      type="radio"
                      {...register("category", {
                        required: "필수 항목",
                      })}
                      value="mentoring"
                      onClick={onClick}
                    />
                    <StyledInputName htmlFor="mentoring">
                      멘토링
                    </StyledInputName>
                  </Styledli>
                  <Styledli>
                    <StyledInput
                      id="project"
                      type="radio"
                      {...register("category", {
                        required: "필수 항목",
                      })}
                      value="project"
                      onClick={onClick}
                    />
                    <StyledInputName htmlFor="project">
                      프로젝트
                    </StyledInputName>
                  </Styledli>

                  <AnimatePresence>
                    {(formState.errors.category?.message as string) && (
                      <motion.li
                        variants={ValidationVariant}
                        className="text-xs my-auto"
                        initial="hidden"
                        animate="showing"
                        exit="exit"
                      >
                        *{formState.errors.category?.message as string}
                      </motion.li>
                    )}
                  </AnimatePresence>
                </StyledUl>
              </FieldBox>

              <FieldBox>
                <StyledFieldTitle>모집인원</StyledFieldTitle>
                <StyledUl>
                  {cat === "project" ? (
                    <>
                      <Styledli>
                        <label htmlFor="planner">기획자</label>
                        <StyledInputNumber
                          {...register("planner", {
                            required: "필수 사항 입니다.",
                          })}
                          min="0"
                          id="planner"
                          type="number"
                        />
                      </Styledli>
                      <Styledli>
                        <label htmlFor="designer">디자이너</label>
                        <StyledInputNumber
                          {...register("designer")}
                          min="0"
                          id="designer"
                          type="number"
                        />
                      </Styledli>
                      <Styledli>
                        <label htmlFor="developer">개발자</label>
                        <StyledInputNumber
                          {...register("developer")}
                          min="0"
                          id="developer"
                          type="number"
                        />
                      </Styledli>

                      <AnimatePresence>
                        {(formState.errors.planner?.message as any) && (
                          <motion.li
                            variants={ValidationVariant}
                            className="text-xs my-auto"
                            initial="hidden"
                            animate="showing"
                            exit="exit"
                          >
                            * {formState.errors.planner?.message as any}
                          </motion.li>
                        )}
                      </AnimatePresence>
                    </>
                  ) : cat === "mentoring" ? (
                    <>
                      <Styledli>
                        <label htmlFor="mentor">멘토</label>
                        <StyledInputNumber
                          {...register("mentor", {
                            required: "필수 사항 입니다.",
                          })}
                          min="0"
                          id="mentor"
                          type="number"
                        />
                      </Styledli>
                      <Styledli>
                        <label htmlFor="mentee">멘티</label>
                        <StyledInputNumber
                          {...register("mentee")}
                          min="0"
                          id="mentee"
                          type="number"
                        />
                      </Styledli>

                      <AnimatePresence>
                        {(formState.errors.mentor?.message as any) && (
                          <motion.li
                            variants={ValidationVariant}
                            className="text-xs my-auto"
                            initial="hidden"
                            animate="showing"
                            exit="exit"
                          >
                            * {formState.errors.mentor?.message as any}
                          </motion.li>
                        )}
                      </AnimatePresence>
                    </>
                  ) : cat === "study" ? (
                    <>
                      <Styledli>
                        <label htmlFor="member">스터디원</label>
                        <StyledInputNumber
                          {...register("member")}
                          min="0"
                          id="member"
                          type="number"
                        />
                      </Styledli>

                      <AnimatePresence>
                        {(formState.errors.member?.message as any) && (
                          <motion.li
                            variants={ValidationVariant}
                            className="text-xs my-auto"
                            initial="hidden"
                            animate="showing"
                            exit="exit"
                          >
                            * {formState.errors.member?.message as any}
                          </motion.li>
                        )}
                      </AnimatePresence>
                    </>
                  ) : null}
                </StyledUl>
              </FieldBox>
            </FieldRow>

            <FieldRow className=" relative my-[30px]">
              <FieldBox>
                <StyledFieldTitle htmlFor="projectStart">
                  프로젝트 기간
                </StyledFieldTitle>

                {/* <div className="flex"> */}
                <input
                  id="projectStart"
                  {...register("projectStart", {
                    required: "필수 항목",
                  })}
                  type="date"
                  className=" px-[10px]"
                />
                <StyledSpan>~</StyledSpan>
                <input
                  {...register("projectEnd", {
                    required: "필수 항목",
                  })}
                  type="date"
                  className=" px-[10px]"
                />
                {/* </div> */}
                <AnimatePresence>
                  {((formState.errors.projectStart?.message as string) ||
                    (formState.errors.projectEnd?.message as string)) && (
                    <motion.div
                      variants={ValidationVariant}
                      className="text-xs my-auto mx-5"
                      initial="hidden"
                      animate="showing"
                      exit="exit"
                    >
                      *{" "}
                      {(formState.errors.projectStart?.message as string) ||
                        (formState.errors.projectEnd?.message as string)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </FieldBox>
              <FieldBox>
                <StyledFieldTitle htmlFor="postEnd">모집 기간</StyledFieldTitle>

                {/* <input
              id="postStart"
              {...register("postStart", {
                required: "필수 항목입니다.",
              })}
              type="date"
            /> */}
                <span className=" font-medium pr-[10px]">
                  {formState.defaultValues?.postStart}
                </span>
                <StyledSpan>~</StyledSpan>
                <input
                  className="w-[150px]  px-[10px]"
                  {...register("postEnd", {
                    required: "필수 항목",
                  })}
                  type="date"
                />

                <AnimatePresence>
                  {(formState.errors.postEnd?.message as string) && (
                    <motion.div
                      variants={ValidationVariant}
                      className="text-xs my-auto mx-5"
                      initial="hidden"
                      animate="showing"
                      exit="exit"
                    >
                      * {formState.errors.postEnd?.message as string}
                    </motion.div>
                  )}
                </AnimatePresence>
              </FieldBox>
            </FieldRow>

            <FieldRow>
              <FieldBox>
                <StyledFieldTitle htmlFor="contact">연락 수단</StyledFieldTitle>
                <input
                  className="border-b-2 border-black py-[5px] px-[10px] w-[270px] focus:outline-0"
                  id="contact"
                  type="text"
                  {...register("contact", {
                    required: "필수 항목",
                  })}
                  placeholder="ex) 전화 번호 , 이메일 , 카톡 아이디 등"
                  maxLength={30}
                />

                <AnimatePresence>
                  {(formState.errors.contact?.message as string) && (
                    <motion.div
                      variants={ValidationVariant}
                      className="text-xs my-auto mx-5"
                      initial="hidden"
                      animate="showing"
                      exit="exit"
                    >
                      * {formState.errors.contact?.message as string}
                    </motion.div>
                  )}
                </AnimatePresence>
              </FieldBox>

              {cat === "" || cat === "study" ? null : (
                <FieldBox>
                  <StyledFieldTitle>보수 유무</StyledFieldTitle>

                  <StyledUl>
                    <Styledli>
                      <StyledInput
                        id="yes"
                        {...register("pay", {
                          required: "필수 항목",
                        })}
                        type="radio"
                        value="yes"
                      />
                      <StyledInputName htmlFor="yes">Yes</StyledInputName>
                    </Styledli>
                    <Styledli>
                      <StyledInput
                        id="no"
                        {...register("pay", {
                          required: "필수 항목",
                        })}
                        type="radio"
                        value="no"
                      />
                      <StyledInputName htmlFor="no">No</StyledInputName>
                    </Styledli>
                  </StyledUl>

                  <AnimatePresence>
                    {(formState.errors.pay?.message as string) && (
                      <motion.div
                        variants={ValidationVariant}
                        className="text-xs my-auto"
                        initial="hidden"
                        animate="showing"
                        exit="exit"
                      >
                        * {formState.errors.pay?.message as string}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </FieldBox>
              )}
            </FieldRow>
          </FieldContainer>

          <div className="flex mb-[40px] relative">
            <label
              htmlFor="title"
              className="md:w-[130px] w-[80px] text-[15px] md:text-[20px] my-auto font-main"
            >
              제목
            </label>
            <input
              {...register("title", {
                minLength: {
                  value: 3,
                  message: "제목이 너무 짧습니다.",
                },
                maxLength: {
                  value: 30,
                  message: "제목이 너무 깁니다.",
                },
              })}
              id="title"
              type="text"
              className="w-full bg-[#eeeeee] h-[40px] px-[10px] "
              placeholder="3~30글자 제한 (짧은 제목 권장)"
              maxLength={30}
            />
            <AnimatePresence>
              {(formState.errors.title?.message as string) && (
                <motion.div
                  variants={ValidationVariant}
                  className="absolute text-xs my-auto mx-5 bottom-[-20px] left-[100px]"
                  initial="hidden"
                  animate="showing"
                  exit="exit"
                >
                  * {formState.errors.title?.message as string}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex relative">
            <label
              htmlFor="content"
              className="md:w-[130px] text-[15px] md:text-[20px] w-[80px] font-main"
            >
              내용
            </label>
            {/* <textarea
              {...register("content", {
                minLength: {
                  value: 5,
                  message: "내용이 너무 짧습니다.",
                },
              })}
              id="content"
              className="w-full bg-[#eeeeee] h-[345px] px-[10px] py-[10px] "
              placeholder="자유롭게 작성 해주세요 !"
            /> */}
            <MyBlock className="w-full">
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
                  image: {
                    uploadCallback: onImageChange,
                    previewImage: true,
                    alt: { present: true, mandatory: false },
                    inputAccept:
                      "image/gif,image/jpeg,image/jpg,image/png,image/svg",
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

            <AnimatePresence>
              {(formState.errors.content?.message as string) && (
                <motion.div
                  variants={ValidationVariant}
                  className="absolute text-xs my-auto mx-5 bottom-[-20px] left-[100px]"
                  initial="hidden"
                  animate="showing"
                  exit="exit"
                >
                  * {formState.errors.content?.message as string}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <input
            type="submit"
            className="my-[40px] bg-[#eeeeee] w-[120px] h-[30px] text-[16px] font-semibold float-right"
            value="올리기"
          />
        </form>
      )}
    </>
  );
}

export default PostAddForm;
