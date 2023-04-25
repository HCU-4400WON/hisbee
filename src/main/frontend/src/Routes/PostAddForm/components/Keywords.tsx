import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";

const presenseVariant = {
  initial: {
    scale: 0.5,
  },
  showing: {
    scale: 1,
  },
  exit: {
    scale: 0,
  },
};

interface IProps {
  ETCToggle: string[] | [];
  setETCToggle: React.Dispatch<React.SetStateAction<string[] | []>>;
}

export function Keywords(
  { getValues, setValue, register }: UseFormReturn,
  { ETCToggle, setETCToggle }: IProps
) {
  const MainBLUE = "bg-blue-200";
  const LightMainBLUE = "bg-blue-100";
  return (
    <div>
      <p className=" text-[20px]">
        모임과 관련된 키워드를 입력하여 검색 결과에 노출될 수 있게 해보세요!
      </p>
      <p className="mt-[30px] mb-[15px] text-[17px]">키워드</p>
      <div className="flex items-center">
        {["postTypes", "first", "second"].map((elem) =>
          getValues(elem as any)?.map(
            (v: string, index: number) =>
              v !== "기타 모임" && (
                <span
                  key={index}
                  className={`flex items-center px-[20px] ${LightMainBLUE} rounded-lg py-[5px] mr-[10px]`}
                >
                  <p>{v}</p>
                </span>
              )
          )
        )}

        {ETCToggle && getValues("categoryETC") !== "" && (
          <span
            className={`flex items-center px-[20px] ${LightMainBLUE} rounded-lg py-[5px] mr-[10px]`}
          >
            <p>{getValues("categoryETC")}</p>
          </span>
        )}
        <AnimatePresence>
          {getValues("keywords").map((keyword, index) => (
            <motion.span
              variants={presenseVariant}
              initial="initial"
              animate="showing"
              exit="exit"
              key={index}
              className={`flex items-center px-[20px] ${LightMainBLUE} rounded-lg py-[5px] mr-[10px]`}
            >
              <p className="mr-[10px]">{keyword}</p>
              <i
                className="fa-solid fa-xmark mt-[2px] text-gray-400"
                onClick={() =>
                  setValue("keywords", [
                    ...getValues("keywords").slice(0, index),
                    ...getValues("keywords").slice(index + 1),
                  ])
                }
              ></i>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <div className="">
        <p className="mr-[20px] mt-[30px] mb-[15px] text-[17px]">키워드 입력</p>
        <div className="w-[300px]">
          <input
            type="text"
            className="w-[300px] border-b-2 h-[40px] px-[10px] bg-gray-100 border-gray-400"
            placeholder="엔터키로 키워드를 등록하세요"
            onKeyPress={async (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                await setValue("keywords", [
                  ...getValues("keywords"),
                  getValues("keyword") as never,
                ]);

                setValue("keyword", "");
              }
            }}
            {...register("keyword")}
          />
        </div>
      </div>
    </div>
  );
}
