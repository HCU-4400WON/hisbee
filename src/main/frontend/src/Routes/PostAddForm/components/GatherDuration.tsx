import { LightMainBLUE } from "./color";

// import { FunctionButton } from "components/FunctionButton";
const FunctionButton = `${LightMainBLUE} text-blue-600 rounded-lg px-[15px] py-[8px]`;
export default function GatherDuration({ register, setValue }: any) {
  return (
    <div className="w-[400px] h-[350px] px-[60px] py-[30px]">
      <span className="text-[#ff0000]">*</span>
      <span className=""> 모집 기간</span>

      <span className="pl-[30px] mb-[200px]">
        <span className="mt-[20px] flex items-center mb-[10px]">
          <p className="mr-[15px] w-[30px]">시작</p>
          <input
            className={`w-[140px] bg-slate-100 text-blue-500`}
            type="date"
            {...register("recruitStart")}
          />
        </span>

        <span className="flex items-center">
          <p className="mr-[15px] ">마감</p>
          <input
            type="date"
            className="w-[140px] bg-slate-100 text-blue-500"
            {...register("recruitEnd")}
          />
        </span>
        <button
          type="button"
          className={` ${FunctionButton} float-right mt-[20px] `}
          onClick={() => setValue("recruitEnd", null)}
        >
          상시 모집
        </button>
      </span>
    </div>
  );
}
