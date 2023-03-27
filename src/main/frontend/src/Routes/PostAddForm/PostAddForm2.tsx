import { Link } from "react-router-dom";





function PostAddForm2(){


    const Categories = ["동아리" , "프로젝트" , "학회" , "학술모임" , "공모전/대회" , "운동/게임/취미" , "전공 스터디" , "기타 모임"];

    return(
        <div className="p-[50px]">
            <div className="flex justify-between border-b-2 pb-[20px]">
                <span className="flex w-[210px] items-center justify-between">
                    <Link to="/post">
                        <div className="">
                        <i className="fa-solid fa-arrow-left-long text-[20px]"></i>
                        </div>
                    </Link>
                    <p className="md:text-[25px] text-[20px] font-unique">모집글 작성하기</p>
                </span>
                <div className="flex justify-between items-center">
                    
                    <div className="flex h-[40px] items-end">
                    {[ "radial-gradient(closest-side, #7b87e7, rgba(235, 235, 235, 0.13) 100%)" ,"radial-gradient(closest-side, #e3a3ff, rgba(235, 235, 235, 0.13) 100%)" , "radial-gradient(closest-side, #9c9c9c, rgba(235, 235, 235, 0.13) 100%)"].map((color,index) => (
                        <div key={index}
                        className="w-[15px] h-[15px]"
                        style={{
                        backgroundImage: color,
                        }}
                    />
                    ))}
                        </div>
                    </div>

                </div>

                <p className="flex justify-end text-[#ff0000] mt-[20px]">
                    오른쪽에 * 표시가 있는 항목은 필수 입력 항목입니다!
                </p>
                
                <form className="px-[20px]">
                    <p className="text-[20px] font-main">
                        썸네일 구성하기
                    </p>
                    <p className="mt-[10px]">
                        썸네일을 보고 어떤 모집글인지 바로 알 수 있도록 핵심 내용만 간결하게 넣어주세요!
                    </p>
                    

                <div className="w-full h-[600px] flex items-center justify-between ">
                <div className="w-[400px] h-[350px] bg-[#eeeeee] p-[30px]">
                    <div className="mb-[70px]">
                    <span className="flex items-center justify-between mb-[20px]">
                        <span className="flex items-center justify-between w-[150px]">
                            <input className="w-[70px] px-[5px] rounded-full " placeholder="일정 입력"/>
                            <input className="w-[70px] px-[5px] rounded-full " placeholder="모집유형1"/>
                        </span>
                    <i className="fa-regular fa-heart text-[23px] text-gray-400"></i>
                    </span>
                    <input className="w-[340px] text-[20px] p-[5px] mb-[10px]" type="text" placeholder="모집글 제목을 입력하세요" />
                    <input className="w-[340px] text-[15px] px-[5px] p-[2px] mb-[10px]" type="text" placeholder="모집글 제목을 입력하세요" />

                    </div>
                    <div className=" mb-[10px]">
                    <input type="text" className="px-[5px] w-[100px]" placeholder="키워드 입력"/>
                    </div>
                    <div className=" mb-[10px]">
                    <input type="text" className="px-[5px] w-[100px]" placeholder="키워드 입력"/>
                    </div>
                    <div className=" mb-[10px]">
                    <input type="text" className="px-[5px] w-[100px]" placeholder="키워드 입력"/>
                    </div>
                    
                    
                </div>



        <div className="w-[300px] h-[350px] border px-[40px] py-[30px]">
          <p>모집 기간</p>
          <span className="flex mt-[20px]">
            <input type="radio" className="mr-[10px]"/>
            <p>상시 모집</p>
          </span>

          <span className="flex mt-[20px] mb-[10px]">
            <input type="radio" className="mr-[10px]"/>
            <p>기간 설정</p>
          </span>
          <span className="pl-[30px] mb-[200px]">
            <input type="date" />
            <span className="flex pl-[30px] mt-[10px]">
                <span className="mr-[10px]">~</span>
                <input type="date" />
            </span>
          </span>
        </div>

        <div className="w-[600px] h-[350px] border px-[40px] py-[30px]">
            <p>모임 유형(카테고리)</p>
            <div className="flex">
                <div className="grid grid-cols-2 w-[300px]"> 
                {Categories.map((category,index) => (
                    (<span key={index} className="flex items-center mt-[20px]">
                        <input type="checkBox" className="mx-[10px]" />
                        <p>{category}</p>
                    </span>)
                ))}
                </div>
                <div className="flex flex-col justify-end">
                    <input type="text" className="border border-gray-400 rounded-lg w-full" placeholder="(선택입력) 기타모임유형명"/>
                </div>
            </div>
        </div>
        </div>

        </form>

        </div>
    )
}

export default PostAddForm2;