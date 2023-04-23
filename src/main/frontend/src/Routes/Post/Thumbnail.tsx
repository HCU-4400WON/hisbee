import Heart from "components/Heart";
import Soon from "components/Soon";
import { motion } from "framer-motion";
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

  const dDay = convertDateToString(recruitStart, recruitEnd);

  // const duration = "D-12";
  // const title = "iF공모전 참여할 콘디생 모집";
  // const subTitle = "디리기1,2 수업 수강 중이거나 수강 완료하신 분";
  // const categories = ["공모전/대회" , "운동/게임/취미"];
  // const keywordsFirstLine = ["UX" , "제품 디자인"];
  // const keywordsSecondLine = ["5학기 이상"];
  // const Likes = 15;

  // const dateDiff =
  //   (new Date(recruitEnd).getTime() - new Date(recruitStart).getTime()) /
  //   (1000 * 60 * 60 * 24);
  // const soon = dateDiff <= 4 && closed === false;

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={`min-w-[310px] min-h-[280px] mb-[50px] rounded-xl border mx-[20px] bg-white ${
        closed && "opacity-40 bg-gray-200"
      }`}
    >
      <div
        className="pt-[15px] px-[15px] flex justify-between"
        onClick={(e) => e.preventDefault()}
      >
        <div className="flex items-center ">
          <span className="px-[10px] py-[1px] rounded-full bg-gray-200 text-[14px]">
            <p>{closed ? "모집마감" : dDay}</p>
          </span>
          {/* {soon && (
            <span className="px-[10px] py-[1px] rounded-full bg-gray-200 text-[14px] ml-[10px]">
              마감 임박🔥
            </span>
          )} */}
          <Soon
            fontSize="15"
            bgColor="bg-gray-200"
            closed={closed}
            recruitStart={recruitStart}
            recruitEnd={recruitEnd}
          />
        </div>
        <span className="flex items-center ">
          <p className="mr-[10px]">{nlike}</p>
          <Heart id={id} hasLiked={hasLiked} refetch={refetch} />
        </span>
      </div>
      <div className="px-[15px] pb-[15px] border">
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
    </motion.div>
  );
}

export default Thumbnail;
