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
bg-gradient-to-r from-white to-purple-200 to-purple-300
`;

const PostContentFirstRow = tw.div`
flex 
items-center
`;

function Post() {
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
          <Button>스터디</Button>
          <Button>멘토링</Button>
          <Button>프로젝트</Button>
        </FilterButtonBox>
      </FilterRow>
      <FilterRow>
        <FilterTitle>POSITION</FilterTitle>
        <FilterButtonBox>
          <Button>기획자</Button>
          <Button>개발자</Button>
          <Button>디자이너</Button>
        </FilterButtonBox>
      </FilterRow>
      <FilterRow>
        <FilterTitle>PAY</FilterTitle>
        <FilterButtonBox>
          <Button>YES</Button>
          <Button>NO</Button>
        </FilterButtonBox>
      </FilterRow>

      <SortBox>
        <SortTitle>Sort by</SortTitle>
        <SortSelect>
          <option>평점 순</option>
          <option>좋아요 순</option>
        </SortSelect>
      </SortBox>

      <PostGrid>
        {[0, 0, 0, 0].map((e) => (
          <PostBox style={{ boxShadow: "0px 0px 25px rgb(0 0 0 / 0.3)" }}>
            <PostImage />

            <PostContentFirstRow>
              <p className="mx-5 my-1 text-sm font-bold">개발자</p>
              <p className="text-sm text-blue-500">2명 모집</p>
            </PostContentFirstRow>
            <p className="mx-5 my-1 text-lg font-bold">앱 개발 팀원 모집</p>
            <p className="mx-5 my-3">
              안녕하세요! 사이드 프로젝트 팀원을 구하고 있는...!!!
            </p>
            <span></span>
          </PostBox>
        ))}
      </PostGrid>
    </>
  );
}

export default Post;
