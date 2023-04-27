import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

export function Duration({ getValues, setValue, register }: any) {
  const duration = [
    "미설정",
    "봄학기",
    "가을학기",
    "여름방학",
    "겨울방학",
    "1년",
    "1학기",
    "2학기",
    "3학기",
    "4학기",
    "직접 입력",
  ];
  return (
    <div className="w-[40%] ">
      <p className="text-[18px]">활동 기간</p>
      <div className=" mt-[20px] text-[17px] flex items-center">
        <select
          {...register("duration")}
          className=" mr-[20px] pr-[10px] pl-[10px] py-[5px] bg-gray-200 rounded-lg"
        >
          {duration.map((duration, index) => (
            <option key={index}>{duration}</option>
          ))}
        </select>
        {getValues("duration") === "직접 입력" && (
          <div className="w-[250px] mr-[20px]">
            <input
              {...register("durationText")}
              type="text"
              className="h-[30px] bg-gray-100 w-full border-b-2 border-gray-400 px-[10px]"
              placeholder="ex) 가을학기 ~ 겨울방학"
            />
          </div>
        )}

        <p>동안</p>
      </div>
    </div>
  );
}
