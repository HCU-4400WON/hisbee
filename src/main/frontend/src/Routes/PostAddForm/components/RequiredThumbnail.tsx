import { AnimatePresence, motion } from "framer-motion";
import tw from "tailwind-styled-components";
import { convertDateToString } from "./PostExamples";
import Soon from "components/Soon";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import { LightMainBLUE } from "./color";

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

const Thumbnail = tw.div`
min-w-[400px] border h-[350px] mt-[30px] bg-white p-[30px] rounded-2xl shadow-sm
`;

const DDayHeartRow = tw.div`
flex items-center justify-between mb-[20px]
`;

const DDayRow = tw.span`
flex items-center
`;
const DDay = tw.span`
px-[10px] py-[3px] rounded-full bg-gray-200 font-light
`;

const ThumbnailHeart = tw.i`
fa-regular fa-heart text-[23px] text-gray-400
`;

const TitleRow = tw.div`
flex relative
`;

const RequireRepresentation = tw.span`
text-[#ff0000] absolute left-[-10px]
`;

const SummaryRow = tw.div`
h-[80px]
`;

const PostTypesRow = tw.div`
flex items-center
`;

const ThumbnailKeywordsButton = tw(motion.div)`
  text-[15px] px-[15px] py-[2px] rounded-full mr-[10px] bg-blue-100
`;

const PostTypesButton = tw(motion.div)`
  min-h-[28px] py-[2px] mb-[15px] px-[15px] rounded-full mr-[10px] bg-blue-200 
`;

const KeywordRow = tw.div`
flex mb-[10px] h-[30px]
`;

const KeywordDeleteIcon = tw.i`
fa-solid fa-xmark ml-[5px]
`;

const KeywordInputContainer = tw.div`
relative
`;

const KeywordInputRow = tw.div`
  flex items-center absolute
`;

const CustomKeywordInput = tw.input`
KeywordInput py-[2px] text-[15px] px-[15px] rounded-full ${LightMainBLUE}
`;

const KeywordAddIcon = tw.button`
absolute right-0 px-[10px] ml-[5px] rounded-full text-blue-500
`;

export default function RequiredThumbnail({
  getValues,
  setValue,
  control,
  register,
}: any) {
  const handleThumbnailKeywordDelete = (
    LineIndex: number,
    keywordIndex: number
  ) => {
    // first , second keywords 구분하여 삭제
    // console.log(LineIndex);

    let v: any;
    if (LineIndex === 0) v = "first";
    else v = "second";

    const gv = getValues(v) as any;

    setValue(v, [...gv.slice(0, keywordIndex), ...gv.slice(keywordIndex + 1)]);
  };

  const handleKeywordInputBlur = async (lineObj: any) => {
    if (getValues(lineObj.str as any) !== "") {
      setValue(
        lineObj.array as any,
        (await [
          ...getValues(lineObj.array as any),
          getValues(lineObj.str as any),
        ]) as never
      );
      setValue(lineObj.str as any, "");
    }
  };

  const handleKeywordInputKeyPress = async (lineObj: any, e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (getValues(lineObj.str as any) === "") return;
      setValue(
        lineObj.array as any,
        (await [
          ...getValues(lineObj.array as any),
          getValues(lineObj.str as any),
        ]) as never
      );
      setValue(lineObj.str as any, "");
    }
  };

  const handleKeywordAdd = async (lineObj: any) => {
    if (getValues(lineObj.str as any) === "") return;
    setValue(
      lineObj.array as any,
      (await [
        ...getValues(lineObj.array as any),
        getValues(lineObj.str as any),
      ]) as never
    );
    setValue(lineObj.str as any, "");
  };

  return (
    <Thumbnail>
      <DDayHeartRow>
        <DDayRow>
          <DDay>
            {convertDateToString(
              getValues("recruitStart"),
              getValues("recruitEnd")
            )}
          </DDay>
          <Soon
            bgColor="bg-gray-200"
            recruitStart={new Date()}
            recruitEnd={getValues("recruitEnd")}
            closed={false}
          />
        </DDayRow>
        <ThumbnailHeart />
      </DDayHeartRow>
      <TitleRow>
        <RequireRepresentation>*</RequireRepresentation>
        <Controller
          name="title"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              variant="standard"
              color="primary"
              sx={{
                width: "100%",
                mb: 1,
                "& input": {
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                },
              }}
              placeholder="제목을 입력해주세요"
            />
          )}
        />
      </TitleRow>

      <SummaryRow>
        <Controller
          name="summary"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              variant="standard"
              color="primary"
              sx={{ width: "100%", mb: 1 }}
              placeholder="(선택) 간결한 설명글을 적어주세요"
            />
          )}
        />
      </SummaryRow>

      <PostTypesRow>
        <AnimatePresence>
          {getValues("postTypes").length !== 0 &&
            getValues("postTypes").map((category: string, index: number) => (
              <PostTypesButton
                key={index}
                variants={presenseVariant}
                initial="initial"
                animate="showing"
                exit="exit"
              >
                {category === "기타 모임" ? getValues("categoryETC") : category}
              </PostTypesButton>
            ))}
        </AnimatePresence>
      </PostTypesRow>
      {[
        { array: "first", str: "firstKeyword" },
        { array: "second", str: "secondKeyword" },
      ].map((lineObj, LineIndex) => (
        <KeywordRow key={LineIndex}>
          {/* firstLine Keyword */}
          <AnimatePresence>
            {getValues(lineObj.array as any)?.map(
              (keyword: string, keywordIndex: number) => (
                <ThumbnailKeywordsButton
                  key={keywordIndex}
                  variants={presenseVariant}
                  initial="initial"
                  animate="showing"
                  exit="exit"
                >
                  {keyword}
                  <KeywordDeleteIcon
                    onClick={() =>
                      handleThumbnailKeywordDelete(LineIndex, keywordIndex)
                    }
                  />
                </ThumbnailKeywordsButton>
              )
            )}
          </AnimatePresence>
          <KeywordInputContainer>
            {getValues(lineObj.array as any).length < 3 && (
              <KeywordInputRow>
                <CustomKeywordInput
                  type="text"
                  style={{
                    width:
                      getValues(lineObj.str as any).length > 5
                        ? (getValues(lineObj.str as any).length + 5) * 12
                        : "110px",
                  }}
                  {...register(lineObj.str as any)}
                  onKeyPress={(e) => handleKeywordInputKeyPress(lineObj, e)}
                  onBlur={() => handleKeywordInputBlur(lineObj)}
                  placeholder="키워드 입력"
                  maxLength={10}
                />

                <KeywordAddIcon
                  type="button"
                  onClick={() => handleKeywordAdd(lineObj)}
                >
                  {" "}
                  +{" "}
                </KeywordAddIcon>
              </KeywordInputRow>
            )}
          </KeywordInputContainer>
        </KeywordRow>
      ))}
    </Thumbnail>
  );
}
