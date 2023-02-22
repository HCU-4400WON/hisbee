import tw from "tailwind-styled-components";
import React, { useState } from "react";
import { IPost, posts, readOnePost, updatePost } from "api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { isPostDeleteModalState } from "components/atom";
import PostDeleteModal from "components/PostDeleteModal";

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
w-[140px]
`;

const ItemText = tw.p`
text-[20px] 
font-medium
`;

const WriteInfoBox = tw.div`
flex 

py-[20px]
`;

const WriteInfo = tw.p`

text-[17px]
mr-[20px]
text-gray-400

`;

function Detail() {
  const { id } = useParams();

  const { isLoading, data } = useQuery<IPost>(["detailPost", id], () =>
    readOnePost(+(id as any))
  );

  console.log("Debug ", data);
  console.log("!!", new Date(data?.postStart as any));
  const detailPost: IPost = data as any;

  // const detailPost = posts[+(id as any)];

  console.log(detailPost);

  const [isPostDeleteModal, setIsPostDeleteModal] = useRecoilState(
    isPostDeleteModalState
  );

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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

  return (
    <>
      {!isLoading ? (
        <>
          {isPostDeleteModal && <PostDeleteModal postId={detailPost.id} />}
          <div className="flex relative">
            <span className="w-[140px] py-[62px] border-b-2 border-gray-300  flex justify-end">
              <Link to="/post" className=" mr-[40px] h-[30px]">
                <i className="fa-solid fa-arrow-left  text-[23px]"></i>
              </Link>
            </span>

            <div className="min-w-[1200px] ">
              <header className="pt-[50px] text-[30px] ">
                {isModifying ? (
                  <input
                    type="text"
                    className="w-[400px] h-[40px] px-[10px] bg-[#eeeeee] rounded"
                    defaultValue={detailPost.title}
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
                      onClick={onModifyClick}
                      className="w-[70px]   text-gray-500 rounded-full"
                    >
                      <i className="fa-solid fa-check text-[30px] text-green-600"></i>
                    </button>
                  ) : (
                    <button
                      id="modify"
                      onClick={onClick}
                      className="w-[70px]   text-gray-500 rounded-full"
                    >
                      <i className="fa-regular fa-pen-to-square text-[30px]"></i>
                    </button>
                  )}

                  <button
                    id="delete"
                    onClick={onClick}
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
                    {isModifying ? (
                      <input
                        type="date"
                        defaultValue={`${new Date(
                          detailPost.postStart
                        ).getFullYear()}-${(
                          new Date(detailPost.postStart).getMonth() +
                          1 +
                          ""
                        ).padStart(2, "0")}-${(
                          new Date(detailPost.postStart).getDate() + ""
                        ).padStart(2, "0")}`}
                      ></input>
                    ) : (
                      <>
                        {new Date(detailPost.postStart).getFullYear()} /{" "}
                        {(
                          new Date(detailPost.postStart).getMonth() +
                          1 +
                          ""
                        ).padStart(2, "0")}{" "}
                        /{" "}
                        {(
                          new Date(detailPost.postStart).getDate() + ""
                        ).padStart(2, "0")}
                      </>
                    )}
                  </ItemText>
                  <ItemText className=" mx-[10px]">~</ItemText>
                  <ItemText>
                    <ItemText>
                      {isModifying ? (
                        <input
                          type="date"
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
                    {isModifying ? (
                      <select defaultValue={detailPost.dtype}>
                        <option value="P">프로젝트</option>
                        <option value="S">스터디</option>
                        <option value="M">멘토링</option>
                      </select>
                    ) : (
                      <>
                        {detailPost.dtype === "P"
                          ? "프로젝트"
                          : detailPost.dtype === "S"
                          ? "스터디"
                          : "멘토링"}
                      </>
                    )}
                  </ItemText>
                </GridItem>
                <GridItem>
                  <ItemTitle>모집 인원</ItemTitle>
                  {detailPost.dtype === "P" ? (
                    <>
                      {detailPost.maxDeveloper !== 0 && (
                        <ItemText>
                          개발자 {detailPost.maxDeveloper}명 ,&nbsp;
                        </ItemText>
                      )}
                      {detailPost.maxPlanner !== 0 && (
                        <ItemText>
                          기획자 {detailPost.maxPlanner}명 ,&nbsp;
                        </ItemText>
                      )}
                      {detailPost.maxDesigner !== 0 && (
                        <ItemText>디자이너 {detailPost.maxDesigner}명</ItemText>
                      )}
                    </>
                  ) : detailPost.dtype === "M" ? (
                    <>
                      {detailPost.maxMentor !== 0 && (
                        <ItemText>
                          멘토 {detailPost.maxMentor}명 ,&nbsp;
                        </ItemText>
                      )}
                      {detailPost.maxMentee !== 0 && (
                        <ItemText>
                          멘티 {detailPost.maxMentee}명 ,&nbsp;
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
                </GridItem>
                <GridItem>
                  <ItemTitle>프로젝트 기간</ItemTitle>
                  <ItemText>
                    {isModifying ? (
                      <input
                        type="date"
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
                        id="Yes"
                        className="mr-[10px]"
                        type="radio"
                        name="pay"
                      ></input>
                      <label className="mr-[20px]" htmlFor="Yes">
                        Yes
                      </label>
                      <input
                        id="No"
                        className="mr-[10px]"
                        type="radio"
                        name="pay"
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
                  <ItemText>
                    {isModifying ? (
                      <input
                        type="text"
                        className="w-[370px] h-[30px] bg-[#eeeeee] px-[10px]"
                        defaultValue={detailPost.contact}
                      ></input>
                    ) : (
                      <>{detailPost.contact}</>
                    )}
                  </ItemText>
                </GridItem>
              </Grid>
              <div className="min-h-[500px] px-[40px] pt-[50px] pb-[100px] border-b-2 border-gray-300 ">
                {isModifying ? (
                  <textarea
                    className="min-h-[500px] w-full p-[15px] bg-[#eeeeee]"
                    defaultValue={detailPost?.content}
                  ></textarea>
                ) : (
                  <>{detailPost.content}</>
                )}
                <button
                  onClick={onModifyClick}
                  className=" w-[130px] h-[30px] text-black bg-[#eeeeee] mt-[30px] float-right"
                >
                  수정하기
                </button>
              </div>
            </div>
            <div className="border-b-2 border-gray-300 w-[140px]"></div>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

export default Detail;
