import tw from "tailwind-styled-components";
import React, { useEffect, useState } from "react";
import { IPost, loginCheckApi, readOnePost, updatePost } from "api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

import { useRecoilState, useSetRecoilState } from "recoil";
import { isLoginState, isPostDeleteModalState } from "components/atom";
import PostDeleteModal from "Routes/Detail/PostDeleteModal";
import { useForm } from "react-hook-form";

import LoadingAnimation from "components/LoadingAnimation";
import { AxiosError, AxiosResponse } from "axios";

import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { ContentState, convertToRaw, EditorState } from "draft-js";

import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useRef } from "react";
import { storage } from "../../firebase";
import styled from "styled-components";
import Validation from "./Validation";
import MyEditor from "./MyEditor";

const Container = tw.div`
md:w-[1470px] 
flex w-full
`;
const GoBackSpan = tw.span`
md:min-w-[100px] min-w-[40px] py-[62px] border-gray-300  flex justify-end
`;

const GoBackButton = tw.button`
md:mr-[40px] mr-[10px] h-[30px]`;

const GoBackIcon = tw.i`
fa-solid fa-arrow-left text-[18px] md:text-[23px]
`;

const Form = tw.form`
w-full
`;
const FormHeader = tw.header`
pt-[62px] md:pt-[55px] text-[20px] md:text-[25px] font-semibold flex`;

const FormTitleInput = tw.input`
w-[400px] 
md:h-[40px] 
h-[35px] 
px-[15px] 
bg-[#eeeeee]
`;

const FormTitle = tw.div`
font-main
`;

const FormAuthorNButtonRow = tw.div`
flex justify-between
`;

const StyledUl = tw.ul`
flex


`;

const Styledli = tw.li`
  flex
  items-center
`;

const StyledInputNumber = tw.input`
  w-[30px]
  border-b-2
  border-gray-300
  mx-[20px]
  text-center


`;
const StyledInputLabel = tw.label`
text-[13px]
md:text-[18px]
`;

const Grid = tw.div`
grid 
md:grid-cols-2  
grid-cols-1
border-t-2 
border-b-2 
border-gray-300 
md:h-[250px]
h-[450px]
py-[20px] 
items-center
w-full
`;

const GridItem = tw.div`
flex 
items-center 
h-[30px] 


`;

const ItemTitle = tw.span`
text-[#757575] 
min-w-[130px]

text-[14px] 
md:text-[18px]
md:min-w-[140px]
font-unique
`;

const ItemText = tw.span`
text-[13px] 
md:text-[17px]
font-medium

`;

const FormAuthorSpan = tw.div`

flex 
flex-col md:flex-row items-center
py-[20px]
`;

const WriterSpan = tw.span`
flex w-[200px] md:w-[auto]
`;
const WriteDateSpan = tw.span`
`;
const WriteInfo = tw.span`
text-[13px]
md:text-[17px]

md:w-auto
mr-[20px]
text-gray-400
h-[20px]
md:h-auto
`;

const FormButtonDiv = tw.div`
flex items-center w-[70px] md:w-[100px] justify-between
`;

const FormModifyOKButton = tw.button`
w-[70px] text-gray-500 rounded-full
`;

const FormModifyOKIcon = tw.i`
fa-solid fa-check text-[30px] text-green-600
`;

const FormModifyButton = tw.button`
w-[70px] text-gray-500 rounded-full
`;
const FormModifyIcon = tw.i`
fa-regular fa-pen-to-square text-[25px] md:text-[30px]

`;

const FormDeleteButton = tw.button`
w-[70px]  text-red-400  rounded-full
`;

const FormDeleteIcon = tw.i`
fa-regular fa-trash-can text-[25px] md:text-[30px]
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

const MyBlock = styled.div`
  .wrapper-class {
    width: 100%;
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
function Detail() {
  const [editorString, setEditorString] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const { id } = useParams();

  const { isLoading, data, refetch, isSuccess } = useQuery<IPost>(
    ["PostInfo", id],
    () => readOnePost(+(id as any)),
    {
      onSuccess: (data) => {
        console.log("debug", data);
        setValue("maxMentor", data.maxMentor + "");
        setValue("maxMentee", data.maxMentee + "");
        setValue("maxMember", data.maxMember + "");
        setValue("maxDesigner", data.maxDesigner + "");
        setValue("maxDeveloper", data.maxDeveloper + "");
        setValue("maxPlanner", data.maxPlanner + "");

        setValue("varified", data.varified);
        setValue("dtype", data.dtype);
        setValue("currMentor", data.currMentor + "");
        setValue("currMentee", data.currMentee + "");
        setValue("currMember", data.currMember + "");
        setValue("currPlanner", data.currPlanner + "");
        setValue("currDeveloper", data.currDeveloper + "");
        setValue("currDesigner", data.currDesigner + "");
        setValue(
          "projectStart",
          `${new Date(data.projectStart).getFullYear()}-${(
            new Date(data.projectStart).getMonth() +
            1 +
            ""
          ).padStart(2, "0")}-${(
            new Date(data.projectStart).getDate() + ""
          ).padStart(2, "0")}`
        );
        setValue(
          "projectEnd",
          `${new Date(data.projectEnd).getFullYear()}-${(
            new Date(data.projectEnd).getMonth() +
            1 +
            ""
          ).padStart(2, "0")}-${(
            new Date(data.projectEnd).getDate() + ""
          ).padStart(2, "0")}`
        );
        setValue(
          "postStart",
          `${new Date(data.postStart).getFullYear()}-${(
            new Date(data.postStart).getMonth() +
            1 +
            ""
          ).padStart(2, "0")}-${(
            new Date(data.postStart).getDate() + ""
          ).padStart(2, "0")}`
        );
        setValue(
          "postEnd",
          `${new Date(data.postEnd).getFullYear()}-${(
            new Date(data.postEnd).getMonth() +
            1 +
            ""
          ).padStart(2, "0")}-${(
            new Date(data.postEnd).getDate() + ""
          ).padStart(2, "0")}`
        );

        setValue("pay", data.hasPay ? "Yes" : "No");
        setValue("contact", data.contact);
        setValue("content", data.content);
        setValue("title", data.title);

        const contentDraft = htmlToDraft(data.content);
        const { contentBlocks, entityMap } = contentDraft;
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap
        );
        const editorState = EditorState.createWithContent(contentState);

        setEditorState(editorState);
        setEditorString(data.content);
      },
      onError: () => {
        console.log("존재하지 않는 게시물입니다.");
        alert("존재하지 않는 게시물입니다.");
        navigate(-1);
      },
    }
  );
  const { register, handleSubmit, setError, formState, setValue } = useForm({
    mode: "onSubmit",
  });

  interface IData {
    maxMentor: string;
    maxMentee: string;
    maxMember: string;
    maxPlanner: string;
    maxDesigner: string;
    maxDeveloper: string;

    currMentor: string;
    currMentee: string;
    currMember: string;
    dtype?: string;
    projectStart: string | Date;
    projectEnd: string | Date;
    postStart: string | Date;
    postEnd: string | Date;
    contact: string;
    currDeveloper: string;
    currPlanner: string;
    currDesigner: string;
    pay: string;
    title: string;
    content: string;
  }

  const [isPostDeleteModal, setIsPostDeleteModal] = useRecoilState(
    isPostDeleteModalState
  );

  const onBtnClick = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const {
      currentTarget: { id },
    } = event;

    if (id === "delete") {
      setIsPostDeleteModal(true);
    } else if (id === "modify") {
      console.log("!");
      setIsModifying(true);
    }
  };

  const [isModifying, setIsModifying] = useState(false);

  const navigate = useNavigate();
  const onValid = async (data: IData) => {
    if (data.projectStart >= data.projectEnd) {
      setError("projectEnd", { message: "마감일 이릅니다" });
      return;
    }
    if (data.postStart >= data.postEnd) {
      setError("postEnd", { message: "마감일이 이릅니다." });
      return;
    }

    if (data.dtype === "S") {
      if (data.maxMember === "0") {
        setError("maxMember", { message: "0보다 커야 합니다." });
        return;
      } else if (data.maxMember < data.currMember) {
        data.maxMember = data.currMember;
      }
    } else if (data.dtype === "M") {
      if (Number(data.maxMentor) + Number(data.maxMentee) === 0) {
        setError("maxMentor", { message: "0보다 커야 합니다." });
        return;
      } else if (data.maxMentor < data.currMentor) {
        data.maxMentor = data.currMentor;
      } else if (data.maxMentee < data.currMentee) {
        data.maxMentee = data.currMentee;
      }
    } else if (data.dtype === "P") {
      if (
        Number(data.maxDeveloper) +
          Number(data.maxPlanner) +
          Number(data.maxDesigner) ===
        0
      ) {
        setError("maxPlanner", { message: "0보다 커야 합니다." });
        return;
      } else if (data.maxPlanner < data.currPlanner) {
        data.maxPlanner = data.currPlanner;
      } else if (data.maxDesigner < data.currDesigner) {
        data.maxDesigner = data.currDesigner;
      } else if (data.maxDeveloper < data.currDeveloper) {
        data.maxDeveloper = data.currDeveloper;
      }

      console.log("제출되었습니다.");
    }

    const newData = {
      maxMentor: +data.maxMentor,
      maxMentee: +data.maxMentee,
      maxMember: +data.maxMember,
      maxDeveloper: +data.maxDeveloper,
      maxDesigner: +data.maxDesigner,
      maxPlanner: +data.maxPlanner,
      currMentor: +data.currMentor,
      currMentee: +data.currMentee,
      currMember: +data.currMember,
      currDeveloper: +data.currDeveloper,
      currPlanner: +data.currPlanner,
      currDesigner: +data.currDesigner,
      dtype: data?.dtype,
      projectStart: new Date(data.projectStart),
      projectEnd: new Date(data.projectEnd),
      postStart: new Date(data.postStart),
      postEnd: new Date(data.postEnd),
      contact: data.contact,
      hasPay: data.pay === "Yes" ? true : false,
      title: data.title,
      // content: data.content,
      content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    };
    if (id) {
      console.log(newData, "new");
      await updatePost(+id, newData);

      refetch();
    }

    setIsModifying(false);
  };

  const setIsLogin = useSetRecoilState(isLoginState);

  const { mutate: loginCheckMutate, isLoading: isLoginCheckLoading } =
    useMutation(["loginCheckApiDetail" as string], loginCheckApi, {
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

  // useState로 상태관리하기 초기값은 EditorState.createEmpty()
  // EditorState의 비어있는 ContentState 기본 구성으로 새 개체를 반환 => 이렇게 안하면 상태 값을 나중에 변경할 수 없음.

  const onEditorStateChange = (editorState: any) => {
    // editorState에 값 설정
    setEditorState(editorState);
  };

  const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("editorState : ", editorState);
    console.log(
      "converted to Html : ",
      draftToHtml(convertToRaw(editorState.getCurrentContent()))
    );
    // const getCurrentContent = editorState.getCurrentContent();
    // const Raw = convertToRaw(getCurrentContent);
    // const Html = draftToHtml(Raw);
    // console.log(getCurrentContent, "\n", Raw, "\n", Html);
  };

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

  interface Iconverter {
    [maxDeveloper: string]: string;
    maxPlanner: string;
    maxDesigner: string;
    maxMentor: string;
    maxMentee: string;
  }
  const converter: Iconverter = {
    maxDeveloper: "개발자",
    maxPlanner: "기획자",
    maxDesigner: "디자이너",
    maxMentor: "멘토",
    maxMentee: "멘티",
    currDeveloper: "개발자",
    currPlanner: "기획자",
    currDesigner: "디자이너",
    currMentor: "멘토",
    currMentee: "멘티",
  };
  const dateConverter = (date: Date) => {
    const str = "";
    return str.concat(
      new Date(date).getFullYear() + "",
      " / ",
      (new Date(date).getMonth() + 1 + "").padStart(2, "0"),
      " / ",
      (new Date(date).getDate() + "").padStart(2, "0")
    );
  };

  return (
    <>
      {isLoading || isLoginCheckLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          {isPostDeleteModal && <PostDeleteModal postId={data?.id} />}
          <Container>
            <GoBackSpan>
              <GoBackButton onClick={() => navigate(-1)}>
                <GoBackIcon></GoBackIcon>
              </GoBackButton>
            </GoBackSpan>

            <Form onSubmit={handleSubmit(onValid as any)}>
              <FormHeader>
                {isModifying ? (
                  <>
                    <FormTitleInput
                      type="text"
                      {...register("title", {
                        required: "필수 항목 입니다",
                        minLength: {
                          value: 3,
                          message: "제목이 너무 짧습니다",
                        },
                        maxLength: {
                          value: 30,
                          message: "제목이 너무 깁니다",
                        },
                      })}
                      placeholder="3~30자 이내"
                    />
                    <Validation message={formState.errors.title?.message} />
                  </>
                ) : (
                  <FormTitle>{data?.title}</FormTitle>
                )}
              </FormHeader>

              <FormAuthorNButtonRow>
                <FormAuthorSpan>
                  <WriterSpan>
                    <WriteInfo className="">작성자</WriteInfo>
                    <WriteInfo className="mr-[40px] text-gray-500">
                      {data?.writer}
                    </WriteInfo>
                  </WriterSpan>

                  <WriteDateSpan className="flex w-[200px] md:w-[auto]">
                    <WriteInfo className="">작성일</WriteInfo>
                    <WriteInfo className="text-gray-500">
                      {dateConverter(data?.postStart as Date)}
                    </WriteInfo>
                  </WriteDateSpan>
                </FormAuthorSpan>

                <FormButtonDiv>
                  {register("varified") && (
                    <>
                      {isModifying ? (
                        <FormModifyOKButton id="modify">
                          <FormModifyOKIcon />
                        </FormModifyOKButton>
                      ) : (
                        <FormModifyButton id="modify" onClick={onBtnClick}>
                          <FormModifyIcon />
                        </FormModifyButton>
                      )}

                      <FormDeleteButton id="delete" onClick={onBtnClick}>
                        <FormDeleteIcon />
                      </FormDeleteButton>
                    </>
                  )}
                </FormButtonDiv>
              </FormAuthorNButtonRow>
              <Grid>
                <GridItem>
                  <ItemTitle>모집 기간</ItemTitle>
                  <ItemText>
                    <>{dateConverter(data?.postStart as Date)}</>
                  </ItemText>
                  <ItemText className="mx-[10px] ml-[20px]">~</ItemText>
                  <ItemText>
                    <ItemText>
                      {isModifying ? (
                        <div className="flex">
                          <input
                            type="date"
                            className="px-[10px] text-[13px] md:text-[18px] w-[130px] md:w-[170px]"
                            {...register("postEnd", {
                              required: "필수 항목",
                            })}
                          ></input>
                          <Validation
                            message={formState.errors.postEnd?.message}
                          />
                        </div>
                      ) : (
                        <>{dateConverter(data?.postEnd as Date)}</>
                      )}
                    </ItemText>
                  </ItemText>
                </GridItem>
                <GridItem>
                  <ItemTitle>모집 유형</ItemTitle>

                  <ItemText>
                    {data?.dtype === "P"
                      ? "프로젝트"
                      : data?.dtype === "S"
                      ? "스터디"
                      : "멘토링"}
                  </ItemText>
                </GridItem>
                <GridItem>
                  <ItemTitle>현재 모집된 인원</ItemTitle>

                  {isModifying ? (
                    <>
                      <StyledUl>
                        {data?.dtype === "P" ? (
                          <>
                            {[
                              "currDeveloper",
                              "currPlanner",
                              "currDesigner",
                            ].map((element, index) => (
                              <Styledli key={index}>
                                <StyledInputLabel htmlFor={element}>
                                  {converter[element]}
                                </StyledInputLabel>
                                <StyledInputNumber
                                  {...register(element)}
                                  min="0"
                                  id={element}
                                  type="number"
                                />
                              </Styledli>
                            ))}

                            <Validation
                              message={formState.errors.currPlanner?.message}
                            />
                          </>
                        ) : data?.dtype === "M" ? (
                          <>
                            {["currMentor", "currMentee"].map(
                              (element, index) => (
                                <Styledli key={index}>
                                  <StyledInputLabel htmlFor={element}>
                                    {converter[element]}
                                  </StyledInputLabel>
                                  <StyledInputNumber
                                    {...register(element)}
                                    min="0"
                                    id={element}
                                    type="number"
                                  />
                                </Styledli>
                              )
                            )}

                            <Validation
                              message={formState.errors.currMentor?.message}
                            />
                          </>
                        ) : data?.dtype === "S" ? (
                          <>
                            <Styledli>
                              <StyledInputLabel htmlFor="currMember">
                                스터디원
                              </StyledInputLabel>
                              <StyledInputNumber
                                {...register("currMember", {
                                  required: "필수 사항입니다.",
                                })}
                                min="0"
                                id="currMember"
                                type="number"
                              />
                            </Styledli>

                            <Validation
                              message={formState.errors.currMember?.message}
                            />
                          </>
                        ) : null}
                      </StyledUl>
                    </>
                  ) : (
                    <>
                      {data?.dtype === "P" ? (
                        <>
                          {data?.maxDeveloper !== 0 && (
                            <ItemText>
                              개발자 {data?.currDeveloper}명 &nbsp;
                            </ItemText>
                          )}
                          {data?.maxPlanner !== 0 && (
                            <ItemText>
                              기획자 {data?.currPlanner}명 &nbsp;
                            </ItemText>
                          )}
                          {data?.maxDesigner !== 0 && (
                            <ItemText>디자이너 {data?.currDesigner}명</ItemText>
                          )}
                        </>
                      ) : data?.dtype === "M" ? (
                        <>
                          {data?.maxMentor !== 0 && (
                            <ItemText>
                              멘토 {data?.currMentor}명 &nbsp;
                            </ItemText>
                          )}
                          {data?.maxMentee !== 0 && (
                            <ItemText>
                              멘티 {data?.currMentee}명 &nbsp;
                            </ItemText>
                          )}
                        </>
                      ) : (
                        <>
                          {data?.maxMember !== 0 && (
                            <ItemText>
                              스터디원 {data?.currMember}명&nbsp;
                            </ItemText>
                          )}
                        </>
                      )}
                    </>
                  )}
                </GridItem>
                <GridItem>
                  <ItemTitle>프로젝트 기간</ItemTitle>
                  <ItemText>
                    {isModifying ? (
                      <input
                        type="date"
                        className=" text-[13px] md:text-[18px] w-[110px] md:w-[165px] mr-[10px]"
                        {...register("projectStart", {
                          required: "필수 항목입니다.",
                        })}
                      ></input>
                    ) : (
                      <>{dateConverter(data?.projectStart as Date)}</>
                    )}
                  </ItemText>
                  <ItemText className=" mx-[10px]">~</ItemText>
                  <ItemText>
                    {isModifying ? (
                      <div className="flex">
                        <input
                          type="date"
                          className="text-[13px] md:text-[18px] w-[110px] md:w-[165px] mx-[10px]"
                          {...register("projectEnd", {
                            required: "필수 항목 입니다",
                          })}
                        ></input>

                        <Validation
                          message={
                            formState.errors.projectStart?.message ||
                            formState.errors.projectEnd?.message
                          }
                        />
                      </div>
                    ) : (
                      <>{dateConverter(data?.projectEnd as Date)}</>
                    )}
                  </ItemText>
                </GridItem>
                <GridItem>
                  <ItemTitle>모집 인원</ItemTitle>

                  {isModifying ? (
                    <>
                      <StyledUl>
                        {data?.dtype === "P" ? (
                          <>
                            {["maxDeveloper", "maxPlanner", "maxDesigner"].map(
                              (element, index) => (
                                <Styledli key={index}>
                                  <StyledInputLabel htmlFor={element}>
                                    {converter[element]}
                                  </StyledInputLabel>
                                  <StyledInputNumber
                                    {...register(element)}
                                    min="0"
                                    id={element}
                                    type="number"
                                  />
                                </Styledli>
                              )
                            )}

                            <Validation
                              message={
                                formState.errors.maxPlanner?.message ||
                                formState.errors.maxDeveloper?.message ||
                                formState.errors.maxDesigner?.message
                              }
                            />
                          </>
                        ) : data?.dtype === "M" ? (
                          <>
                            {["maxMentor", "maxMentee"].map(
                              (element, index) => (
                                <Styledli key={index}>
                                  <StyledInputLabel htmlFor={element}>
                                    {converter[element]}
                                  </StyledInputLabel>
                                  <StyledInputNumber
                                    {...register(element, {
                                      required: "필수 사항 입니다.",
                                    })}
                                    min="0"
                                    id={element}
                                    type="number"
                                  />
                                </Styledli>
                              )
                            )}

                            <Validation
                              message={
                                formState.errors.maxMentor?.message ||
                                formState.errors.maxMentee?.message
                              }
                            />
                          </>
                        ) : data?.dtype === "S" ? (
                          <>
                            <Styledli>
                              <StyledInputLabel htmlFor="maxMember">
                                스터디원
                              </StyledInputLabel>
                              <StyledInputNumber
                                {...register("maxMember", {
                                  required: "필수 사항입니다.",
                                })}
                                min="0"
                                id="maxMember"
                                type="number"
                              />
                            </Styledli>

                            <Validation
                              message={formState.errors.maxMember?.message}
                            />
                          </>
                        ) : null}
                      </StyledUl>
                    </>
                  ) : (
                    <>
                      {data?.dtype === "P" ? (
                        <>
                          {data?.maxDeveloper !== 0 && (
                            <ItemText>
                              개발자 {data?.maxDeveloper}명 &nbsp;
                            </ItemText>
                          )}
                          {data?.maxPlanner !== 0 && (
                            <ItemText>
                              기획자 {data?.maxPlanner}명 &nbsp;
                            </ItemText>
                          )}
                          {data?.maxDesigner !== 0 && (
                            <ItemText>디자이너 {data?.maxDesigner}명</ItemText>
                          )}
                        </>
                      ) : data?.dtype === "M" ? (
                        <>
                          {data?.maxMentor !== 0 && (
                            <ItemText>멘토 {data?.maxMentor}명 &nbsp;</ItemText>
                          )}
                          {data?.maxMentee !== 0 && (
                            <ItemText>멘티 {data?.maxMentee}명 &nbsp;</ItemText>
                          )}
                        </>
                      ) : (
                        <>
                          {data?.maxMember !== 0 && (
                            <ItemText>
                              스터디원 {data?.maxMember}명&nbsp;
                            </ItemText>
                          )}
                        </>
                      )}
                    </>
                  )}
                </GridItem>

                <GridItem>
                  <ItemTitle>연락수단</ItemTitle>
                  <ItemText className="md:w-full w-[200px] ">
                    {isModifying ? (
                      <div className="flex">
                        <input
                          {...register("contact", {
                            required: "필수 항목입니다.",
                          })}
                          placeholder="ex) 전화 번호 , 이메일 , 카톡 아이디 등"
                          type="text"
                          className=" w-[350px] h-[30px] bg-[#eeeeee] px-[15px] md:text-[17px] text-[15px]"
                          maxLength={30}
                        ></input>

                        <Validation
                          message={formState.errors.contact?.message}
                        />
                      </div>
                    ) : (
                      <>{data?.contact}</>
                    )}
                  </ItemText>
                </GridItem>

                <GridItem>
                  <ItemTitle>보수 유무</ItemTitle>
                  {data?.dtype === "S" ? (
                    <ItemText>No</ItemText>
                  ) : isModifying ? (
                    <div>
                      <input
                        {...register("pay", {
                          required: "필수 항목입니다.",
                        })}
                        id="Yes"
                        className="mr-[10px] "
                        type="radio"
                        value="Yes"
                      ></input>
                      <label className="mr-[20px]" htmlFor="Yes">
                        Yes
                      </label>
                      <input
                        id="No"
                        {...register("pay", {
                          required: "보수 유무는 필수 항목입니다.",
                        })}
                        className="mr-[10px]"
                        type="radio"
                        value="No"
                      ></input>
                      <label className="mr-[20px]" htmlFor="No">
                        No
                      </label>
                    </div>
                  ) : (
                    <>
                      {data?.hasPay ? (
                        <ItemText>Yes</ItemText>
                      ) : (
                        <ItemText>No</ItemText>
                      )}
                    </>
                  )}
                </GridItem>
              </Grid>
              <div className=" pt-[50px] pb-[50px] border-b-2 border-gray-300 ">
                {isModifying ? (
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
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: editorString }}></div>
                )}
              </div>
              {isModifying && (
                <button className=" w-[130px] h-[30px] text-white bg-black mt-[30px] mb-[10px] float-right">
                  수정하기
                </button>
              )}
            </Form>

            <div className="min-w-[40px] md:min-w-[100px] "></div>
          </Container>
        </>
      )}
    </>
  );
}

export default Detail;
