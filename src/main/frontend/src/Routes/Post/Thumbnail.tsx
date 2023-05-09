import Heart from "components/Heart";
import Soon from "components/Soon";
import { motion } from "framer-motion";
import {
  convertDateToString,
  IPostExample,
} from "Routes/PostAddForm/components/PostExamples";

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
  const convertedSummary = summary?.split("\n");

  // const convertedSummary = "a\nb";

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={`flex flex-col max-w-[290px] h-[240px] mb-[50px] rounded-[15px] border bg-white ${
        closed && "bg-gray-300 opacity-60"
      }`}
    >
      <div
        className=" px-[15px] pt-[15px] pb-[13px] flex justify-between"
        onClick={(e) => e.preventDefault()}
      >
        <div className=" flex items-center">
          <span
            className={`px-[8px] py-[2px] rounded-full ${
              closed ? "bg-gray-400" : "bg-gray-200"
            }  text-[12px] `}
          >
            <p>{closed ? "모집마감" : dDay}</p>
          </span>
          {/* {soon && (
            <span className="px-[10px] py-[1px] rounded-full bg-gray-200 text-[14px] ml-[10px]">
              마감 임박🔥
            </span>
          )} */}
          <Soon
            fontSize="12"
            bgColor="bg-gray-200"
            closed={closed}
            recruitStart={new Date()}
            recruitEnd={recruitEnd}
          />
        </div>
        <span className="flex items-center">
          <p className="mr-[7px] text-[11px]">{nlike}</p>
          <Heart
            id={id}
            hasLiked={hasLiked}
            refetch={refetch}
            closed={closed}
          />
        </span>
      </div>

      <div className="px-[15px] pb-[15px] ">
        <div className=" ">
          <div className=" px-[3px] mb-[13px]">
            <p className="text-[15px] font-[500] ">{title}</p>
          </div>
          <div className=" text-[12px] px-[3px]">
            {convertedSummary?.map((line: string, index: number) => (
              <div className="" key={index}>
                {line}
              </div>
            ))}
          </div>

          <div className="flex mt-[20px] gap-[6px] mb-[7px]">
            {postTypes.map((postType: string, index: number) => (
              <span
                key={index}
                className={`px-[11px] py-[2px] bg-blue-200 rounded-full text-[12px] ${
                  closed ? "bg-gray-400" : "bg-blue-100"
                }`}
              >
                {postType}
              </span>
            ))}
          </div>

          <div className="flex mb-[7px] w-full gap-[6px]">
            {first?.map((keyword: string, index: number) => (
              <span
                key={index}
                className={`px-[11px] py-[2px] rounded-full text-[12px] ${
                  closed ? "bg-gray-400" : "bg-blue-100"
                }`}
              >
                {keyword}
              </span>
            ))}
          </div>
          <div className="flex gap-[6px]">
            {second?.map((keyword: string, index: number) => (
              <span
                key={index}
                className={`px-[11px] py-[2px] rounded-full text-[12px] ${
                  closed ? "bg-gray-400" : "bg-blue-100"
                }`}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Thumbnail;
