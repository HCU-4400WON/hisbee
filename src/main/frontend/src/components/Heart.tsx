import { useMutation } from "@tanstack/react-query";
import { addLikePost, deleteLikePost, IReadOnePost } from "api";
import { AxiosError, AxiosResponse } from "axios";
import { isLoginModalState, isLoginState } from "components/atom";

import { motion } from "framer-motion";
import { useSetRecoilState } from "recoil";

export default function Heart({ hasLiked, id, refetch, closed }: any) {
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
          setIsLogin(false);
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

  return (
    <motion.i
      whileHover={{ scale: [1, 1.3, 1, 1.3, 1] }}
      whileTap={{ y: [0, -30, 0] }}
      onClick={onHeartClick}
      className={`${
        hasLiked
          ? `fa-solid fa-heart ${
              closed ? "text-gray-600" : "text-blue-300"
            } stroke-black shadow-stone-400`
          : "fa-regular fa-heart"
      }  text-[18px] text-gray-400 `}
    ></motion.i>
  );
}
