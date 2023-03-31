import { useMutation } from "@tanstack/react-query";
import { addLikePost, deleteLikePost } from "api";
import { AxiosError, AxiosResponse } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import tw from "tailwind-styled-components";
import { isLoginModalState, isLoginState } from "../../components/atom";


const PostItem = tw(motion.div)`
relative
h-[210px] 
w-[320px]
rounded-md
overflow-hidden
mb-[80px]
shadow-lg

`;

const PostContentFirstRow = tw.div`
flex 
justify-between
items-center
bg-gray-500
p-[15px]
`;

const PostCategorySpan = tw.span`
font-unique
text-[#185ee4] 
bg-[#fff] 
h-[25px] 
border 
w-[80px] 
text-[15px] 
font-bold 
rounded-full 
flex 
items-center 
justify-center
`;

const PostCategoryLabel = tw.label`
`;

const HeartIcon = tw(motion.i)`
`;

const PostMainPart = tw.div`
bg-[#e9e9eb] 
w-full 
h-full 
px-[25px] 
py-[15px]
`;

const PostTitle = tw.p`
font-unique
text-lg 

`;
const PostDate = tw.div`
flex text-[12px] 
font-semibold 
items-center
`;

const PostDatePlan = tw.p``;
const PostDateStart = tw.p``;

const PostPerson = tw.div`
absolute 
left-[25px] 
bottom-[15px] 
flex 
items-center 
gap-2
`;

const PostPersonTotal = tw.p`
text-[#185ee4] 
font-bold 
text-[14px]
`;

const PostPersonPosition = tw.span`
border-gray-400 
border 
rounded-full 
px-[10px] 
text-[11px] 
text-gray-500 
font-medium
`;

const HeartSpan = tw.span``


interface IwindowSize {
    width: number;
    height: number;
  }
  
  interface IProps {
    windowSize: IwindowSize;
    leaving: boolean;
  }

const postsVariants = {
    hidden: ({ windowSize }: IProps) => ({
      x: windowSize.width,
      // x: 1500,
    }),
    showing: {
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
    exit: (windowSize: any) => ({
      x: -windowSize.windowSize.width,
      // x: -1500,
      transition: {
        duration: 0.5,
      },
    }),
    hover: ({ leaving }: IProps) => ({
      scale: leaving ? 1 : 1.05,
      // opacity: 0.4,
      // zIndex: 1,
      transition: {
        // delay: 0.1,
        duration: 0.1,
  
        type: "tween",
      },
    }),
  };

  

  
  // type IdtypeToStyle = {
  //   [P: string] : {
  //     color: string,
  //     bdColor : string,
  //     text: string,
  //   },
  //   M: {
  //     color: string,
  //     bdColor : string,
  //     text: string,
  //   },
  //   S : {
      
  //       color: string,
  //       bdColor : string,
  //       text: string,
      
  //   }
  // }

  

function Card({post, refetch, index} : any){

    
    // const dtypeToStyle : IdtypeToStyle = {
    //     P: {
    //       color: 'text-purple-400',
    //       bdColor: 'bg-[#e0c3f8]',
    //       text: '프로젝트',
    //     },
    //     M: {
    //       color:"text-blue-400",
    //       bdColor:'bg-[#bdc9f2]',
    //       text:'멘토링'
    //     },
    //     S: {
    //       color:"text-gray-400",
    //       bdColor:'bg-[#c7c7c7]',
    //       text:'스터디'
    
    //     }
    //   }

    const onHeartClick = async (postId: number, hasLiked: boolean) => {
        if (hasLiked) {
          likeDeleteMutate(postId);
        } else {
          likeAddMutate(postId);
        }
      };
      const { mutate: likeAddMutate, isLoading: isLikeAddLoading } = useMutation(
        ["likeAddMutate" as string],
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
          ["likeDeleteMutate" as string],
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
        const [windowSize, setWindowSize] = useState<{
            width: number | undefined;
            height: number | undefined;
          }>({
            width: undefined,
            height: undefined,
          });

        // const [leaving, setLeaving] = useState(false);
  const setIsLogin = useSetRecoilState(isLoginState);
  const setIsLoginModal = useSetRecoilState(isLoginModalState);

    return(
      
            
          
      <PostItem
      // initial={{ scale: 1 }}
      whileHover={{ scale: 1.08 }}
      key={index}
    >
              <PostContentFirstRow
                className="bg-[#c7c7c7]"
              >
                <PostCategorySpan>
                  <PostCategoryLabel
                   
                    className="text-gray-400"
                  >
                    
                      모집글
                  </PostCategoryLabel>
                </PostCategorySpan>
                <HeartSpan >
                  <HeartIcon
                    whileHover={{ scale: [1, 1.3, 1, 1.3, 1] }}
                    whileTap={{ y: [0, -30, 0] }}
                    onClick={() =>
                      onHeartClick(
                        post.id,
                        post.hasLiked as boolean
                      )
                    }
                    className={`${
                      post.hasLiked
                        ? "fa-solid fa-heart text-red-600"
                        : "fa-regular fa-heart"
                    }`}
                  >
                    {/* {post.likenum} */}
                  </HeartIcon>
                  &nbsp; {post?.nliked}
                </HeartSpan>

            
              </PostContentFirstRow>

              <Link to={`/post/${post.id}`}>
                <PostMainPart>
                  {/* secondRow */}
                  <PostTitle>
                    {post?.title.length > 16
                      ? post?.title.slice(0, 16) + "..."
                      : post?.title}
                  </PostTitle>

                  {/* ThirdRow */}
                  <PostDate>
                    {(new Date(post?.projectEnd).getTime() -
                      new Date(post?.projectStart).getTime()) /
                      (1000 * 24 * 60 * 60) >=
                    365 ? (
                      <PostDatePlan>
                        {Math.floor(
                          (new Date(
                            post?.projectEnd
                          ).getTime() -
                            new Date(
                              post?.projectStart
                            ).getTime()) /
                            (1000 * 24 * 60 * 60 * 365)
                        )}
                        {""}년 플랜
                      </PostDatePlan>
                    ) : (new Date(post?.projectEnd).getTime() -
                        new Date(
                          post?.projectStart
                        ).getTime()) /
                        (1000 * 24 * 60 * 60) >=
                      30 ? (
                      <PostDatePlan>
                        {Math.floor(
                          (new Date(
                            post?.projectEnd
                          ).getTime() -
                            new Date(
                              post?.projectStart
                            ).getTime()) /
                            (1000 * 24 * 60 * 60 * 30)
                        )}
                        {""}달 플랜
                      </PostDatePlan>
                    ) : (new Date(post?.projectEnd).getTime() -
                        new Date(
                          post?.projectStart
                        ).getTime()) /
                        (1000 * 24 * 60 * 60) >=
                      7 ? (
                      <PostDatePlan>
                        {Math.floor(
                          (new Date(
                            post?.projectEnd
                          ).getTime() -
                            new Date(
                              post?.projectStart
                            ).getTime()) /
                            (1000 * 24 * 60 * 60 * 7)
                        )}
                        {""}주 플랜
                      </PostDatePlan>
                    ) : (
                      <PostDatePlan>
                        {Math.floor(
                          (new Date(
                            post?.projectEnd
                          ).getTime() -
                            new Date(
                              post?.projectStart
                            ).getTime()) /
                            (1000 * 24 * 60 * 60)
                        )}
                        {""}일 플랜
                      </PostDatePlan>
                    )}
                    <p className="mx-[7px] pb-0.5">|</p>
                    <PostDateStart>
                      {" "}
                      {new Date(post?.projectStart).getMonth()}
                      월{" "}
                      {new Date(post?.projectStart).getDate()}일
                      시작
                    </PostDateStart>
                  </PostDate>

                  {/* lastRow */}
                  <PostPerson>
                    <PostPersonTotal>
                      {post?.dtype === "P"
                        ? post?.maxDesigner +
                          post?.maxDeveloper +
                          post?.maxPlanner
                        : post?.dtype === "S"
                        ? post?.maxMember
                        : post?.maxMentee + post?.maxMentor}
                      명 모집
                    </PostPersonTotal>

                    {post?.dtype === "P" ? (
                      <>
                        {post?.maxDeveloper !== 0 && (
                          <PostPersonPosition>
                            개발자 {post?.maxDeveloper}명
                          </PostPersonPosition>
                        )}
                        {post?.maxPlanner !== 0 && (
                          <PostPersonPosition>
                            기획자 {post?.maxPlanner}명
                          </PostPersonPosition>
                        )}

                        {post?.maxDesigner !== 0 && (
                          <PostPersonPosition>
                            디자이너 {post?.maxDesigner}명
                          </PostPersonPosition>
                        )}
                      </>
                    ) : post?.dtype === "S" ? (
                      post?.maxMember !== 0 && (
                        <PostPersonPosition>
                          스터디원 {post?.maxMember}명
                        </PostPersonPosition>
                      )
                    ) : (
                      <>
                        {post?.maxMentor !== 0 && (
                          <PostPersonPosition>
                            멘토 {post?.maxMentor}명
                          </PostPersonPosition>
                        )}
                        {post?.maxMentee !== 0 && (
                          <PostPersonPosition>
                            멘티 {post?.maxMentee}명
                          </PostPersonPosition>
                        )}
                      </>
                    )}
                  </PostPerson>
                </PostMainPart>
              </Link>
            </PostItem>
    )
}

export default Card;