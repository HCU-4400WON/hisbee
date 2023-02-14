import { departments, IPost, posts } from "api";
import React, { useEffect, useState } from "react";
import tw from "tailwind-styled-components";

const Banner = tw.div`
h-60 
mt-10 
mx-5 
bg-gradient-to-r from-gray-300 to-gray-500
`;

const FilterRow = tw.div`
relative
flex 
h-16 
mx-5 
my-1
border-b-2 
border-black 
item-center
vertical-center
`;

const FilterTitle = tw.p`
block
text-xl 
mx-10
my-auto
w-20
md:text-4xl 
md:w-60
`;

const FilterButtonBox = tw.span`

flex 
items-center 
text-lg
`;

const Button = tw.button`
border-2 
border-gray-300 
px-2 
rounded-3xl
mx-3
`;

const SortBox = tw.div`
flex 
justify-end 
my-20 
mx-10
`;

const SortTitle = tw.p`
font-bold 
mr-5
`;

const SortSelect = tw.select`
  w-44
`;

const PostGrid = tw.div`
grid 
grid-cols-1
gap-x-48
gap-y-24

mx-2
sm:grid-cols-2
xl:grid-cols-4

`;

const PostItem = tw.div`
relative
h-[200px] 
w-[380px]
rounded-md
p-[15px]
`;

const PostImage = tw.div`
border-0 
rounded-sm 
h-2/5 
mx-5 
mt-5 
mb-3 
`;

const PostContentFirstRow = tw.div`
flex 
justify-between
items-center
`;

function Post() {
  const onInput = (event: React.FormEvent<HTMLSelectElement>) => {
    console.log(event.currentTarget.value);
  };

  // Filtering
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterPosition, setFilterPosition] = useState<string>("");
  const [filterPay, setFilterPay] = useState<string>("");

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.currentTarget.id === "category") {
      // 필터링 취소
      if (filterCategory === event.currentTarget.name) {
        setFilterCategory("");
      } else setFilterCategory(event.currentTarget.name);
      setFilterPosition("");
      setFilterPay("");
    } else if (event.currentTarget.id === "position") {
      // 2차 필터링 취소
      if (filterPosition === event.currentTarget.name) {
        setFilterPosition("");
      } else setFilterPosition(event.currentTarget.name);
    } else if (event.currentTarget.id === "pay") {
      //3차 필터링 취소
      if (filterPay === event.currentTarget.name) {
        setFilterPay("");
      } else {
        setFilterPay(event.currentTarget.name);
      }
    }
  };

  useEffect(() => {
    console.log(filterCategory, filterPosition, filterPay);
  }, [filterCategory, filterPosition, filterPay]);

  interface IFiltering {
    [key: string]: string[];
  }

  // const positions: IFiltering = {
  //   study: ["member"],
  //   mentoring: ["mentor", "mentee"],
  //   project: ["planner", "developer", "designer"],
  // };

  // const pays: IFiltering = {
  //   mentoring: ["true", "false"],
  //   project: ["true", "false"],
  // };

  const categories: string[] = ["스터디", "멘토링", "프로젝트"];

  const positions: IFiltering = {
    스터디: ["맴버"],
    멘토링: ["멘토", "멘티"],
    프로젝트: ["기획자", "개발자", "디자이너"],
  };

  const pays: IFiltering = {
    // 스터디: [],
    멘토링: ["있음", "없음"],
    프로젝트: ["있음", "없음"],
  };

  return (
    <>
      {/* <img
        className="h-60 
mt-5 
mx-5 
bg-gray-200"
        src="/img/banner.png"
        width="97%"
      ></img> */}
      <Banner></Banner>
      <FilterRow>
        <FilterTitle>CATEGORY</FilterTitle>
        <FilterButtonBox>
          {categories.map((category) => (
            <Button
              key={category}
              id="category"
              name={category}
              onClick={onClick}
              className={`${category === filterCategory && "bg-purple-200"}`}
            >
              {category}
            </Button>
          ))}
        </FilterButtonBox>
      </FilterRow>
      {filterCategory === "" ? null : (
        <FilterRow>
          <FilterTitle>POSITION</FilterTitle>
          <FilterButtonBox>
            {positions[filterCategory].map((position) => (
              <Button
                id="position"
                name={position}
                key={position}
                onClick={onClick}
                className={`${position === filterPosition && "bg-purple-200"}`}
              >
                {position}
              </Button>
            ))}
          </FilterButtonBox>
        </FilterRow>
      )}

      {filterCategory === "" || filterCategory === "스터디" ? null : (
        <FilterRow>
          <FilterTitle>PAY</FilterTitle>
          <FilterButtonBox>
            {pays[filterCategory].map((pay) => (
              <Button
                id="pay"
                name={pay}
                key={pay}
                onClick={onClick}
                className={`${pay === filterPay && "bg-purple-200"}`}
              >
                {pay}
              </Button>
            ))}
          </FilterButtonBox>
        </FilterRow>
      )}

      <SortBox>
        <SortTitle>Sort by</SortTitle>
        <SortSelect onInput={onInput}>
          <option value="평점">평점 순</option>
          <option value="좋아요">좋아요 순</option>
        </SortSelect>
      </SortBox>

      <PostGrid className="relative">
        {posts.map((post, index) => (
          <PostItem
            className={`${
              post.dtype === "P"
                ? "bg-gradient-to-r from-gray-300 to-gray-200  to-white"
                : post.dtype === "S"
                ? "bg-gradient-to-r from-purple-300 to-purple-200 to-white"
                : "bg-gradient-to-r from-blue-300 to-blue-200 to-white"
            }`}
            key={index}
            style={{ boxShadow: "0px 0px 25px rgb(0 0 0 / 0.25)" }}
          >
            <PostContentFirstRow>
              <span className="text-[#185ee4] bg-[#fff] border w-[80px] text-[14px] font-medium text-center rounded-full">
                {post.dtype === "P"
                  ? "프로젝트"
                  : post.dtype === "S"
                  ? "스터디"
                  : "멘토링"}
              </span>
              <i className="fa-regular fa-heart text-[20px]"></i>
              {/* <p className="mx-5 my-1 text-sm font-bold">개발자</p>
       <p className="text-sm text-blue-500">{post.total}명 모집</p> */}
            </PostContentFirstRow>

            {/* secondRow */}
            <p className="ml-[10px] mt-[25px] text-lg font-bold">
              {post.title.length > 20
                ? post.title.slice(0, 20) + "..."
                : post.title}
            </p>

            {/* ThirdRow */}
            <div className="flex ml-[10px] mt-[8px] text-[14px] font-semibold items-center">
              {(post.projectEnd.getTime() - post.projectStart.getTime()) /
                (1000 * 24 * 60 * 60) >=
              365 ? (
                <p>
                  {Math.floor(
                    (post.projectEnd.getTime() - post.projectStart.getTime()) /
                      (1000 * 24 * 60 * 60 * 365)
                  )}{" "}
                  년 플랜
                </p>
              ) : (post.projectEnd.getTime() - post.projectStart.getTime()) /
                  (1000 * 24 * 60 * 60) >=
                30 ? (
                <p>
                  {Math.floor(
                    (post.projectEnd.getTime() - post.projectStart.getTime()) /
                      (1000 * 24 * 60 * 60 * 30)
                  )}{" "}
                  달 플랜
                </p>
              ) : (post.projectEnd.getTime() - post.projectStart.getTime()) /
                  (1000 * 24 * 60 * 60) >=
                7 ? (
                <p>
                  {Math.floor(
                    (post.projectEnd.getTime() - post.projectStart.getTime()) /
                      (1000 * 24 * 60 * 60 * 7)
                  )}{" "}
                  주 플랜
                </p>
              ) : (
                <p>
                  {Math.floor(
                    (post.projectEnd.getTime() - post.projectStart.getTime()) /
                      (1000 * 24 * 60 * 60)
                  )}{" "}
                  일 플랜
                </p>
              )}
              <p className="mx-[20px] ">/</p>
              <p>
                {" "}
                {post.projectStart.getFullYear()}-{post.projectStart.getMonth()}
                -{post.projectStart.getDate()} 시작
              </p>
            </div>

            {/* lastRow */}
            <div className="absolute left-[25px] bottom-[15px] flex items-center gap-3">
              <p className=" text-[#185ee4] text-[15px]">
                {post.dtype === "P"
                  ? post.maxDesigner + post.maxDeveloper + post.maxPlanner
                  : post.dtype === "S"
                  ? post.maxMember
                  : post.maxMentee + post.maxMentor}
                명 모집
              </p>

              {post.dtype === "P" ? (
                <>
                  {post.maxDeveloper !== 0 && (
                    <span className="border-gray-400 border-2 rounded-full px-[10px] text-[13px] text-gray-500 font-medium">
                      개발자 {post.maxDeveloper}명
                    </span>
                  )}
                  {post.maxPlanner !== 0 && (
                    <span className="border-gray-400 border-2 rounded-full px-[10px] text-[13px] text-gray-500 font-medium">
                      기획자 {post.maxPlanner}명
                    </span>
                  )}

                  {post.maxDesigner !== 0 && (
                    <span className="border-gray-400 border-2 rounded-full px-[10px] text-[13px] text-gray-500 font-medium">
                      디자이너 {post.maxDesigner}명
                    </span>
                  )}
                </>
              ) : post.dtype === "S" ? (
                <span className="border-gray-400 border-2 rounded-full px-[10px] text-[13px] text-gray-500 font-medium">
                  스터디원 {post.maxMember}명
                </span>
              ) : (
                <>
                  {post.maxMentor !== 0 && (
                    <span className="border-gray-400 border-2 rounded-full px-[10px] text-[13px] text-gray-500 font-medium">
                      멘토 {post.maxMentor}명
                    </span>
                  )}
                  {post.maxMentee !== 0 && (
                    <span className="border-gray-400 border-2 rounded-full px-[10px] text-[13px] text-gray-500 font-medium">
                      멘티 {post.maxMentee}명
                    </span>
                  )}
                </>
              )}
            </div>
          </PostItem>
        ))}
      </PostGrid>
    </>
  );
}

export default Post;
