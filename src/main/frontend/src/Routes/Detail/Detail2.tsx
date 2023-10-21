import tw from "tailwind-styled-components";
import "./css/heading.css";
import React, { useEffect, useState } from "react";
import {
  IClosePost,
  IReadOnePost,
  IUpdatePost,
  loginCheckApi,
  readOnePost,
  updatePost,
} from "api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

import { useRecoilState, useSetRecoilState } from "recoil";
import { isLoginState, isPostDeleteModalState } from "components/atom";
import PostDeleteModal from "Routes/Detail/PostDeleteModal";

import { AxiosError, AxiosResponse } from "axios";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { Link } from "react-router-dom";
import Heart from "components/Heart";
import Soon from "components/Soon";
import { ImageModal } from "./ImageModal";
import { Helmet } from "react-helmet";
import LoadingLottie from "components/LoadingLottie";
import Outline from "components/Outline";

const Container = tw.div`
w-[1470px]
min-h-[800px]
flex
`;
const GoBackSpan = tw.span`
md:min-w-[100px] py-[62px] border-gray-300  flex justify-end
`;

const GoBackButton = tw.button`
md:mr-[40px] mr-[10px] h-[30px]`;

const GoBackIcon = tw.i`
fa-solid fa-arrow-left text-[18px] md:text-[23px]
`;

const Form = tw.div`
w-full
`;
const FormHeader = tw.header`
pt-[62px] md:pt-[55px] flex items-center justify-between `;

const FormTitle = tw.div`
text-[20px] md:text-[25px] font-semibold 
font-main
`;

const FormAuthorNButtonRow = tw.div`
flex justify-between
`;

const Grid = tw.div`
grid 
md:grid-cols-2  
grid-cols-1
border-gray-300 


items-center
w-full
`;

const GridItem = tw.div`
flex 
mb-[20px]
items-start



`;

const ItemTitle = tw.span`
text-[#757575] 

text-[18px]
min-w-[140px]
font-unique
`;

const ItemText = tw.span`
text-[16px]
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
const WriteInfo = tw.span`
text-[13px]
md:text-[17px]

md:w-auto
mr-[20px]
text-gray-400
h-[20px]
md:h-auto
`;

function Detail2() {
  const { id } = useParams();
  const datetimeToString = (datetime: Date) => {
    if (!datetime) return "상시 모집";
    return `${new Date(datetime).getFullYear()}-${(
      new Date(datetime).getMonth() +
      1 +
      ""
    ).padStart(2, "0")}-${(new Date(datetime).getDate() + "").padStart(
      2,
      "0"
    )}`;
  };

  const { isLoading, data, refetch } = useQuery<IReadOnePost>(
    ["readOnePost", id],
    () => readOnePost(+(id as any)),
    {
      onSuccess: (data) => {
        // console.log("모집글 하나 읽어오기 성공 : ", data);
      },
      onError: () => {
        alert("존재하지 않는 게시물입니다.");
        navigate(-1);
      },
    }
  );

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
      setIsModifying(true);
    }
  };

  const [isModifying, setIsModifying] = useState(false);

  const navigate = useNavigate();

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

  const [isImageModal, setIsImageModal] = useState<boolean>(false);
  const [clickedPosterSrc, setClickedPosterSrc] = useState("");
  const onImageModalClick = () => {
    setIsImageModal(false);
  };
  return (
    <>
      {isLoading || isLoginCheckLoading ? (
        <LoadingLottie isPost={false} />
      ) : (
        <>
          <Helmet>
            <title>{data?.title}</title>
          </Helmet>
          {isImageModal && (
            <ImageModal
              ImageSrc={clickedPosterSrc}
              onClick={onImageModalClick}
            />
          )}

          {isPostDeleteModal && <PostDeleteModal postId={data?.id} />}
          <Outline>
            <Container>
              <GoBackSpan>
                <GoBackButton onClick={() => navigate(-1)}>
                  <GoBackIcon></GoBackIcon>
                </GoBackButton>
              </GoBackSpan>

              <Form>
                <FormHeader>
                  <div className="flex items-center">
                    <div>
                      {data?.closed && (
                        <div className="px-[20px] py-[4px] rounded-lg text-[18px] mr-[10px] bg-gray-200 ">
                          ✂️ 마감 된 글
                        </div>
                      )}
                    </div>
                    <FormTitle className="mr-[10px]">{data?.title}</FormTitle>
                    <Heart
                      id={data?.id}
                      hasLiked={data?.hasLiked}
                      refetch={refetch}
                    />
                  </div>
                  {/* )} */}
                  {data?.verified && (
                    <div>
                      {!data?.closed && (
                        <button
                          className="px-[25px] py-[4px] rounded-lg mr-[10px] bg-gray-200 "
                          onClick={() => {
                            const newClosedPost: IClosePost = {
                              isClosed: true,
                            };
                            if (window.confirm("마감하시겠습니까?")) {
                              updatePost(
                                Number(id),
                                newClosedPost as IClosePost
                              );
                            }
                          }}
                        >
                          모집 마감
                        </button>
                      )}

                      <Link to={`/modify/${id}`} state={data as IReadOnePost}>
                        <button className="px-[25px] py-[4px] rounded-lg mr-[10px] bg-blue-100 text-blue-500">
                          수정
                        </button>
                      </Link>
                      <button
                        id="delete"
                        onClick={onBtnClick}
                        className="px-[25px] py-[4px] rounded-lg mr-[10px] bg-red-100 text-red-500"
                      >
                        삭제
                      </button>
                      {/* <FormDeleteButton  >
                   <FormDeleteIcon />
                 </FormDeleteButton> */}
                    </div>
                  )}
                </FormHeader>

                <FormAuthorNButtonRow>
                  <FormAuthorSpan className="flex justify-between w-full">
                    <WriterSpan>
                      <WriteInfo>{data?.summary}</WriteInfo>
                    </WriterSpan>

                    <WriterSpan>
                      <WriteInfo className="">
                        <span className=" text-gray-400">작성자</span>
                      </WriteInfo>
                      <WriteInfo className="">
                        <span className="text-gray-600">{data?.author}</span>
                      </WriteInfo>
                      <WriteInfo className="">
                        <span className=" text-gray-400">작성일</span>
                      </WriteInfo>
                      <WriteInfo className="">
                        <span className="text-gray-600">
                          {datetimeToString(data?.createdDate as Date)}
                        </span>
                      </WriteInfo>
                      {/* <WriteInfo className="">
                      <span className="ml-[10px]">
                        {datetimeToString(data?.createdDate as Date)}
                      </span>
                    </WriteInfo> */}
                      <WriteInfo className="">
                        <i className="fa-regular fa-eye mr-[5px]"></i>
                        {data?.views}
                      </WriteInfo>
                      <WriteInfo className="">
                        <i className="fa-regular fa-heart mr-[5px]"></i>
                        {data?.nlike}
                      </WriteInfo>
                    </WriterSpan>
                  </FormAuthorSpan>
                </FormAuthorNButtonRow>

                {/* 요약정보 */}
                <div className="p-[50px] bg-slate-100 rounded-3xl">
                  <Grid>
                    <GridItem>
                      <ItemTitle>모집 기간</ItemTitle>
                      <ItemText>
                        <>{datetimeToString(data?.recruitStart as Date)}</>
                      </ItemText>
                      <ItemText className="mx-[10px]">~</ItemText>
                      <ItemText>
                        <ItemText className="text-blue-500">
                          {/* 수정과 벨리데이션 */}

                          {datetimeToString(data?.recruitEnd as Date)}

                          {/* )} */}
                          <Soon
                            recruitStart={data?.recruitStart}
                            recruitEnd={data?.recruitEnd}
                            closed={data?.closed}
                          />
                        </ItemText>
                      </ItemText>
                    </GridItem>
                    <GridItem>
                      <ItemTitle>학년</ItemTitle>

                      <ItemText className="text-blue-500">
                        {data?.years.length === 0
                          ? "학년 무관"
                          : data?.years.map((year) => year + " ")}
                      </ItemText>
                    </GridItem>
                    <GridItem>
                      <ItemTitle>모집 인원</ItemTitle>
                      {data?.targetCount ? (
                        <ItemText>{data?.targetCount}</ItemText>
                      ) : (
                        <ItemText>인원 제한 없음</ItemText>
                      )}
                    </GridItem>
                    <GridItem>
                      <ItemTitle>전공</ItemTitle>
                      <ItemText className="text-blue-500">
                        {data?.departments.length === 0
                          ? "전공 무관"
                          : data?.departments.map(
                              (department) => department + " "
                            )}
                      </ItemText>
                    </GridItem>

                    {data?.contact && (
                      <GridItem>
                        <ItemTitle>신청 경로</ItemTitle>
                        <a
                          href={`${data?.contact}`}
                          className=" text-[15px] font-bold underline"
                          target="_blank"
                        >
                          {data.contact.length > 45
                            ? data?.contact.slice(0, 45) + "..."
                            : data?.contact}
                        </a>
                      </GridItem>
                    )}

                    {data?.duration && (
                      <GridItem>
                        <ItemTitle>활동 기간</ItemTitle>

                        <ItemText>{data?.duration}</ItemText>
                      </GridItem>
                    )}

                    {data?.contactDetails && (
                      <GridItem>
                        <ItemTitle>신청 방법</ItemTitle>
                        <ItemText className="pr-[40px]">
                          {data?.contactDetails}
                        </ItemText>
                      </GridItem>
                    )}

                    {data?.qualifications && (
                      <GridItem>
                        <ItemTitle>지원 자격</ItemTitle>

                        <ItemText>{data?.qualifications}</ItemText>
                      </GridItem>
                    )}
                  </Grid>
                </div>
                {/* 키워드들 */}

                <div className="my-[30px]">
                  {data?.postTypes.map((postType, index) => (
                    <button
                      key={index}
                      className="bg-blue-200 py-[5px] px-[15px] rounded-lg mx-[5px]"
                    >
                      {postType}
                    </button>
                  ))}
                  {data?.keywords.map(
                    (keyword: string, index: number) =>
                      data?.postTypes.indexOf(keyword) === -1 && (
                        <button
                          className="bg-blue-100 py-[5px] px-[15px] rounded-lg mx-[5px] mb-[10px]"
                          key={index}
                        >
                          {keyword}
                        </button>
                      )
                  )}
                </div>

                {/* <div className="flex justify-start mb-[50px]">
                {data?.posterPaths?.map((posterPath: string, index: number) => (
                  <img
                    className="w-[100px] mr-[30px]"
                    key={index}
                    src={posterPath}
                    alt="poster"
                    onClick={async () => {
                      await setClickedPosterSrc(posterPath);
                      setIsImageModal(true);
                      window.scrollTo(0, 200);
                    }}
                  />
                ))}
              </div> */}

                {data?.content !== "" && (
                  <>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data?.content as string,
                      }}
                      className="p-[50px] bg-gray-100 rounded-3xl leading-8"
                    ></div>
                  </>
                )}

                {/* <div dangerouslySetInnerHTML={{ __html: editorString }}></div> */}

                <div className="flex justify-start mt-[30px] gap-x-[30px]">
                  {data?.posterPaths?.map(
                    (posterPath: string, index: number) => (
                      <img
                        className="w-[300px] border-2 border-gray-300"
                        key={index}
                        src={posterPath}
                        alt="poster"
                        onClick={async () => {
                          await setClickedPosterSrc(posterPath);
                          setIsImageModal(true);
                          window.scrollTo(0, 200);
                        }}
                      />
                    )
                  )}
                </div>
              </Form>

              <div className="min-w-[40px] md:min-w-[100px] "></div>
            </Container>
          </Outline>
        </>
      )}
    </>
  );
}

export default Detail2;
