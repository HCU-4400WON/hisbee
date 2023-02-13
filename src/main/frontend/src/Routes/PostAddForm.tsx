import tw from "tailwind-styled-components";

const StyledUl = tw.ul`
flex
`;

const Styledli = tw.li`
  flex
`;

const StyledInput = tw.input`
mr-[10px]
`;

const StyledInputName = tw.p`
mr-[20px]
`;
const StyledInputNumber = tw.input`
  w-[40px]
  border-b-2
  border-gray-300
  mx-[10px]

`;
const StyledFieldTitle = tw.p`
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

function PostAddForm() {
  return (
    <div className="px-[100px] py-[50px]">
      <p className="w-full text-[30px] font-normal">모집글 작성하기</p>
      <FieldContainer>
        <FieldRow>
          <FieldBox>
            <StyledFieldTitle>모집유형</StyledFieldTitle>
            <StyledUl>
              <Styledli>
                <StyledInput type="radio" />
                <StyledInputName>스터디</StyledInputName>
              </Styledli>
              <Styledli>
                <StyledInput type="radio" />
                <StyledInputName>멘토링</StyledInputName>
              </Styledli>
              <Styledli>
                <StyledInput type="radio" />
                <StyledInputName>프로젝트</StyledInputName>
              </Styledli>
            </StyledUl>
          </FieldBox>

          <FieldBox>
            <StyledFieldTitle>모집인원</StyledFieldTitle>
            <StyledUl>
              <Styledli>
                <p>기획자</p>
                <StyledInputNumber type="number" />
              </Styledli>
              <Styledli>
                <p>디자이너</p>
                <StyledInputNumber type="number" />
              </Styledli>
              <Styledli>
                <p>개발자</p>
                <StyledInputNumber type="number" />
              </Styledli>
            </StyledUl>
          </FieldBox>
        </FieldRow>

        <FieldRow className="my-[30px]">
          <FieldBox>
            <StyledFieldTitle>프로젝트 기간</StyledFieldTitle>

            <input type="date" />
          </FieldBox>
          <FieldBox>
            <StyledFieldTitle>모집 기간</StyledFieldTitle>

            <input type="date" />
          </FieldBox>
        </FieldRow>

        <FieldRow>
          <FieldBox>
            <StyledFieldTitle>연락수단</StyledFieldTitle>
            <input type="text" />
          </FieldBox>
          <FieldBox>
            <StyledFieldTitle>보수 유무</StyledFieldTitle>

            <StyledUl>
              <Styledli>
                <StyledInput type="radio" />
                <StyledInputName>Yes</StyledInputName>
              </Styledli>
              <Styledli>
                <StyledInput type="radio" />
                <StyledInputName>No</StyledInputName>
              </Styledli>
            </StyledUl>
          </FieldBox>
        </FieldRow>
      </FieldContainer>

      <div className="flex mb-[40px]">
        <p className="w-[130px] text-[20px] my-auto">제목</p>
        <input type="text" className="w-full bg-[#eeeeee] h-[40px]" />
      </div>

      <div className="flex">
        <p className="w-[130px] text-[20px]">내용</p>
        <textarea className="w-full bg-[#eeeeee] h-[345px]" />
      </div>

      <button className="my-[40px] bg-[#eeeeee] rounded-full w-[120px] h-[30px] text-[15px] float-right">
        올리기
      </button>
    </div>
  );
}

export default PostAddForm;
