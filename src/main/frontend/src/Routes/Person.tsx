import tw from "tailwind-styled-components";

const Item = tw.div`
 h-[190px] 
 border
 bg-[#f6f6f6]
 rounded-xl
`;

const StyledSidebar = tw.div`
w-[295px]
border
px-[20px]
pt-[20px] 
pb-[60px]
bg-[#efefef]
`;

const StyledFilterItem = tw.div`
mt-[50px]
`;

const StyledSpan = tw.span`
flex 
justify-between
`;

const StyledSubTitle = tw.p`
text-[24px] 
font-bold
`;
const StyledButton = tw.svg`
w-[16px]
`;

const Styledli = tw.li`
flex 
my-[10px]
`;

const Styledul = tw.ul`
`;

const StyledRadio = tw.input`
mr-3
`;

const StyledliText = tw.p`
text-[15px]
font-bold
`;

function Person() {
  return (
    <div className="flex  w-screen ">
      <StyledSidebar>
        <p className="text-[30px] font-bold">Filter</p>
        <StyledFilterItem>
          <StyledSpan>
            <StyledSubTitle>포지션</StyledSubTitle>
            <StyledButton
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
            </StyledButton>
          </StyledSpan>
          <Styledul>
            <Styledli>
              <StyledRadio type="radio" />
              <StyledliText>기획자</StyledliText>
            </Styledli>
            <Styledli>
              <StyledRadio type="radio" />
              <StyledliText>개발자</StyledliText>
            </Styledli>
            <Styledli>
              <StyledRadio type="radio" />
              <StyledliText>디자이너</StyledliText>
            </Styledli>
          </Styledul>
        </StyledFilterItem>

        <StyledFilterItem className="">
          <StyledSpan>
            <StyledSubTitle>학년</StyledSubTitle>
            <StyledButton
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
            </StyledButton>
          </StyledSpan>

          <Styledul>
            <Styledli>
              <StyledRadio type="radio" />
              <StyledliText>1학년</StyledliText>
            </Styledli>
            <Styledli>
              <StyledRadio type="radio" />
              <StyledliText>2학년</StyledliText>
            </Styledli>
            <Styledli>
              <StyledRadio type="radio" />
              <StyledliText>3학년</StyledliText>
            </Styledli>
            <Styledli>
              <StyledRadio type="radio" />
              <StyledliText>4학년</StyledliText>
            </Styledli>
          </Styledul>
        </StyledFilterItem>

        <StyledFilterItem className="">
          <StyledSpan>
            <StyledSubTitle>학부</StyledSubTitle>
            <StyledButton
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
            </StyledButton>
          </StyledSpan>

          <Styledul>
            <Styledli>
              <StyledRadio type="radio" />
              <StyledliText>글로벌리더십학부</StyledliText>
            </Styledli>
            <Styledli>
              <StyledRadio type="radio" />
              <StyledliText>국제어문학부</StyledliText>
            </Styledli>
            <Styledli>
              <StyledRadio type="radio" />
              <StyledliText>경영경제학부</StyledliText>
            </Styledli>
            <Styledli>
              <StyledRadio type="radio" />
              <StyledliText>법학부</StyledliText>
            </Styledli>
            <Styledli>
              <StyledRadio type="radio" />
              <StyledliText>커뮤니케이션학부</StyledliText>
            </Styledli>
            <Styledli>
              <StyledRadio type="radio" />
              <StyledliText>공간환경시스템공학부</StyledliText>
            </Styledli>
            <Styledli>
              <StyledRadio type="radio" />
              <StyledliText>기계제어공학부</StyledliText>
            </Styledli>
            <Styledli>
              <StyledRadio type="radio" />
              <StyledliText>콘텐츠융합디자인학부</StyledliText>
            </Styledli>
            <Styledli>
              <StyledRadio type="radio" />
              <StyledliText>생명과학부</StyledliText>
            </Styledli>
            <Styledli>
              <StyledRadio type="radio" />
              <StyledliText>전산전자공학부</StyledliText>
            </Styledli>
            <Styledli>
              <StyledRadio type="radio" />
              <StyledliText>상담심리사회복지학부</StyledliText>
            </Styledli>
            <Styledli>
              <StyledRadio type="radio" />
              <StyledliText>ICT창업학부</StyledliText>
            </Styledli>
          </Styledul>
        </StyledFilterItem>
      </StyledSidebar>

      <div className=" w-full mx-[60px]  flex flex-col">
        <div className="h-[240px] my-[60px] bg-[#898989] rounded-xl"></div>
        <div className="grid grid-cols-4 gap-10 w-full justify-between">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <Item>
              <div className="flex border rounded-full bg-white m-2 w-[65px] h-[25px] justify-center items-center">
                <p className="text-[13px] font-bold">디자이너</p>
              </div>
              <div className="flex flex-col items-center">
                <img src="img/user.png" className="rounded-full w-[50px]" />
                <p className="text-[18px] mt-[7px]">김밍밍</p>
                <p className="text-[12px] mt-[3px] text-[#aaaaaa]">
                  콘텐츠융합디자인학부
                </p>
                <p className="text-[12px] mt-[3px] text-[#aaaaaa]">3학년</p>
              </div>
            </Item>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Person;
