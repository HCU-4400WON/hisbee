import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import tw from "tailwind-styled-components";

const StyledUl = tw.ul`
flex


`;

const Styledli = tw.li`
  flex
  items-center
`;

const StyledInput = tw.input`
mr-[10px]
`;

const StyledInputName = tw.label`
mr-[20px]
`;
const StyledInputNumber = tw.input`
  w-[40px]
  border-b-2
  border-gray-300
  mx-[10px]

`;
const StyledFieldTitle = tw.label`
w-[130px] 
font-normal
`;

const FieldBox = tw.div`
w-1/2
flex

`;

const FieldRow = tw.div`
 flex
 
`;

const FieldContainer = tw.div`
border-b-2 
border-t-2 
border-gray-300
align-center 
py-[30px]
mt-[30px]
mb-[40px]
`;

const StyledSpan = tw.span`
px-[30px]
`;

const ValidationVariant = {
  hidden: {
    y: -10,
    color: "red",
    opacity: 0,
  },

  showing: {
    y: 0,
    opacity: 1,
  },

  exit: {
    y: 10,
    opacity: 0,
  },
};

function PostAddForm() {
  const { register, handleSubmit, watch, setError, formState } = useForm({
    mode: "onSubmit",
    defaultValues: {
      category: "",
      projectStart: "",
      projectEnd: "",
      postStart: "",
      postEnd: "",
      contact: "",
      developer: "0",
      planner: "0",
      designer: "0",
      pay: "",
      title: "",
      content: "",
    },
  });

  const onValid = (data: any) => {
    console.log(data);
    if (+data.developer + +data.planner + +data.designer === 0) {
      setError("developer", { message: "0보다 커야 합니다." });
    }
    if (data.projectStart >= data.projectEnd) {
      setError("projectEnd", { message: "마감일이 이릅니다." });
    }
    if (data.postStart >= data.postEnd) {
      setError("postEnd", { message: "마감일이 이릅니다." });
    }
  };

  console.log(formState.errors);

  return (
    <form onSubmit={handleSubmit(onValid)} className="px-[100px] py-[50px]">
      <p className="w-full text-[30px] font-normal">모집글 작성하기</p>
      <FieldContainer>
        <FieldRow>
          <FieldBox>
            <StyledFieldTitle>모집유형</StyledFieldTitle>
            <StyledUl>
              <Styledli>
                <StyledInput
                  id="study"
                  type="radio"
                  {...register("category", {
                    required: "필수 항목입니다.",
                  })}
                />
                <StyledInputName htmlFor="study">스터디</StyledInputName>
              </Styledli>
              <Styledli>
                <StyledInput
                  id="mentoring"
                  type="radio"
                  {...register("category", {
                    required: "필수 항목입니다.",
                  })}
                />
                <StyledInputName htmlFor="mentoring">멘토링</StyledInputName>
              </Styledli>
              <Styledli>
                <StyledInput
                  id="project"
                  type="radio"
                  {...register("category", {
                    required: "필수 항목입니다.",
                  })}
                />
                <StyledInputName htmlFor="project">프로젝트</StyledInputName>
              </Styledli>

              <AnimatePresence>
                {(formState.errors.category?.message as string) && (
                  <motion.li
                    variants={ValidationVariant}
                    className="text-xs my-auto"
                    initial="hidden"
                    animate="showing"
                    exit="exit"
                  >
                    *{formState.errors.category?.message as string}
                  </motion.li>
                )}
              </AnimatePresence>
            </StyledUl>
          </FieldBox>

          <FieldBox>
            <StyledFieldTitle>모집인원</StyledFieldTitle>
            <StyledUl>
              <Styledli>
                <label htmlFor="planner">기획자</label>
                <StyledInputNumber
                  {...register("planner", { required: "필수 사항 입니다." })}
                  min="0"
                  id="planner"
                  type="number"
                />
              </Styledli>
              <Styledli>
                <label htmlFor="designer">디자이너</label>
                <StyledInputNumber
                  {...register("designer")}
                  min="0"
                  id="designer"
                  type="number"
                />
              </Styledli>
              <Styledli>
                <label htmlFor="developer">개발자</label>
                <StyledInputNumber
                  {...register("developer")}
                  min="0"
                  id="developer"
                  type="number"
                />
              </Styledli>

              <AnimatePresence>
                {(formState.errors.developer?.message as any) && (
                  <motion.li
                    variants={ValidationVariant}
                    className="text-xs my-auto"
                    initial="hidden"
                    animate="showing"
                    exit="exit"
                  >
                    * {formState.errors.developer?.message as any}
                  </motion.li>
                )}
              </AnimatePresence>
            </StyledUl>
          </FieldBox>
        </FieldRow>

        <FieldRow className=" relative my-[30px]">
          <FieldBox>
            <StyledFieldTitle htmlFor="projectStart">
              프로젝트 기간
            </StyledFieldTitle>

            {/* <div className="flex"> */}
            <input
              id="projectStart"
              {...register("projectStart", {
                required: "필수 항목입니다.",
              })}
              type="date"
            />
            <StyledSpan>~</StyledSpan>
            <input
              {...register("projectEnd", {
                required: "필수 항목입니다.",
              })}
              type="date"
            />
            {/* </div> */}
            <AnimatePresence>
              {((formState.errors.projectStart?.message as string) ||
                (formState.errors.projectEnd?.message as string)) && (
                <motion.div
                  variants={ValidationVariant}
                  className="text-xs my-auto mx-5"
                  initial="hidden"
                  animate="showing"
                  exit="exit"
                >
                  *{" "}
                  {(formState.errors.projectStart?.message as string) ||
                    (formState.errors.projectEnd?.message as string)}
                </motion.div>
              )}
            </AnimatePresence>
          </FieldBox>
          <FieldBox>
            <StyledFieldTitle htmlFor="postStart">모집 기간</StyledFieldTitle>

            <input
              id="postStart"
              {...register("postStart", {
                required: "필수 항목입니다.",
              })}
              type="date"
            />
            <StyledSpan>~</StyledSpan>
            <input
              className="w-[150px] border"
              {...register("postEnd", {
                required: "필수 항목입니다.",
              })}
              type="date"
            />

            <AnimatePresence>
              {((formState.errors.postStart?.message as string) ||
                (formState.errors.postEnd?.message as string)) && (
                <motion.div
                  variants={ValidationVariant}
                  className="text-xs my-auto mx-5"
                  initial="hidden"
                  animate="showing"
                  exit="exit"
                >
                  *{" "}
                  {(formState.errors.postStart?.message as string) ||
                    (formState.errors.postEnd?.message as string)}
                </motion.div>
              )}
            </AnimatePresence>
          </FieldBox>
        </FieldRow>

        <FieldRow>
          <FieldBox>
            <StyledFieldTitle htmlFor="contact">연락 수단</StyledFieldTitle>
            <input
              className="bg-[#eeeeee]"
              id="contact"
              type="text"
              {...register("contact", {
                required: "필수 항목입니다.",
              })}
            />

            <AnimatePresence>
              {(formState.errors.contact?.message as string) && (
                <motion.div
                  variants={ValidationVariant}
                  className="text-xs my-auto mx-5"
                  initial="hidden"
                  animate="showing"
                  exit="exit"
                >
                  * {formState.errors.contact?.message as string}
                </motion.div>
              )}
            </AnimatePresence>
          </FieldBox>
          <FieldBox>
            <StyledFieldTitle>보수 유무</StyledFieldTitle>

            <StyledUl>
              <Styledli>
                <StyledInput
                  id="yes"
                  {...register("pay", {
                    required: "보수 유무는 필수 항목입니다.",
                  })}
                  type="radio"
                />
                <StyledInputName htmlFor="yes">Yes</StyledInputName>
              </Styledli>
              <Styledli>
                <StyledInput
                  id="no"
                  {...register("pay", {
                    required: "필수 항목입니다.",
                  })}
                  type="radio"
                />
                <StyledInputName htmlFor="no">No</StyledInputName>
              </Styledli>
            </StyledUl>

            <AnimatePresence>
              {(formState.errors.pay?.message as string) && (
                <motion.div
                  variants={ValidationVariant}
                  className="text-xs my-auto"
                  initial="hidden"
                  animate="showing"
                  exit="exit"
                >
                  * {formState.errors.pay?.message as string}
                </motion.div>
              )}
            </AnimatePresence>
          </FieldBox>
        </FieldRow>
      </FieldContainer>

      <div className="flex mb-[40px] relative">
        <label htmlFor="title" className="w-[130px] text-[20px] my-auto">
          제목
        </label>
        <input
          {...register("title", {
            minLength: {
              value: 5,
              message: "제목이 너무 짧습니다.",
            },
          })}
          id="title"
          type="text"
          className="w-full bg-[#eeeeee] h-[40px]"
        />
        <AnimatePresence>
          {(formState.errors.title?.message as string) && (
            <motion.div
              variants={ValidationVariant}
              className="absolute text-xs my-auto mx-5 bottom-[-20px] left-[100px]"
              initial="hidden"
              animate="showing"
              exit="exit"
            >
              * {formState.errors.title?.message as string}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex relative">
        <label htmlFor="content" className="w-[130px] text-[20px]">
          내용
        </label>
        <textarea
          {...register("content", {
            minLength: {
              value: 5,
              message: "내용이 너무 짧습니다.",
            },
          })}
          id="content"
          className="w-full bg-[#eeeeee] h-[345px]"
        />
        <AnimatePresence>
          {(formState.errors.content?.message as string) && (
            <motion.div
              variants={ValidationVariant}
              className="absolute text-xs my-auto mx-5 bottom-[-20px] left-[100px]"
              initial="hidden"
              animate="showing"
              exit="exit"
            >
              * {formState.errors.content?.message as string}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <input
        type="submit"
        className="my-[40px] bg-[#eeeeee] rounded-full w-[120px] h-[30px] text-[15px] float-right"
        value="올리기"
      />
    </form>
  );
}

export default PostAddForm;
