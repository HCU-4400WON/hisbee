import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";

const presenseVariant = {
  initial: {
    scale: 0.5,
  },
  showing: {
    scale: 1,

    // backgroundColor: "blue",
  },
  exit: {
    scale: 0,
  },
  vibrate: {
    scale: 1,
    x: [3, -3, 3, -3, 3, -3, 3, -3, 3, -3, 3, -3, 3, -3, 3],
    outline: "none",
    backgroundColor: "#fA8072",
    transition: {
      duration: 1,
      loop: Infinity,
    },
  },
  vibrateInit: {
    scale: 1,
    outline: "none",
  },
};
export function Keywords({ getValues, setValue, register }: any) {
  // const [vibrate, setVibrate] = useState<boolean>(false);
  const MainBLUE = "bg-blue-200";
  const LightMainBLUE = "bg-blue-100";
  return (
    <div id="kk">
      <p className=" text-[20px] font-[400]">
        모임과 관련된 키워드를 입력하여 검색 결과에 노출될 수 있게 해보세요!
      </p>
      <p className="mt-[30px] mb-[15px] text-[17px]">키워드</p>
      <div className="flex items-center">
        <AnimatePresence>
          {["postTypes", "first", "second"].map((elem) =>
            getValues(elem as any)?.map(
              (v: string, index: number) =>
                v !== "기타 모임" && (
                  <motion.button
                    whileFocus="vibrate"
                    initial="vibrateInit"
                    // animate="vibrateInit"
                    variants={presenseVariant}
                    id="vibrate"
                    key={`${v}${index}`}
                    className={`flex items-center px-[20px] ${LightMainBLUE} rounded-lg py-[5px] mr-[10px]`}
                  >
                    <p>{v}</p>
                  </motion.button>
                )
            )
          )}

          {getValues("postTypes").includes("기타 모임") === true &&
            getValues("categoryETC") !== "" && (
              <motion.span
                variants={presenseVariant}
                initial="initial"
                animate="showing"
                exit="exit"
                className={`flex items-center px-[20px] ${LightMainBLUE} rounded-lg py-[5px] mr-[10px]`}
              >
                <p>{getValues("categoryETC")}</p>
              </motion.span>
            )}

          {getValues("keywords").map((keyword: string, index: number) => (
            <motion.button
              // whileHover={{
              // x: [10, -10, -10, -10, 10, -10, 10, -10, 10, -10],
              // }}
              whileFocus="vibrate"
              variants={presenseVariant}
              initial="initial"
              id="vibrate"
              animate="vibrateInit"
              exit="exit"
              key={`${keyword}${index}`}
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
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <div className="">
        <p className="mr-[20px] mt-[30px] mb-[15px] text-[17px]">키워드 입력</p>
        <div className="w-[300px]">
          <input
            type="text"
            className="w-[300px] border-b-2 h-[40px] px-[0px] bg-gray-100 border-gray-400"
            placeholder="엔터키로 키워드를 등록하세요"
            onKeyPress={async (e) => {
              if (e.key === "Enter") {
                e.preventDefault();

                const unionKeywords = [
                  ...getValues("keywords"),
                  ...getValues("postTypes"),
                  ...getValues("first"),
                  ...getValues("second"),
                ];

                if (unionKeywords.includes(getValues("keyword"))) {
                  // setVibrate(true);

                  // setTimeout(() => setVibrate(false), 1000);
                  // console.log(document.querySelectorAll("#vibrate"));

                  const allKeywordNodes = document.querySelectorAll("#vibrate");
                  for (let i = 0; i < allKeywordNodes.length; ++i) {
                    if (
                      allKeywordNodes[i].childNodes[0].textContent ===
                      getValues("keyword")
                    ) {
                      (allKeywordNodes[i] as any).focus();
                    }
                  }
                } else {
                  await setValue("keywords", [
                    ...getValues("keywords"),
                    getValues("keyword") as never,
                  ]);
                }

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
