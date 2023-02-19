import { posts } from "api";
import tw from "tailwind-styled-components";

const titles = [
  "🔥 요즘 핫한 모집글",
  "👨‍🎨  신규 모집글",
  "📢  마감임박! 모집글",
  "👨‍👦‍👦  모집인원 임박! 모집글",
];

const Banner = tw.img`
rounded-lg 
w-screen
mt-10 
bg-gradient-to-r from-gray-200 to-gray-500
`;

const PostCategory = tw.div`
mx-5
`;

const TitleRow = tw.div`
flex 
justify-between 
mx-20 
mt-20 
mb-10
`;

const Title = tw.p`
text-xl 
font-bold
`;

const PostGrid = tw.div`
grid 
grid-cols-1
gap-48 
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
bg-gradient-to-r from-white to-purple-200 to-purple-300
`;

const PostContentFirstRow = tw.div`
flex 
items-center
justify-between
`;

function Main() {
  return (
    <>
      <Banner src="/img/mainBanner.png"></Banner>
      {titles.map((title) => (
        <PostCategory>
          <TitleRow>
            <Title>{title}</Title>
            <svg
              className="w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
            </svg>
          </TitleRow>

          <PostGrid>
            {posts.slice(0, 4).map((post, index) => (
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
                        (post.projectEnd.getTime() -
                          post.projectStart.getTime()) /
                          (1000 * 24 * 60 * 60 * 365)
                      )}{" "}
                      년 플랜
                    </p>
                  ) : (post.projectEnd.getTime() -
                      post.projectStart.getTime()) /
                      (1000 * 24 * 60 * 60) >=
                    30 ? (
                    <p>
                      {Math.floor(
                        (post.projectEnd.getTime() -
                          post.projectStart.getTime()) /
                          (1000 * 24 * 60 * 60 * 30)
                      )}{" "}
                      달 플랜
                    </p>
                  ) : (post.projectEnd.getTime() -
                      post.projectStart.getTime()) /
                      (1000 * 24 * 60 * 60) >=
                    7 ? (
                    <p>
                      {Math.floor(
                        (post.projectEnd.getTime() -
                          post.projectStart.getTime()) /
                          (1000 * 24 * 60 * 60 * 7)
                      )}{" "}
                      주 플랜
                    </p>
                  ) : (
                    <p>
                      {Math.floor(
                        (post.projectEnd.getTime() -
                          post.projectStart.getTime()) /
                          (1000 * 24 * 60 * 60)
                      )}{" "}
                      일 플랜
                    </p>
                  )}
                  <p className="mx-[20px] ">/</p>
                  <p>
                    {" "}
                    {post.projectStart.getFullYear()}-
                    {post.projectStart.getMonth()}-{post.projectStart.getDate()}{" "}
                    시작
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
        </PostCategory>
      ))}
      <div className="w-full mx-5"></div>
      <div className="w-full mx-5"></div>
      <div className="w-full mx-5"></div>
    </>
  );
}

export default Main;
