import { useMutation } from "@tanstack/react-query";
import { addLikePost, deleteLikePost, IReadOnePost } from "api";
import { AxiosError, AxiosResponse } from "axios";
import { isLoginModalState, isLoginState } from "components/atom";
import { motion } from "framer-motion";
import { useSetRecoilState } from "recoil";
import {
  convertDateToString,
  IPostExample,
} from "Routes/PostAddForm/PostExamples";

// function Thumbnail({
//   postStart,
//   postEnd,
//   title,
//   subTitle,
//   categories,
//   keywordsFirstLine,
//   keywordsSecondLine,
//   Likes,
// }: IPostExample) {
function Thumbnail({
  id,
  recruitStart,
  recruitEnd,
  title,
  summary,
  postTypes,
  tags: { first, second },
  nlike,
  closed,
  hasLiked,
  refetch,
}: any) {
  // closed일 때는 모집마감 처리를 해주기 흐리게
  // hasLiked 일 때는 하트가 빨갛게 되어있도록

  const setIsLogin = useSetRecoilState(isLoginState);
  const setIsLoginModal = useSetRecoilState(isLoginModalState);

  const { mutate: likeAddMutate, isLoading: isLikeAddLoading } = useMutation(
    ["likeAddMutatePostPage" as string],
    (postId: number) => addLikePost(postId) as any,
    {
      onSuccess: () => {
        refetch();
      },
      onError: (error) => {
        if (((error as AxiosError).response as AxiosResponse).status === 401) {
          alert("로그인이 필요합니다.");
          if (localStorage.getItem("key")) localStorage.removeItem("key");
          setIsLoginModal(true);
        }
      },
    }
  );
  const { mutate: likeDeleteMutate, isLoading: isLikeDeleteLoading } =
    useMutation(
      ["likeDeleteMutatePostPage" as string],
      (postId: number) => deleteLikePost(postId) as any,
      {
        onSuccess: () => {
          refetch();
        },
        onError: (error) => {
          if (
            ((error as AxiosError).response as AxiosResponse).status === 401
          ) {
            alert("로그인이 필요합니다.");
            if (localStorage.getItem("key")) localStorage.removeItem("key");
            setIsLoginModal(true);
            setIsLogin(false);
          }
        },
      }
    );

  const onHeartClick = () => {
    if (!hasLiked) likeAddMutate(id);
    else likeDeleteMutate(id);
  };

  const dDay = convertDateToString(recruitStart, recruitEnd);

  // const duration = "D-12";
  // const title = "iF공모전 참여할 콘디생 모집";
  // const subTitle = "디리기1,2 수업 수강 중이거나 수강 완료하신 분";
  // const categories = ["공모전/대회" , "운동/게임/취미"];
  // const keywordsFirstLine = ["UX" , "제품 디자인"];
  // const keywordsSecondLine = ["5학기 이상"];
  // const Likes = 15;

  const dateDiff =
    (new Date(recruitEnd).getTime() - new Date(recruitStart).getTime()) /
    (1000 * 60 * 60 * 24);
  const soon = dateDiff <= 4 && closed === false;

  return (
    <div
      className={`w-[310px] min-h-[270px] mb-[50px]  rounded-xl border mx-[20px] bg-white ${
        closed && "opacity-40 bg-gray-200"
      }`}
    >
      <div
        className="pt-[15px] px-[15px] flex justify-between"
        onClick={(e) => e.preventDefault()}
      >
        <div className="flex items-center">
          <span className="px-[10px] py-[1px] rounded-full bg-gray-200 text-[14px]">
            <p>{closed ? "모집마감" : dDay}</p>
          </span>
          {soon && (
            <span className="px-[10px] py-[1px] rounded-full bg-gray-200 text-[14px] ml-[10px]">
              마감 임박🔥
            </span>
          )}
        </div>
        <span className="flex items-center ">
          <p className="mr-[10px]">{nlike}</p>
          <motion.i
            whileHover={{ scale: [1, 1.3, 1, 1.3, 1] }}
            whileTap={{ y: [0, -30, 0] }}
            onClick={onHeartClick}
            className={`${
              hasLiked
                ? "fa-solid fa-heart text-blue-300 stroke-black shadow-stone-400"
                : "fa-regular fa-heart"
            } text-[18px] text-gray-400 `}
          ></motion.i>
        </span>
      </div>
      <div className="px-[15px] pb-[15px]">
        <span className="">
          <p className="my-[10px] text-[18px]">{title}</p>
        </span>
        <span>
          <p className="text-[14px]">{summary}</p>
        </span>

        <div className="flex mt-[25px]">
          {postTypes.map((postType: string, index: number) => (
            <span
              key={index}
              className="px-[10px] py-[1px] bg-blue-100 mr-[10px] rounded-full text-[15px]"
            >
              {postType}
            </span>
          ))}
        </div>

        <div className="flex mt-[10px] w-full">
          {first?.map((keyword: string, index: number) => (
            <span
              key={index}
              className="px-[10px] py-[1px] bg-blue-200 mr-[10px] rounded-full text-[15px]"
            >
              {keyword}
            </span>
          ))}
        </div>
        <div className="flex mt-[10px]">
          {second?.map((keyword: string, index: number) => (
            <span
              key={index}
              className="px-[10px] py-[1px] bg-blue-200 mr-[10px] rounded-full text-[15px]"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Thumbnail;
