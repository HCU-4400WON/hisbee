import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

export function Grade({ getValues, setValue }: any) {
  const Grades = [
    "23학번 새내기",
    "1학년",
    "2학년",
    "3학년",
    "4학년",
    "9학기 이상",
  ];

  const MainBLUE = "bg-blue-200";
  const LightMainBLUE = "bg-blue-100";
  const DetailSelectedBUTTON = `border-2 border-blue-300 bg-blue-100 px-[15px] py-[8px] rounded-lg`;
  const DetailUnSelectedBUTTON = `bg-blue-100 px-[15px] py-[8px] rounded-lg`;
  const MajorSeletedBUTTON = `border-2 border-blue-300 bg-blue-200 px-[15px] py-[8px] rounded-lg`;
  const UnSelectedBUTTON = `bg-gray-200 text-gray-400 px-[15px] py-[8px] rounded-lg`;
  const [gradeToggle, setGradeToggle] = useState<boolean>(false);

  return (
    <div className="w-[56%]">
      <span className="flex items-center text-[20px] mb-[10px]">
        학년{" "}
        <p className="ml-[10px] text-[15px] text-gray-400">중복 선택 가능</p>
      </span>

      <div className="flex">
        <div className="flex"></div>
        <button
          type="button"
          onClick={() => {
            setGradeToggle(false);
            setValue("years", []);
          }}
          value="상관없음"
          className={`border-2 px-[15px] py-[5px] rounded-lg ${
            !gradeToggle ? MajorSeletedBUTTON : UnSelectedBUTTON
          }`}
        >
          상관없음
        </button>

        {/* <p className="mx-[10px]">학년 선택하기</p> */}
        {!gradeToggle && (
          <button
            type="button"
            className={`border-2 ${
              gradeToggle ? MajorSeletedBUTTON : UnSelectedBUTTON
            } px-[15px] py-[5px] rounded-lg ml-[10px] `}
            onClick={() => {
              // if(gradeToggle) setValue("years" , ["상관없음"] as any);
              // setValue("years", []);
              setGradeToggle(true);
              console.log(getValues("years"));
            }}
          >
            학년 설정
          </button>
        )}

        {gradeToggle && (
          <>
            {Grades.map((grade, index) => (
              <button
                type="button"
                value={grade}
                key={index}
                className={`ml-[10px] px-[15px] py-[5px] rounded-lg ${
                  getValues("years").includes(grade as never)
                    ? DetailSelectedBUTTON
                    : DetailUnSelectedBUTTON
                }`}
                onClick={(e: any) => {
                  const gV = getValues("years");
                  const gvIdx = gV.indexOf(grade as never);
                  if (gvIdx === -1) {
                    setValue("years", [...gV, grade as never]);
                  } else {
                    setValue("years", [
                      ...gV.slice(0, gvIdx),
                      ...gV.slice(gvIdx + 1),
                    ]);
                  }
                }}
              >
                {grade}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
