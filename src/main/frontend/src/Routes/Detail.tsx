import tw from "tailwind-styled-components";
import React, { useEffect, useState } from "react";
import { IPost, posts, readOnePost, updatePost } from "api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { isPostDeleteModalState } from "components/atom";
import PostDeleteModal from "components/PostDeleteModal";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import LoadingAnimation from "components/LoadingAnimation";

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

const Grid = tw.div`
grid 
grid-cols-2  
border-t-2 
border-b-2 
border-gray-300 
h-[250px] 
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
text-[18px] 
min-w-[140px]
`;

const ItemText = tw.span`
text-[17px] 
font-medium

`;

const WriteInfoBox = tw.div`
flex 

py-[20px]
`;

const WriteInfo = tw.span`

text-[17px]
mr-[20px]
text-gray-400

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

function Detail() {
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
      },
      onError: () => {
        console.log("존재하지 않는 게시물입니다.");
        alert("존재하지 않는 게시물입니다.");
        navigate("/post");
      },
    }
  );
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
    // defaultValues: {
    //   currMentor: "0",
    //   currMentee: "0",
    //   currMember: "0",
    //   dtype: "",
    //   projectStart: "",
    //   projectEnd: "",
    //   postStart:
    //     new Date().getFullYear() +
    //     "" +
    //     "-" +
    //     (new Date().getMonth() + 1 + "").padStart(2, "0") +
    //     "-" +
    //     (new Date().getDate() + "").padStart(2, "0"),
    //   postEnd: "",
    //   contact: "",
    //   currDeveloper: "0",
    //   currPlanner: "0",
    //   currDesigner: "0",
    //   pay: "",
    //   title: "",
    //   content: "",
    // },
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

  // console.log("Debug ", data);
  // console.log("!!", new Date(data?.postStart as any));
  // const data?: IPost = data as any;

  // const data? = posts[+(id as any)];

  // console.log(data?);

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

  const onModifyClick = () => {
    // const data = {};
    //  모집 인원 부분 모집 유형에 따라 변하도록
    //  state useForm으로 채우기
    //  마지막 refetch... validation... api...

    setIsModifying(false);

    // updatePost(data?.id, data);
  };

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
        setError("maxMember", { message: "현재 인원 보다 적습니다." });
        return;
      }
    } else if (data.dtype === "M") {
      if (Number(data.maxMentor) + Number(data.maxMentee) === 0) {
        setError("maxMentor", { message: "0보다 커야 합니다." });
        return;
      } else if (data.maxMentor < data.currMentor) {
        setError("maxMentor", { message: "멘토가 현재 인원 보다 적습니다." });
        return;
      } else if (data.maxMentee < data.currMentee) {
        setError("maxMentee", { message: "멘티가 현재 인원 보다 적습니다." });
        return;
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
        setError("maxPlanner", {
          message: "기획자가 현재 인원 보다 적습니다.",
        });
        return;
      } else if (data.maxDesigner < data.currDesigner) {
        setError("maxPlanner", {
          message: "디자이너가 현재 인원 보다 적습니다.",
        });
        return;
      } else if (data.maxDeveloper < data.currDeveloper) {
        setError("maxPlanner", {
          message: "개발자가 현재 인원 보다 적습니다.",
        });
        return;
      }

      console.log("제출되었습니다.");
      // setIsModifying(true);
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
      content: data.content,
    };
    if (id) {
      console.log(newData, "new");
      await updatePost(+id, newData);

      refetch();
    }

    setIsModifying(false);
  };

  return (
    <>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          {isPostDeleteModal && <PostDeleteModal postId={data?.id} />}
          <div className=" w-[1470px] flex">
            <span className="min-w-[100px] py-[62px]  border-gray-300  flex justify-end">
              <Link to="/post" className=" mr-[40px] h-[30px]">
                <i className="fa-solid fa-arrow-left  text-[23px]"></i>
              </Link>
            </span>

            <form onSubmit={handleSubmit(onValid as any)} className="w-full ">
              <header className=" pt-[55px] text-[25px] font-semibold flex">
                {isModifying ? (
                  <>
                    <input
                      type="text"
                      className="w-[400px] h-[40px] px-[15px] bg-[#eeeeee]"
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
                    <AnimatePresence>
                      {(formState.errors.title?.message as string) && (
                        <motion.div
                          variants={ValidationVariant}
                          className="text-xs my-auto mx-5 bottom-[-20px] left-[100px]"
                          initial="hidden"
                          animate="showing"
                          exit="exit"
                        >
                          * {formState.errors.title?.message as string}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <>{data?.title}</>
                )}
              </header>

              <div className="flex justify-between ">
                <WriteInfoBox className="flex items-center">
                  <WriteInfo className="">작성자</WriteInfo>
                  <WriteInfo className="mr-[40px] text-gray-500">
                    {data?.writer}
                  </WriteInfo>
                  <WriteInfo>작성일</WriteInfo>
                  <WriteInfo className="text-gray-500">
                    {/* {data?.postStart.getFullYear()} /{" "}
                    {(data?.postStart.getMonth() + 1) + "").padStart(
                      2,
                      "0"
                    )}{" "}
                    /{" "}
                    {(new Date(data?.postStart).getDate() + "").padStart(
                      2,
                      "0"
                    )} */}
                    {getValues("postStart")}
                  </WriteInfo>
                </WriteInfoBox>

                <div className="flex items-center w-[100px] justify-between">
                  {register("varified") && (
                    <>
                      {isModifying ? (
                        <button
                          id="modify"
                          className="w-[70px] text-gray-500 rounded-full"
                        >
                          <i className="fa-solid fa-check text-[30px] text-green-600"></i>
                        </button>
                      ) : (
                        <button
                          id="modify"
                          onClick={onBtnClick}
                          className="w-[70px] text-gray-500 rounded-full"
                        >
                          <i className="fa-regular fa-pen-to-square text-[30px]"></i>
                        </button>
                      )}

                      <button
                        id="delete"
                        onClick={onBtnClick}
                        className="w-[70px]  text-red-400  rounded-full"
                      >
                        <i className="fa-regular fa-trash-can text-[30px]"></i>
                      </button>
                    </>
                  )}
                </div>
              </div>
              <Grid>
                <GridItem>
                  <ItemTitle>모집 기간</ItemTitle>
                  <ItemText className="text-[18px]">
                    <>
                      {/* {new Date(data?.postStart).getFullYear()} /{" "}
                      {(new Date(data?.postStart).getMonth() + 1 + "").padStart(
                        2,
                        "0"
                      )}{" "}
                      /{" "}
                      {(new Date(data?.postStart).getDate() + "").padStart(
                        2,
                        "0"
                      )} */}
                      {getValues("postStart")}
                    </>
                  </ItemText>
                  <ItemText className="mx-[10px] ml-[20px]">~</ItemText>
                  <ItemText>
                    <ItemText>
                      {isModifying ? (
                        <div className="flex">
                          <input
                            type="date"
                            className="px-[10px] text-[18px] w-[170px]"
                            {...register("postEnd", {
                              required: "필수 항목",
                            })}
                            // defaultValue={`${new Date(
                            //   data?.postEnd
                            // ).getFullYear()}-${(
                            //   new Date(data?.postEnd).getMonth() +
                            //   1 +
                            //   ""
                            // ).padStart(2, "0")}-${(
                            //   new Date(data?.postEnd).getDate() + ""
                            // ).padStart(2, "0")}`}
                          ></input>
                          <AnimatePresence>
                            {(formState.errors.postEnd?.message as string) && (
                              <motion.div
                                variants={ValidationVariant}
                                className="text-xs my-auto ml-[3px]"
                                initial="hidden"
                                animate="showing"
                                exit="exit"
                              >
                                * {formState.errors.postEnd?.message as string}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <>
                          {/* {new Date(data?.postEnd).getFullYear()} /{" "}
                          {(
                            new Date(data?.postEnd).getMonth() +
                            1 +
                            ""
                          ).padStart(2, "0")}{" "}
                          /{" "}
                          {(new Date(data?.postEnd).getDate() + "").padStart(
                            2,
                            "0"
                          )} */}
                          {getValues("postEnd")}
                        </>
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
                            <Styledli>
                              <label htmlFor="currDeveloper">개발자</label>
                              <StyledInputNumber
                                {...register("currDeveloper")}
                                min="0"
                                id="currDeveloper"
                                type="number"
                              />
                            </Styledli>
                            <Styledli>
                              <label htmlFor="currPlanner">기획자</label>
                              <StyledInputNumber
                                {...register("currPlanner", {
                                  required: "필수 사항 입니다.",
                                })}
                                min="0"
                                id="currPlanner"
                                type="number"
                              />
                            </Styledli>
                            <Styledli>
                              <label htmlFor="currDesigner">디자이너</label>
                              <StyledInputNumber
                                {...register("currDesigner")}
                                min="0"
                                id="currDesigner"
                                type="number"
                              />
                            </Styledli>

                            <AnimatePresence>
                              {(formState.errors.currPlanner
                                ?.message as any) && (
                                <motion.li
                                  variants={ValidationVariant}
                                  className="text-xs my-auto"
                                  initial="hidden"
                                  animate="showing"
                                  exit="exit"
                                >
                                  *{" "}
                                  {formState.errors.currPlanner?.message as any}
                                </motion.li>
                              )}
                            </AnimatePresence>
                          </>
                        ) : data?.dtype === "M" ? (
                          <>
                            <Styledli>
                              <label htmlFor="currMentor">멘토</label>
                              <StyledInputNumber
                                {...register("currMentor", {
                                  required: "필수 사항 입니다.",
                                })}
                                min="0"
                                id="currMentor"
                                type="number"
                              />
                            </Styledli>
                            <Styledli>
                              <label htmlFor="currMentee">멘티</label>
                              <StyledInputNumber
                                {...register("currMentee", {
                                  required: "필수 사항 입니다.",
                                })}
                                min="0"
                                id="currMentee"
                                type="number"
                              />
                            </Styledli>

                            <AnimatePresence>
                              {(formState.errors.currMentor
                                ?.message as any) && (
                                <motion.li
                                  variants={ValidationVariant}
                                  className="text-xs my-auto"
                                  initial="hidden"
                                  animate="showing"
                                  exit="exit"
                                >
                                  *{" "}
                                  {formState.errors.currMentor?.message as any}
                                </motion.li>
                              )}
                            </AnimatePresence>
                          </>
                        ) : data?.dtype === "S" ? (
                          <>
                            <Styledli>
                              <label htmlFor="currMember">스터디원</label>
                              <StyledInputNumber
                                {...register("currMember", {
                                  required: "필수 사항입니다.",
                                })}
                                min="0"
                                id="currMember"
                                type="number"
                              />
                            </Styledli>

                            <AnimatePresence>
                              {(formState.errors.currMember
                                ?.message as any) && (
                                <motion.li
                                  variants={ValidationVariant}
                                  className="text-xs my-auto"
                                  initial="hidden"
                                  animate="showing"
                                  exit="exit"
                                >
                                  *{" "}
                                  {formState.errors.currMember?.message as any}
                                </motion.li>
                              )}
                            </AnimatePresence>
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
                        className="px-[10px] text-[18px] w-[165px]"
                        {...register("projectStart", {
                          required: "필수 항목입니다.",
                        })}
                        // defaultValue={`${new Date(
                        //   data?.projectStart
                        // ).getFullYear()}-${(
                        //   new Date(data?.projectStart).getMonth() +
                        //   1 +
                        //   ""
                        // ).padStart(2, "0")}-${(
                        //   new Date(data?.projectStart).getDate() + ""
                        // ).padStart(2, "0")}`}
                      ></input>
                    ) : (
                      <>
                        {/* {new Date(data?.projectStart).getFullYear()} /{" "}
                        {(
                          new Date(data?.projectStart).getMonth() +
                          1 +
                          ""
                        ).padStart(2, "0")}{" "}
                        /{" "}
                        {(new Date(data?.projectStart).getDate() + "").padStart(
                          2,
                          "0"
                        )} */}
                        {getValues("projectStart")}
                      </>
                    )}
                  </ItemText>
                  <ItemText className=" mx-[10px]">~</ItemText>
                  <ItemText>
                    {isModifying ? (
                      <div className="flex">
                        <input
                          type="date"
                          className="px-[10px] text-[18px] w-[165px]"
                          {...register("projectEnd", {
                            required: "필수 항목 입니다",
                          })}
                          // defaultValue={`${new Date(
                          //   data?.projectEnd
                          // ).getFullYear()}-${(
                          //   new Date(data?.projectEnd).getMonth() +
                          //   1 +
                          //   ""
                          // ).padStart(2, "0")}-${(
                          //   new Date(data?.projectEnd).getDate() + ""
                          // ).padStart(2, "0")}`}
                        ></input>

                        <AnimatePresence>
                          {((formState.errors.projectStart
                            ?.message as string) ||
                            (formState.errors.projectEnd
                              ?.message as string)) && (
                            <motion.div
                              variants={ValidationVariant}
                              className="text-xs my-auto mx-5"
                              initial="hidden"
                              animate="showing"
                              exit="exit"
                            >
                              *{" "}
                              {(formState.errors.projectStart
                                ?.message as string) ||
                                (formState.errors.projectEnd
                                  ?.message as string)}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <>
                        {/* {new Date(data?.projectEnd).getFullYear()} /{" "}
                        {(
                          new Date(data?.projectEnd).getMonth() +
                          1 +
                          ""
                        ).padStart(2, "0")}{" "}
                        /{" "}
                        {(new Date(data?.projectEnd).getDate() + "").padStart(
                          2,
                          "0"
                        )} */}
                        {getValues("projectEnd")}
                      </>
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
                            <Styledli>
                              <label htmlFor="maxDeveloper">개발자</label>
                              <StyledInputNumber
                                {...register("maxDeveloper")}
                                min="0"
                                id="maxDeveloper"
                                type="number"
                              />
                            </Styledli>
                            <Styledli>
                              <label htmlFor="maxPlanner">기획자</label>
                              <StyledInputNumber
                                {...register("maxPlanner", {
                                  required: "필수 사항 입니다.",
                                })}
                                min="0"
                                id="maxPlanner"
                                type="number"
                              />
                            </Styledli>
                            <Styledli>
                              <label htmlFor="maxDesigner">디자이너</label>
                              <StyledInputNumber
                                {...register("maxDesigner")}
                                min="0"
                                id="maxDesigner"
                                type="number"
                              />
                            </Styledli>

                            <AnimatePresence>
                              {((formState.errors.maxPlanner?.message as any) ||
                                (formState.errors.maxDeveloper
                                  ?.message as any) ||
                                (formState.errors.maxDesigner
                                  ?.message as any)) && (
                                <motion.li
                                  variants={ValidationVariant}
                                  className="text-xs my-auto"
                                  initial="hidden"
                                  animate="showing"
                                  exit="exit"
                                >
                                  *{" "}
                                  {(formState.errors.maxPlanner
                                    ?.message as any) ||
                                    (formState.errors.maxDeveloper
                                      ?.message as any) ||
                                    (formState.errors.maxDesigner
                                      ?.message as any)}
                                </motion.li>
                              )}
                            </AnimatePresence>
                          </>
                        ) : data?.dtype === "M" ? (
                          <>
                            <Styledli>
                              <label htmlFor="maxMentor">멘토</label>
                              <StyledInputNumber
                                {...register("maxMentor", {
                                  required: "필수 사항 입니다.",
                                })}
                                min="0"
                                id="maxMentor"
                                type="number"
                              />
                            </Styledli>
                            <Styledli>
                              <label htmlFor="maxMentee">멘티</label>
                              <StyledInputNumber
                                {...register("maxMentee", {
                                  required: "필수 사항 입니다.",
                                })}
                                min="0"
                                id="maxMentee"
                                type="number"
                              />
                            </Styledli>

                            <AnimatePresence>
                              {((formState.errors.maxMentor?.message as any) ||
                                formState.errors.maxMentee?.message) && (
                                <motion.li
                                  variants={ValidationVariant}
                                  className="text-xs my-auto"
                                  initial="hidden"
                                  animate="showing"
                                  exit="exit"
                                >
                                  *{" "}
                                  {(formState.errors.maxMentor
                                    ?.message as any) ||
                                    formState.errors.maxMentee?.message}
                                </motion.li>
                              )}
                            </AnimatePresence>
                          </>
                        ) : data?.dtype === "S" ? (
                          <>
                            <Styledli>
                              <label htmlFor="maxMember">스터디원</label>
                              <StyledInputNumber
                                {...register("maxMember", {
                                  required: "필수 사항입니다.",
                                })}
                                min="0"
                                id="maxMember"
                                type="number"
                              />
                            </Styledli>

                            <AnimatePresence>
                              {(formState.errors.maxMember?.message as any) && (
                                <motion.li
                                  variants={ValidationVariant}
                                  className="text-xs my-auto"
                                  initial="hidden"
                                  animate="showing"
                                  exit="exit"
                                >
                                  * {formState.errors.maxMember?.message as any}
                                </motion.li>
                              )}
                            </AnimatePresence>
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
                  <ItemText className="w-full">
                    {isModifying ? (
                      <div className="flex">
                        <input
                          {...register("contact", {
                            required: "필수 항목입니다.",
                          })}
                          placeholder="ex) 전화 번호 , 이메일 , 카톡 아이디 등"
                          type="text"
                          className=" w-[350px] h-[30px] bg-[#eeeeee] px-[15px] text-[17px]"
                          maxLength={30}
                        ></input>
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
              <div className="min-h-[500px]  pt-[50px] pb-[100px] border-b-2 border-gray-300 ">
                {isModifying ? (
                  <textarea
                    {...register("content", {
                      minLength: {
                        value: 5,
                        message: "내용이 너무 짧습니다.",
                      },
                    })}
                    className="min-h-[500px] w-full p-[15px] bg-[#eeeeee]"
                    placeholder="자유롭게 작성 해주세요 !"
                  ></textarea>
                ) : (
                  <>{data?.content}</>
                )}
              </div>
              {isModifying && (
                <button className=" w-[130px] h-[30px] text-white bg-black mt-[30px] mb-[10px] float-right">
                  수정하기
                </button>
              )}
            </form>

            <div className=" border-gray-300 min-w-[100px] "></div>
          </div>
        </>
      )}
    </>
  );
}

export default Detail;
