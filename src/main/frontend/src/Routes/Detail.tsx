import tw from "tailwind-styled-components";
import React from "react";

const Grid = tw.div`
grid 
grid-cols-2  
border-t-2 
border-b-2 
border-gray-300 
h-[300px] 
py-[20px] 
px-[40px]
items-center
`;

const GridItem = tw.div`
flex 
items-center 
h-[30px] 
`;

const ItemTitle = tw.span`
text-[#757575] 
text-[20px] 

w-[130px]
`;

const ItemText = tw.p`
text-[20px] 
font-medium
`;

const WriteInfoBox = tw.div`
flex 
px-[40px] 
py-[20px]
`;

const WriteInfo = tw.p`
font-semibold 
text-[18px]
mr-[10px]
`;

function Detail() {
  return (
    <div className="flex relative justify-center flex-col">
      <span className="absolute top-[100px] left-[80px] flex items-center">
        <i className="fa-solid fa-arrow-left mr-9 text-[23px]"></i>
        <p className="text-[21px] font-semibold">제목</p>
      </span>
      <span>
        <p className="absolute top-0 left-[135px] text-[21px] top-[460px] font-semibold">
          내용
        </p>
      </span>
      <div className="mx-auto w-[1000px] border-l-2 border-gray-300 border-r-2 h-full ">
        <header className=" mt-[80px] py-[20px] px-[40px] text-[22px] border-t-2 border-gray-300">
          웹개발 프로젝트 모집합니다 (디자이너, 퍼블리셔, 프론트엔드, 백엔드,
          풀스택 다 환영합니다!!)
        </header>
        <Grid>
          <GridItem>
            <ItemTitle>모집 기간</ItemTitle>
            <ItemText>2022 / 02 / 01</ItemText>
            <ItemText className=" mx-[10px]">~</ItemText>
            <ItemText>2022 / 02 / 18</ItemText>
          </GridItem>
          <GridItem>
            <ItemTitle>모집 유형</ItemTitle>
            <ItemText>프로젝트</ItemText>
          </GridItem>
          <GridItem>
            <ItemTitle>모집 인원</ItemTitle>
            <ItemText>기획자 1명 ,&nbsp;</ItemText>
            <ItemText> 개발자 2명</ItemText>
          </GridItem>
          <GridItem>
            <ItemTitle>프로젝트 기간</ItemTitle>
            <ItemText>2022 / 03 / 01</ItemText>
            <ItemText className=" mx-[10px]">~</ItemText>
            <ItemText>2022 / 03 / 31</ItemText>
          </GridItem>
          <GridItem>
            <ItemTitle>보수 유무</ItemTitle>
            <ItemText>Yes</ItemText>
          </GridItem>
          <GridItem>
            <ItemTitle>연락수단</ItemTitle>
            <ItemText>@iamjjang</ItemText>
          </GridItem>
        </Grid>
        <div className="min-h-[600px] px-[40px] py-[20px] ">content</div>
      </div>
      <WriteInfoBox className="border-t-2 border-gray-300">
        <div className="flex mx-auto w-[1000px] px-[40px]">
          <WriteInfo className="">작성자</WriteInfo>
          <WriteInfo className="mr-[40px]">김밍밍</WriteInfo>
          <WriteInfo>작성일</WriteInfo>
          <WriteInfo>2022 / 01 / 30</WriteInfo>
        </div>
      </WriteInfoBox>
    </div>
  );
}

export default Detail;
