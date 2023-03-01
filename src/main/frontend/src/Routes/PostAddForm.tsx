import { useMutation } from "@tanstack/react-query";
import { createMentoring, createProject, createStudy, IPost } from "api";
import axios, { AxiosError, AxiosResponse } from "axios";
import { isLoginModalState, isLoginState } from "components/atom";
import LoadingAnimation from "components/LoadingAnimation";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import tw from "tailwind-styled-components";
import "./date.css";

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
w-[130px] 
font-normal
`;

const FieldBox = tw.div`
w-1/2
flex

`;

const FieldRow = tw.div`
 flex
 
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
px-[30px]
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
        content: data.content,
        contact: data.contact,
        maxMember: +data.member,
        // postStart: new Date(data.postStart),
        postStart: new Date("2023-02-17"),
        postEnd: new Date(data.postEnd),
        projectStart: new Date(data.projectStart),
        projectEnd: new Date(data.projectEnd),
      };

      studyMutate(newPost);

      navigate("../post");
    } else if (data.category === "mentoring") {
      if (Number(data.mentor) + Number(data.mentee) === 0) {
        setError("mentor", { message: "0보다 커야 합니다." });
        return;
      }

      const newPost: IMentoring = {
        dtype: "M",
        title: data.title,
        content: data.content,
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
      navigate("../post");
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
        content: data.content,
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
      navigate("../post");
    }
  };

  console.log(getValues().category);

  return (
    <>
      {studyMutateLoading || projectMutateLoading || mentoringMutateLoading ? (
        <LoadingAnimation />
      ) : (
        <form
          onSubmit={handleSubmit(onValid as any)}
          className=" w-[1470px] px-[100px] py-[50px] pb-[100px] relative"
        >
          <Link to="/post">
            <div className="absolute top-[62px] left-[40px]">
              <i className="fa-solid fa-arrow-left-long text-[20px]"></i>
            </div>
          </Link>
          <div className="flex justify-between items-center">
            <p className="w-full text-[30px] font-normal">모집글 작성하기</p>
            <div className="flex h-[40px] items-end">
              <div
                className="w-[20px] h-[20px]"
                style={{
                  backgroundImage:
                    "radial-gradient(closest-side, #7b87e7, rgba(235, 235, 235, 0.13) 100%)",
                }}
              />
              <div
                className="w-[20px] h-[20px]"
                style={{
                  backgroundImage:
                    "radial-gradient(closest-side, #e3a3ff, rgba(235, 235, 235, 0.13) 100%)",
                }}
              />
              <div
                className="w-[20px] h-[20px]"
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
                        required: "필수 항목입니다.",
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
                        required: "필수 항목입니다.",
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
                        required: "필수 항목입니다.",
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
                    required: "필수 항목입니다.",
                  })}
                  type="date"
                  className=" px-[10px]"
                />
                <StyledSpan>~</StyledSpan>
                <input
                  {...register("projectEnd", {
                    required: "필수 항목입니다.",
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
                <span className=" font-medium">
                  {formState.defaultValues?.postStart}
                </span>
                <StyledSpan>~</StyledSpan>
                <input
                  className="w-[150px]  px-[10px]"
                  {...register("postEnd", {
                    required: "필수 항목입니다.",
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
                    required: "필수 항목입니다.",
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
                          required: "보수 유무는 필수 항목입니다.",
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
                          required: "필수 항목입니다.",
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
            <label htmlFor="title" className="w-[130px] text-[20px] my-auto">
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
            <label htmlFor="content" className="w-[130px] text-[20px]">
              내용
            </label>
            <textarea
              {...register("content", {
                minLength: {
                  value: 5,
                  message: "내용이 너무 짧습니다.",
                },
              })}
              id="content"
              className="w-full bg-[#eeeeee] h-[345px] px-[10px] py-[10px] "
              placeholder="자유롭게 작성 해주세요 !"
            />
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
