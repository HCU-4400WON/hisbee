import { ICreatePost, IUpdatePost, createPost, updatePost } from "api";
import { IOnSubmitData } from "../interface/Interface";
import { dataConverter } from "./Converter";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router";
import { isAlertModalState } from "components/atom";
import { useRecoilState } from "recoil";

export default function SubmitButton({
  getValues,
  handleSubmit,
  editorState,
  imageURLList,
  state,
}: any) {
  const navigate = useNavigate();

  const [isPostSubmitAlertModal, setIsPostSubmitAlertModal] =
    useRecoilState(isAlertModalState);

  const { mutate: createPostMutate } = useMutation(
    ["createPostMutate" as string],

    (newPost: ICreatePost) => createPost(newPost),

    {
      onSuccess: (data) => {
        setIsPostSubmitAlertModal(true);
      },
      onError: (error) => {
        if (((error as AxiosError).response as AxiosResponse).status === 401) {
          alert("로그인이 필요합니다.");
          // setIsLoginModal(true);
          // setIsLogin(false);
          // if (localStorage.getItem("key")) localStorage.removeItem("key");
          // navigate("/");
        }
      },
    }
  );

  const checkSubmit = () => {
    if (
      getValues("title").length !== 0 &&
      getValues("recruitStart")?.length === 10 &&
      getValues("postTypes").length !== 0 &&
      getValues("contact").length !== 0
    ) {
      return true;
    }
    return false;
  };

  const onSubmit = (data: IOnSubmitData) => {
    let newIsETC = false;

    const categoryETCIdx = data?.postTypes.findIndex(
      (elem) => elem === "기타 모임"
    );
    let newKeywords: string[] = [];

    if (categoryETCIdx !== -1 && data?.categoryETC !== "") {
      newIsETC = true;
      data?.postTypes.splice(categoryETCIdx, 1);
      data?.postTypes.push(data?.categoryETC as string);
    } else if (categoryETCIdx !== -1 && data?.categoryETC === "") {
      //""를 빼줘야함 ..
      data?.postTypes.splice(categoryETCIdx, 1);
    }

    const unionKeywords = [
      ...(data?.postTypes as string[] | []),
      ...(data?.first as string[] | []),
      ...(data?.second as string[] | []),
      ...(data?.keywords as string[] | []),
    ];

    unionKeywords.forEach((element) => {
      if (!newKeywords.includes(element)) {
        newKeywords.push(element);
      }
    });

    //duration
    const newDuration =
      data.duration === ""
        ? null
        : data?.duration === "직접 입력"
        ? data?.durationText
        : data?.duration === "미설정"
        ? ""
        : data?.duration;

    const newPost: ICreatePost = {
      title: data?.title,
      summary: data?.summary !== "" ? data?.summary : null,
      tags: {
        first: data?.first?.length === 0 ? [] : data?.first,
        second: data?.second?.length === 0 ? [] : data?.second,
      },
      postTypes: data?.postTypes,
      recruitStart:
        data?.recruitStart === ""
          ? dataConverter("year", new Date())
          : data?.recruitStart,
      recruitEnd: data?.recruitEnd !== "" ? data?.recruitEnd : null,
      duration: newDuration,
      targetCount: data?.positionToggle ? data?.targetCount : "",
      contact: data?.contact,
      contactDetails: data?.contactDetails !== "" ? data?.contactDetails : null,
      content:
        draftToHtml(convertToRaw(editorState.getCurrentContent())) ===
        "<p></p>\n"
          ? null
          : draftToHtml(convertToRaw(editorState.getCurrentContent())),
      years: data?.years?.length !== 0 ? data?.years : [],
      departments: data?.departments?.length !== 0 ? data?.departments : [],
      keywords: newKeywords,
      posterPaths: imageURLList?.length !== 0 ? imageURLList : null,
      isETC: newIsETC,
      qualifications:
        data?.qualifications?.length !== 0 ? data?.qualifications : null,
    };

    console.log(newPost);

    if (state) {
      if (!window.confirm("모집글을 수정 하시겠습니까?")) return;
      updatePost(state?.id, newPost as IUpdatePost);
      alert("모집글이 수정되었습니다.");
      navigate(-1);
    } else {
      if (!window.confirm("모집글을 등록 하시겠습니까?")) return;
      createPostMutate(newPost as ICreatePost);
    }
  };

  return (
    <div className="flex justify-center mt-[50px]">
      {checkSubmit() ? (
        <button
          type="button"
          onClick={handleSubmit(onSubmit as any)}
          className="text-white bg-blue-500  text-[18px] px-[20px] py-[8px] rounded-lg"
        >
          {state ? "모집글 수정하기" : "모집글 등록하기"}
        </button>
      ) : (
        <button
          disabled
          type="button"
          className="text-gray-400 bg-gray-200  text-[18px] px-[20px] py-[8px] rounded-lg"
        >
          {" "}
          {state ? "모집글 수정하기" : "모집글 등록하기"}
        </button>
      )}
    </div>
  );
}
