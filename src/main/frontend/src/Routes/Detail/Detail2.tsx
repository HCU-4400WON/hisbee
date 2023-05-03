import tw from "tailwind-styled-components";
import "./css/heading.css";
import React, { useEffect, useState } from "react";
import {
  IPost,
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
import {
  converter,
  PostDetailExample,
  PostExamples,
} from "Routes/PostAddForm/components/PostExamples";
import { AnimatePresence, DragControls } from "framer-motion";
import { Link } from "react-router-dom";
import Heart from "components/Heart";
import Soon from "components/Soon";
import { ImageModal } from "./ImageModal";

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

const Form = tw.div`
w-full
`;
const FormHeader = tw.header`
pt-[62px] md:pt-[55px] flex items-center justify-between `;

const FormTitleInput = tw.input`
w-[400px] 
md:h-[40px] 
h-[35px] 
px-[15px] 
bg-[#eeeeee]
`;

const FormTitle = tw.div`
text-[20px] md:text-[25px] font-semibold 
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
border-gray-300 
p-[50px]

items-center
w-full
`;

const GridItem = tw.div`
flex 
mb-[20px]
items-start
h-[40px]

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
function Detail2() {
  const [editorString, setEditorString] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const { id } = useParams();
  const datetimeToString = (datetime: Date) => {
    return `${new Date(datetime).getFullYear()}-${(
      new Date(datetime).getMonth() +
      1 +
      ""
    ).padStart(2, "0")}-${(new Date(datetime).getDate() + "").padStart(
      2,
      "0"
    )}`;
  };

  const { isLoading, data, refetch, isSuccess } = useQuery<IReadOnePost>(
    ["readOnePost", id],
    () => readOnePost(+(id as any)),
    {
      onSuccess: (data) => {
        console.log("모집글 하나 읽어오기 성공 : ", data);

        // if (!data?.content) data.content= EditorState.createEmpty();
        // const contentDraft = htmlToDraft(data?.content);
        // const { contentBlocks, entityMap } = contentDraft;
        // const contentState = ContentState.createFromBlockArray(
        //   contentBlocks,
        //   entityMap
        // );
        // data.content = EditorState.createWithContent(contentState);
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
    console.log(file);
    let newImage: any;

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

  // interface Iconverter {
  //   [maxDeveloper: string]: string;
  //   maxPlanner: string;
  //   maxDesigner: string;
  //   maxMentor: string;
  //   maxMentee: string;
  // }
  // const converter: Iconverter = {
  //   maxDeveloper: "개발자",
  //   maxPlanner: "기획자",
  //   maxDesigner: "디자이너",
  //   maxMentor: "멘토",
  //   maxMentee: "멘티",
  //   currDeveloper: "개발자",
  //   currPlanner: "기획자",
  //   currDesigner: "디자이너",
  //   currMentor: "멘토",
  //   currMentee: "멘티",
  // };
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

  const [isImageModal, setIsImageModal] = useState<boolean>(false);
  const [clickedPosterSrc, setClickedPosterSrc] = useState("");
  const onImageModalClick = () => {
    setIsImageModal(false);
  };
  const dataExample = PostDetailExample;

  return (
    <>
      {isLoading || isLoginCheckLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          {isImageModal && (
            <ImageModal
              ImageSrc={clickedPosterSrc}
              onClick={onImageModalClick}
            />
          )}

          {isPostDeleteModal && <PostDeleteModal postId={data?.id} />}
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
                <div>
                  {!data?.closed && (
                    <button
                      className="px-[25px] py-[4px] rounded-lg mr-[10px] bg-gray-200 "
                      onClick={() => {
                        const newClosedPost: IUpdatePost = {
                          isClosed: true,
                        };
                        if (window.confirm("마감하시겠습니까?")) {
                          console.log("!!");
                          updatePost(Number(id), newClosedPost);
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
              </FormHeader>

              <FormAuthorNButtonRow>
                <FormAuthorSpan className="flex justify-between w-full">
                  <WriterSpan>
                    <WriteInfo>{data?.summary}</WriteInfo>
                  </WriterSpan>

                  <WriterSpan>
                    <WriteInfo className="">
                      <span className="mx-[10px] text-gray-600">
                        {data?.author}
                      </span>
                    </WriteInfo>
                    <WriteInfo className="">
                      <span className="ml-[10px]">
                        {datetimeToString(data?.createdDate as Date)}
                      </span>
                    </WriteInfo>
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
              <div className="bg-slate-100 rounded-3xl">
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
                        href="http://google.com"
                        className="md:w-full w-[200px] text-[13px] md:text-[17px] font-bold underline"
                      >
                        {data?.contact}
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

              <div className="m-[30px] mb-[60px] px-[50px]">
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

              <div className="flex justify-start mb-[50px]">
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
              </div>

              {data?.content !== "" && (
                <>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data?.content as string,
                    }}
                    className="p-[50px] bg-gray-100 rounded-3xl "
                  ></div>
                </>
              )}

              {/* <div dangerouslySetInnerHTML={{ __html: editorString }}></div> */}
              <div className="flex justify-evenly mt-[50px]">
                {data?.posterPaths?.map((posterPath: string, index: number) => (
                  <img
                    className="w-[400px]"
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
              </div>
            </Form>

            <div className="min-w-[40px] md:min-w-[100px] "></div>
          </Container>
        </>
      )}
    </>
  );
}

export default Detail2;
