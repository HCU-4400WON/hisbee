import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

export function Department({ getValues, setValue }: any) {
  const Majors = [
    // {"상관없음":[]},
    { 경영경제학부: ["경영학", "경제학", "GM"] },
    { 상당심리사회복지학부: ["상담심리학", "사회복지학"] },
    { 생명과학부: ["생명과학부"] },
    { 전산전자공학부: ["AI", "컴퓨터공학", "전자공학"] },
    { ICT창업학부: ["GE", "ICT융합", "ACE"] },
    { 커뮤니케이션학부: ["언론정보학", "공연영상학"] },
    { 기계제어공학부: ["기계공학", "전자제어공학"] },
    { 국제어문학부: ["국제지역학", "영어"] },
    { 법학부: ["한국법", "UIL"] },
    { 공간환경시스템공학부: ["건설공학", "도시환경공학"] },
    { 콘텐츠융합디자인학부: ["시각디자인", "제품디자인"] },
  ];
  const [visible, setVisible] = useState<Boolean[]>(
    Array.from({ length: Majors.length }, () => false)
  );
  const MainBLUE = "bg-blue-200";
  const LightMainBLUE = "bg-blue-100";
  const [majorToggle, setMajorToggle] = useState<boolean>(false);
  const MajorSeletedBUTTON = `border-2 border-blue-300 ${MainBLUE} px-[15px] py-[8px] rounded-lg`;

  const DetailSelectedBUTTON = `border-2 border-blue-300 ${LightMainBLUE} px-[15px] py-[8px] rounded-lg`;
  const DetailUnSelectedBUTTON = `${LightMainBLUE} px-[15px] py-[8px] rounded-lg`;
  const MajorUnSelectedBUTTON = `${MainBLUE} px-[15px] py-[8px] rounded-lg`;
  const UnSelectedBUTTON = `bg-gray-200 text-gray-400 px-[15px] py-[8px] rounded-lg`;
  return (
    <div>
      <span className="flex items-center text-[20px] my-[10px]">
        전공{" "}
        <p className="ml-[10px] text-[15px] text-gray-400">중복 선택 가능</p>
      </span>
      <div className="flex">
        <span
          className={`flex items-start mt-[10px] ${
            majorToggle && "text-gray-400"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              setMajorToggle(false);
              setValue("departments", []);
            }}
            value="상관없음"
            className={`border-2 px-[15px] w-[100px] py-[5px] rounded-lg ${
              !majorToggle ? MajorSeletedBUTTON : UnSelectedBUTTON
            }`}
          >
            상관 없음
          </button>

          {!majorToggle && (
            <button
              type="button"
              className={`border-2 ${UnSelectedBUTTON}  w-[100px] px-[15px] py-[5px] rounded-lg ml-[10px]`}
              onClick={() => {
                // if(majorToggle) setValue("departments" , ["상관없음"] as any);
                // setValue("departments", []);
                setMajorToggle(true);
              }}
            >
              전공 선택
            </button>
          )}
        </span>

        <div className="w-full grid grid-cols-2">
          {majorToggle && (
            <>
              {Majors?.map((major, index) => {
                const key = Object.keys(major)[0];
                const values = Object.values(major)[0];
                let clicked = false;
                return (
                  <div className="flex flex-col">
                    <span
                      key={index}
                      className="flex items-center px-[20px] py-[10px]"
                    >
                      <button
                        type="button"
                        key={index}
                        onClick={(e) => {
                          setVisible((prev) => [
                            ...prev.slice(0, index),
                            !prev[index],
                            ...prev.slice(index + 1),
                          ]);
                        }}
                        className={`${
                          visible[index]
                            ? MajorSeletedBUTTON
                            : MajorUnSelectedBUTTON
                        } flex items-center w-[200px] justify-center px-[15px] py-[5px] rounded-lg ml-[10px]`}
                      >
                        <p>{Object.keys(major)}</p>
                        <i className="fa-solid fa-chevron-right ml-[10px]"></i>
                      </button>

                      {visible[index] &&
                        values.map((value: string, idx: number) => (
                          <span
                            key={idx}
                            className="pl-[20px] flex items-center"
                          >
                            {/* check point */}
                            <button
                              type="button"
                              className={`${
                                getValues("departments").includes(
                                  value as never
                                )
                                  ? DetailSelectedBUTTON
                                  : DetailUnSelectedBUTTON
                              }`}
                              onClick={(e) => {
                                const gV = getValues("departments");
                                const gvIdx = gV.indexOf(value as never);
                                const btn = e.currentTarget;
                                if (gvIdx === -1) {
                                  setValue("departments", [
                                    ...gV,
                                    value as never,
                                  ]);
                                  // btn.className = `px-[15px] py-[5px] rounded-lg ml-[10px] ${DetailSelectedBUTTON}`;
                                } else {
                                  setValue("departments", [
                                    ...gV.slice(0, gvIdx),
                                    ...gV.slice(gvIdx + 1),
                                  ]);
                                  // btn.className = `px-[15px] py-[5px] rounded-lg ml-[10px] ${DetailUnSelectedBUTTON}`;
                                }
                              }}
                            >
                              {value}
                            </button>
                          </span>
                        ))}
                    </span>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
