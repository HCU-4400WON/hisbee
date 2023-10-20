import { TextField } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
export function People({ getValues, setValue, register, control }: any) {
  const MainBLUE = "bg-blue-200";

  const MajorSeletedBUTTON = `border-2 border-blue-300 ${MainBLUE} px-[15px] py-[8px] rounded-lg`;
  const UnSelectedBUTTON = `border-2 border-gray-200 bg-gray-200 text-gray-400 px-[15px] py-[8px] rounded-lg`;
  return (
    <div className="w-[55%]">
      <div>
        <span className="flex items-center text-[20px] mb-[10px]">인원 </span>
      </div>
      <div className="flex items-center">
        <button
          type="button"
          className={`${
            getValues("positionToggle") ? UnSelectedBUTTON : MajorSeletedBUTTON
          }`}
          onClick={() => setValue("positionToggle", false)}
        >
          상관 없음
        </button>
        <button
          type="button"
          className={` ml-[10px] ${
            !getValues("positionToggle") ? UnSelectedBUTTON : MajorSeletedBUTTON
          }`}
          onClick={() => setValue("positionToggle", true)}
        >
          인원 설정
        </button>
        {getValues("positionToggle") && (
          <div className="w-[300px] ml-5">
            {/* <input
              className="ml-[20px] px-[0px] h-[40px] w-full border-b border-gray-300 bg-gray-100"
              type="text"
              placeholder="ex) 1학년 9명 , 콘디생 3학년 이상 5명"
              {...register("targetCount")}
            ></input> */}

            <Controller
              name="targetCount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="ex) 1학년 9명 , 콘디생 3학년 이상 5명"
                  sx={{
                    width: "100%",
                  }}
                  variant="standard"
                />
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
