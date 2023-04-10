import {
  convertDateToString,
  IPostExample,
} from "Routes/PostAddForm/PostExamples";

function Thumbnail({
  postStart,
  postEnd,
  title,
  subTitle,
  categories,
  keywordsFirstLine,
  keywordsSecondLine,
  Likes,
}: IPostExample) {
  // function Thumbnail({postStart , postEnd , title, summary , postType , {first}: tag , {second} : tag , nlike , closed , hasLiked} : IReadOnePost){
  // closed일 때는 모집마감 처리를 해주기 흐리게
  // hasLiked 일 때는 하트가 빨갛게 되어있도록

  const dDay = convertDateToString(postStart, postEnd);

  // const duration = "D-12";
  // const title = "iF공모전 참여할 콘디생 모집";
  // const subTitle = "디리기1,2 수업 수강 중이거나 수강 완료하신 분";
  // const categories = ["공모전/대회" , "운동/게임/취미"];
  // const keywordsFirstLine = ["UX" , "제품 디자인"];
  // const keywordsSecondLine = ["5학기 이상"];
  // const Likes = 15;

  return (
    <div className="min-w-[310px] h-[260px] mb-[50px] p-[15px] bg-white rounded-xl border mx-[20px]">
      <div className="flex justify-between">
        <span className="px-[10px] py-[1px] rounded-full bg-gray-200 text-[13px]">
          <p>{dDay}</p>
        </span>
        <span className="flex items-center ">
          <p className="mr-[10px]">{Likes}</p>
          <i className="fa-regular fa-heart text-[18px] text-gray-400"></i>
        </span>
      </div>

      <span className="">
        <p className="my-[10px] text-[18px]">{title}</p>
      </span>
      <span>
        <p className="text-[14px]">{subTitle}</p>
      </span>

      <div className="flex mt-[25px]">
        {categories.map((category, index) => (
          <span
            key={index}
            className="px-[10px] py-[1px] bg-blue-100 mr-[10px] rounded-full text-[15px]"
          >
            {category}
          </span>
        ))}
      </div>

      <div className="flex mt-[10px] w-full">
        {keywordsFirstLine.map((keyword, index) => (
          <span
            key={index}
            className="px-[10px] py-[1px] bg-blue-200 mr-[10px] rounded-full text-[15px]"
          >
            {keyword}
          </span>
        ))}
      </div>
      <div className="flex mt-[10px]">
        {keywordsSecondLine.map((keyword, index) => (
          <span
            key={index}
            className="px-[10px] py-[1px] bg-blue-200 mr-[10px] rounded-full text-[15px]"
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Thumbnail;
