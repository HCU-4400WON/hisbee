import { MainBLUE } from "./color";

export default function PostTypesSelection({ getValues, setValue }: any) {
  const MajorSeletedBUTTON = `border-2 border-blue-300 ${MainBLUE} px-[15px] py-[8px] rounded-lg`;
  const UnSelectedBUTTON = `bg-gray-200 text-gray-400 px-[15px] py-[8px] rounded-lg border-2 border-gray-200`;

  const Categories = [
    // "동아리",
    // "프로젝트",
    // "학회",
    // "학술모임",
    // "공모전/대회",
    // "운동/게임/취미",
    // "전공 스터디",
    // "기타 모임",
    // "수업 내 프로젝트",
    // "자율 프로젝트",
    // "전체",
    "공모전/대회/프로젝트",
    "동아리",
    "학회",
    "수업 팀플/스터디",
    "운동/게임/취미",
    // "기타 모임",
  ];

  return (
    <div className=" w-[400px] h-[350px] pl-[0px] py-[30px]">
      <span className="flex items-center">
        <span className="text-[#ff0000]">*</span>
        모임 유형(카테고리){" "}
        {/* <span className="text-[13px] ml-[20px]">
                    <span className="text-blue-600 font-bold">최대 1개</span>{" "}
                    선택 가능
                  </span> */}
      </span>

      <div className="flex">
        <div className="grid grid-cols-2 gap-x-[20px] w-[450px]">
          {Categories.map((category, index) => (
            <span key={index} className="flex items-center mt-[20px]">
              <button
                type="button"
                className={`${
                  getValues("postTypes")?.includes(category as never)
                    ? MajorSeletedBUTTON
                    : UnSelectedBUTTON
                } px-[15px] py-[8px] rounded-lg w-[200px]`}
                onClick={(e) => {
                  const gv = getValues("postTypes");
                  if (gv.length === 0) {
                    setValue("postTypes", [category]);
                  } else if (category !== gv[0]) {
                    setValue("postTypes", [category]);
                  }
                }}
              >
                {category}
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
