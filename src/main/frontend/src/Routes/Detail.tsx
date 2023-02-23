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
h-[200px] 
py-[20px] 
items-center
`;

const GridItem = tw.div`
flex 
items-center 
h-[30px] 

`;

const ItemTitle = tw.span`
text-[#757575] 
text-[20px] 
min-w-[140px]
`;

const ItemText = tw.span`
text-[20px] 
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

  const { isLoading, data, refetch } = useQuery<IPost>(
    ["detailPost", id],
    () => readOnePost(+(id as any)),
    {
      onSuccess: (data) => {
        setValue("dtype", data.dtype);
        setValue("mentor", data.maxMentor + "");
        setValue("mentee", data.maxMentee + "");
        setValue("member", data.maxMember + "");
        setValue("planner", data.maxPlanner + "");
        setValue("developer", data.maxDeveloper + "");
        setValue("designer", data.maxDesigner + "");
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
    defaultValues: {
      mentor: "0",
      mentee: "0",
      member: "0",
      dtype: "",
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

  interface IData {
    mentor: string;
    mentee: string;
    member: string;
    dtype?: string;
    projectStart: string | Date;
    projectEnd: string | Date;
    postStart: string | Date;
    postEnd: string | Date;
    contact: string;
    developer: string;
    planner: string;
    designer: string;
    pay: string;
    title: string;
    content: string;
  }

  // console.log("Debug ", data);
  // console.log("!!", new Date(data?.postStart as any));
  const detailPost: IPost = data as any;

  // const detailPost = posts[+(id as any)];

  // console.log(detailPost);

  const [isPostDeleteModal, setIsPostDeleteModal] = useRecoilState(
    isPostDeleteModalState
  );

  const onBtnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { id },
    } = event;

    if (id === "delete") {
      setIsPostDeleteModal(true);
    } else if (id === "modify") {
      setIsModifying(true);
    }
  };

  const [isModifying, setIsModifying] = useState(false);

  const onModifyClick = () => {
    const data = {};
    //  모집 인원 부분 모집 유형에 따라 변하도록
    //  state useForm으로 채우기
    //  마지막 refetch... validation... api...

    setIsModifying(false);

    // updatePost(detailPost.id, data);
  };

  const navigate = useNavigate();
  const onValid = async (data: IData) => {
    console.log(data);

    if (data.projectStart >= data.projectEnd) {
      setError("projectEnd", { message: "마감일이 이릅니다." });
      return;
    }
    if (data.postStart >= data.postEnd) {
      setError("postEnd", { message: "마감일이 이릅니다." });
      return;
    }

    if (data.dtype === "S") {
      if (data.member === "0") {
        setError("member", { message: "0보다 커야 합니다." });
        return;
      }
    } else if (data.dtype === "M") {
      if (Number(data.mentor) + Number(data.mentee) === 0) {
        setError("mentor", { message: "0보다 커야 합니다." });
        return;
      }
    } else if (data.dtype === "P") {
      if (
        Number(data.developer) +
          Number(data.planner) +
          Number(data.designer) ===
        0
      ) {
        setError("planner", { message: "0보다 커야 합니다." });
        return;
      }
    }

    const newData: any = {
      maxMentor: +data.mentor,
      maxMentee: +data.mentee,
      maxMember: +data.member,
      maxDeveloper: +data.developer,
      maxDesigner: +data.designer,
      maxPlanner: +data.planner,

      currMentor: +data.mentor,
      currMentee: +data.mentee,
      currMember: +data.member,
      currDeveloper: +data.developer,
      currPlanner: +data.planner,
      currDesigner: +data.designer,
      dtype: data.dtype,
      projectStart: new Date(data.projectStart),
      projectEnd: new Date(data.projectEnd),
      postStart: new Date(data.postStart),
      postEnd: new Date(data.postEnd),
      contact: data.contact,
      pay: data.pay,
      title: data.title,
      content: data.content,
    };
    if (id) {
      console.log(newData);
      await updatePost(+id, newData);
      refetch();
    }

    setIsModifying(false);
  };

  return (
    <>
      {!isLoading ? (
        <>
          {isPostDeleteModal && <PostDeleteModal postId={detailPost.id} />}
          <div className="flex relative">
            <span className="w-[140px] py-[62px]  border-gray-300  flex justify-end">
              <Link to="/post" className=" mr-[40px] h-[30px]">
                <i className="fa-solid fa-arrow-left  text-[23px]"></i>
              </Link>
            </span>

            <form onSubmit={handleSubmit(onValid)} className="min-w-[1200px] ">
              <header className="pt-[50px] text-[30px] ">
                {isModifying ? (
                  <input
                    type="text"
                    className="w-[400px] h-[40px] px-[15px] bg-[#eeeeee]"
                    {...register("title", {
                      minLength: {
                        value: 3,
                        message: "제목이 너무 짧습니다.",
                      },
                    })}
                  />
                ) : (
                  <>{detailPost.title}</>
                )}
              </header>

              <div className="flex justify-between ">
                <WriteInfoBox className="flex items-center">
                  <WriteInfo className="">작성자</WriteInfo>
                  <WriteInfo className="mr-[40px] text-gray-500">
                    {detailPost.writer}
                  </WriteInfo>
                  <WriteInfo>작성일</WriteInfo>
                  <WriteInfo className="text-gray-500">
                    {new Date(detailPost.postStart).getFullYear()} /{" "}
                    {(
                      new Date(detailPost.postStart).getMonth() +
                      1 +
                      ""
                    ).padStart(2, "0")}{" "}
                    /{" "}
                    {(new Date(detailPost.postStart).getDate() + "").padStart(
                      2,
                      "0"
                    )}
                  </WriteInfo>
                </WriteInfoBox>
                <div className="flex items-center w-[100px] justify-between">
                  {isModifying ? (
                    <button
                      id="modify"
                      type="button"
                      onClick={onModifyClick}
                      className="w-[70px]   text-gray-500 rounded-full"
                    >
                      <i className="fa-solid fa-check text-[30px] text-green-600"></i>
                    </button>
                  ) : (
                    <button
                      id="modify"
                      onClick={onBtnClick}
                      className="w-[70px]   text-gray-500 rounded-full"
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
                </div>
              </div>
              <Grid>
                <GridItem>
                  <ItemTitle>모집 기간</ItemTitle>
                  <ItemText>
                    <>
                      {new Date(detailPost.postStart).getFullYear()} /{" "}
                      {(
                        new Date(detailPost.postStart).getMonth() +
                        1 +
                        ""
                      ).padStart(2, "0")}{" "}
                      /{" "}
                      {(new Date(detailPost.postStart).getDate() + "").padStart(
                        2,
                        "0"
                      )}
                    </>
                  </ItemText>
                  <ItemText className=" mx-[10px]">~</ItemText>
                  <ItemText>
                    <ItemText>
                      {isModifying ? (
                        <input
                          type="date"
                          {...register("postEnd", {
                            required: "필수 항목입니다.",
                          })}
                          defaultValue={`${new Date(
                            detailPost.postEnd
                          ).getFullYear()}-${(
                            new Date(detailPost.postEnd).getMonth() +
                            1 +
                            ""
                          ).padStart(2, "0")}-${(
                            new Date(detailPost.postEnd).getDate() + ""
                          ).padStart(2, "0")}`}
                        ></input>
                      ) : (
                        <>
                          {new Date(detailPost.postEnd).getFullYear()} /{" "}
                          {(
                            new Date(detailPost.postEnd).getMonth() +
                            1 +
                            ""
                          ).padStart(2, "0")}{" "}
                          /{" "}
                          {(
                            new Date(detailPost.postEnd).getDate() + ""
                          ).padStart(2, "0")}
                        </>
                      )}
                    </ItemText>
                  </ItemText>
                </GridItem>
                <GridItem>
                  <ItemTitle>모집 유형</ItemTitle>

                  <ItemText>
                    {detailPost.dtype === "P"
                      ? "프로젝트"
                      : detailPost.dtype === "S"
                      ? "스터디"
                      : "멘토링"}
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
                        ) : data?.dtype === "M" ? (
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
                        ) : data?.dtype === "S" ? (
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
                    </>
                  ) : (
                    <>
                      {detailPost.dtype === "P" ? (
                        <>
                          {detailPost.maxDeveloper !== 0 && (
                            <ItemText>
                              개발자 {detailPost.maxDeveloper}명 &nbsp;
                            </ItemText>
                          )}
                          {detailPost.maxPlanner !== 0 && (
                            <ItemText>
                              기획자 {detailPost.maxPlanner}명 &nbsp;
                            </ItemText>
                          )}
                          {detailPost.maxDesigner !== 0 && (
                            <ItemText>
                              디자이너 {detailPost.maxDesigner}명
                            </ItemText>
                          )}
                        </>
                      ) : detailPost.dtype === "M" ? (
                        <>
                          {detailPost.maxMentor !== 0 && (
                            <ItemText>
                              멘토 {detailPost.maxMentor}명 &nbsp;
                            </ItemText>
                          )}
                          {detailPost.maxMentee !== 0 && (
                            <ItemText>
                              멘티 {detailPost.maxMentee}명 &nbsp;
                            </ItemText>
                          )}
                        </>
                      ) : (
                        <>
                          {detailPost.maxMember === 0 && (
                            <ItemText>
                              스터디원 {detailPost.maxMember}명&nbsp;
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
                        {...register("projectStart", {
                          required: "필수 항목입니다.",
                        })}
                        defaultValue={`${new Date(
                          detailPost.projectStart
                        ).getFullYear()}-${(
                          new Date(detailPost.projectStart).getMonth() +
                          1 +
                          ""
                        ).padStart(2, "0")}-${(
                          new Date(detailPost.projectStart).getDate() + ""
                        ).padStart(2, "0")}`}
                      ></input>
                    ) : (
                      <>
                        {new Date(detailPost.projectStart).getFullYear()} /{" "}
                        {(
                          new Date(detailPost.projectStart).getMonth() +
                          1 +
                          ""
                        ).padStart(2, "0")}{" "}
                        /{" "}
                        {(
                          new Date(detailPost.projectStart).getDate() + ""
                        ).padStart(2, "0")}
                      </>
                    )}
                  </ItemText>
                  <ItemText className=" mx-[10px]">~</ItemText>
                  <ItemText>
                    {isModifying ? (
                      <input
                        type="date"
                        {...register("projectEnd", {
                          required: "필수 항목입니다.",
                        })}
                        defaultValue={`${new Date(
                          detailPost.projectEnd
                        ).getFullYear()}-${(
                          new Date(detailPost.projectEnd).getMonth() +
                          1 +
                          ""
                        ).padStart(2, "0")}-${(
                          new Date(detailPost.projectEnd).getDate() + ""
                        ).padStart(2, "0")}`}
                      ></input>
                    ) : (
                      <>
                        {new Date(detailPost.projectEnd).getFullYear()} /{" "}
                        {(
                          new Date(detailPost.projectEnd).getMonth() +
                          1 +
                          ""
                        ).padStart(2, "0")}{" "}
                        /{" "}
                        {(
                          new Date(detailPost.projectEnd).getDate() + ""
                        ).padStart(2, "0")}
                      </>
                    )}
                  </ItemText>
                </GridItem>
                <GridItem>
                  <ItemTitle>보수 유무</ItemTitle>
                  {detailPost.dtype === "S" ? (
                    <ItemText>No</ItemText>
                  ) : isModifying ? (
                    <div>
                      <input
                        {...register("pay", {
                          required: "보수 유무는 필수 항목입니다.",
                        })}
                        id="Yes"
                        className="mr-[10px]"
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
                      {detailPost.hasPay ? (
                        <ItemText>Yes</ItemText>
                      ) : (
                        <ItemText>No</ItemText>
                      )}
                    </>
                  )}
                </GridItem>
                <GridItem>
                  <ItemTitle>연락수단</ItemTitle>
                  <ItemText className="w-full">
                    {isModifying ? (
                      <input
                        {...register("contact", {
                          required: "필수 항목입니다.",
                        })}
                        type="text"
                        className=" w-full h-[30px] bg-[#eeeeee] px-[15px]"
                      ></input>
                    ) : (
                      <>{detailPost.contact}</>
                    )}
                  </ItemText>
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
                  ></textarea>
                ) : (
                  <>{detailPost.content}</>
                )}
              </div>
              {isModifying && (
                <button
                  type="button"
                  onClick={onModifyClick}
                  className=" w-[130px] h-[30px] text-white bg-black mt-[30px] mb-[10px] float-right"
                >
                  수정하기
                </button>
              )}
            </form>

            <div className=" border-gray-300 w-[140px]"></div>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

export default Detail;
