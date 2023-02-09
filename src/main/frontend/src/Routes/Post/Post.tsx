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
gap-10 
mx-10
sm:grid-cols-2
xl:grid-cols-4

`;

const PostBox = tw.div`
h-80 
w-200
rounded-md

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
items-center
`;

function Post() {
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterPosition, setFilterPosition] = useState<string>("");
  const [filterPay, setFilterPay] = useState<string>("");

  const [positionButton, setPositionButton] = useState([]);
  const [payButton, setPayButton] = useState([]);
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
      setFilterPay("");
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

  const positions: IFiltering = {
    study: ["member"],
    mentoring: ["mentor", "mentee"],
    project: ["planner", "developer", "designer"],
  };

  const pays: IFiltering = {
    mentoring: ["true", "false"],
    project: ["true", "false"],
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
          <Button id="category" name="study" onClick={onClick}>
            스터디
          </Button>
          <Button id="category" name="mentoring" onClick={onClick}>
            멘토링
          </Button>
          <Button id="category" name="project" onClick={onClick}>
            프로젝트
          </Button>
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
              >
                {position}
              </Button>
            ))}
          </FilterButtonBox>
        </FilterRow>
      )}

      {filterCategory === "" || filterCategory === "study" ? null : (
        <FilterRow>
          <FilterTitle>PAY</FilterTitle>
          <FilterButtonBox>
            {pays[filterCategory].map((pay) => (
              <Button id="pay" name={pay} key={pay} onClick={onClick}>
                {pay}
              </Button>
            ))}
          </FilterButtonBox>
        </FilterRow>
      )}

      <SortBox>
        <SortTitle>Sort by</SortTitle>
        <SortSelect>
          <option>평점 순</option>
          <option>좋아요 순</option>
        </SortSelect>
      </SortBox>

      <PostGrid>
        {posts.map((post, index) => (
          <PostBox
            key={index}
            style={{ boxShadow: "0px 0px 25px rgb(0 0 0 / 0.3)" }}
          >
            <PostImage
              className={`${
                post.category === "PROJECT"
                  ? "bg-gradient-to-r from-white to-yellow-200 to-green-300"
                  : post.category === "STUDY"
                  ? "bg-gradient-to-r from-white to-purple-200 to-purple-300"
                  : "bg-gradient-to-r from-white to-cyan-200 to-blue-300"
              }`}
            />

            <PostContentFirstRow>
              <p className="mx-5 my-1 text-sm font-bold">개발자</p>
              <p className="text-sm text-blue-500">{post.total}명 모집</p>
            </PostContentFirstRow>
            <p className="mx-5 my-1 text-lg font-bold">
              {post.title.length > 20
                ? post.title.slice(0, 20) + "..."
                : post.title}
            </p>
            <p className="mx-5 my-3">
              {post.content.length > 20
                ? post.content.slice(0, 20) + "..."
                : post.content}
            </p>
            <span></span>
          </PostBox>
        ))}
      </PostGrid>
    </>
  );
}

export default Post;
