import tw from "tailwind-styled-components";
import React from "react";
import { IPost, posts, readOnePost } from "api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

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

w-[130px]
`;

const ItemText = tw.p`
text-[20px] 
font-medium
`;

const WriteInfoBox = tw.div`
flex 
px-[40px] 
py-[20px]
`;

const WriteInfo = tw.p`

text-[17px]
mr-[10px]
text-gray-400
mb-[20px]
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

  return (
    <>
      {!isLoading ? (
        <div className="flex relative justify-center flex-col">
          <span className="absolute top-[55px] left-[80px] flex items-center">
            <i className="fa-solid fa-arrow-left mr-9 text-[23px]"></i>
          </span>
          postStartWri
          <div className="mx-auto w-[1200px]  h-full ">
            <header className=" mt-[6px] py-[20px]  text-[22px] border-gray-300">
              {detailPost.title}
            </header>
            <div className="flex items-center">
              <WriteInfo className="">작성자</WriteInfo>
              <WriteInfo className="mr-[40px] text-gray-500">
                {detailPost.writer}
              </WriteInfo>
              <WriteInfo>작성일</WriteInfo>
              <WriteInfo className="text-gray-500">
                {new Date(detailPost.postStart).getFullYear()} /{" "}
                {(new Date(detailPost.postStart).getMonth() + 1 + "").padStart(
                  2,
                  "0"
                )}{" "}
                /{" "}
                {(new Date(detailPost.postStart).getDate() + "").padStart(
                  2,
                  "0"
                )}
              </WriteInfo>
            </div>
            <Grid>
              <GridItem>
                <ItemTitle>모집 기간</ItemTitle>
                <ItemText>
                  {new Date(detailPost.postStart).getFullYear()} /{" "}
                  {(
                    new Date(detailPost.postStart).getMonth() +
                    1 +
                    ""
                  ).padStart(2, "0")}
                  /{" "}
                  {(new Date(detailPost.postStart).getDate() + "").padStart(
                    2,
                    "0"
                  )}
                </ItemText>
                <ItemText className=" mx-[10px]">~</ItemText>
                <ItemText>
                  <ItemText>
                    {new Date(detailPost.postEnd).getFullYear()} /{" "}
                    {(
                      new Date(detailPost.postEnd).getMonth() +
                      1 +
                      ""
                    ).padStart(2, "0")}
                    /{" "}
                    {(new Date(detailPost.postEnd).getDate() + "").padStart(
                      2,
                      "0"
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
                        개발자 {detailPost.maxMentor}명 ,&nbsp;
                      </ItemText>
                    )}
                    {detailPost.maxMentee !== 0 && (
                      <ItemText>
                        기획자 {detailPost.maxMentee}명 ,&nbsp;
                      </ItemText>
                    )}
                  </>
                ) : (
                  <>
                    {detailPost.maxMember !== 0 && (
                      <ItemText>
                        개발자 {detailPost.maxMember}명 ,&nbsp;
                      </ItemText>
                    )}
                  </>
                )}
              </GridItem>
              <GridItem>
                <ItemTitle>프로젝트 기간</ItemTitle>
                <ItemText>
                  {new Date(detailPost.projectStart).getFullYear()} /{" "}
                  {(
                    new Date(detailPost.projectStart).getMonth() +
                    1 +
                    ""
                  ).padStart(2, "0")}
                  /{" "}
                  {(new Date(detailPost.projectStart).getDate() + "").padStart(
                    2,
                    "0"
                  )}
                </ItemText>
                <ItemText className=" mx-[10px]">~</ItemText>
                <ItemText>
                  {new Date(detailPost.projectEnd).getFullYear()} /{" "}
                  {(
                    new Date(detailPost.projectEnd).getMonth() +
                    1 +
                    ""
                  ).padStart(2, "0")}
                  /{" "}
                  {(new Date(detailPost.projectEnd).getDate() + "").padStart(
                    2,
                    "0"
                  )}
                </ItemText>
              </GridItem>
              <GridItem>
                <ItemTitle>보수 유무</ItemTitle>
                {detailPost.hasPay ? (
                  <ItemText>Yes</ItemText>
                ) : (
                  <ItemText>No</ItemText>
                )}
              </GridItem>
              <GridItem>
                <ItemTitle>연락수단</ItemTitle>
                <ItemText>{detailPost.contact}</ItemText>
              </GridItem>
            </Grid>
            <div className="min-h-[600px] px-[40px] py-[20px] ">
              {detailPost.content}
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

export default Detail;
