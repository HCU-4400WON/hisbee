import { AnimatePresence, motion } from "framer-motion";
import { IPostExample, PostExamples } from "./PostExamples";
import { useState } from "react";
import Thumbnail from "./Thumbnail";

interface IProps {
  getValues: any;
}
export default function PostExamplesButton({ getValues }: IProps) {
  const [postExampleToggle, setPostExampleToggle] = useState<boolean>(false);

  return (
    <>
      {!postExampleToggle && (
        <button
          type="button"
          className={`bg-white py-[5px] text-[16px] px-[15px] border-2 border-blue-500 text-blue-500 rounded-lg font-[400]`}
          onClick={(e) => setPostExampleToggle(true)}
        >
          다른 모집글은 어떻게 작성되었는지 살펴보세요!
        </button>
      )}

      <AnimatePresence>
        {postExampleToggle && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1.1 }}
            exit={{ scale: 0 }}
            transition={{ type: "linear" }}
            className="origin-top-right w-[600px] rounded-xl overflow-hidden absolute right-0"
          >
            <div className="w-[600px] h-[50px] flex px-[20px] justify-between items-center bg-white">
              <p>다른 모집글은 어떻게 작성되었는지 살펴보세요!</p>
              <button type="button" onClick={() => setPostExampleToggle(false)}>
                닫기
              </button>
            </div>
            <motion.div className="w-600px h-[300px] bg-gray-200 flex items-center overflow-scroll ">
              {postExampleToggle &&
                (
                  PostExamples[
                    (getValues("postTypes").length === 0
                      ? "선택안됨"
                      : getValues("postTypes")[0]) as never
                  ] as IPostExample[]
                )?.map((postExample: IPostExample, index: number) => (
                  <Thumbnail {...postExample} key={index} />
                ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
