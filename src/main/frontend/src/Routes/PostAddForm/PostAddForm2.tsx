import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";




function PostAddForm2(){

    const converter = (what : string , info ?: string | Date) => {
        
        if(what === "year"){
            let year = ((info as Date).getFullYear() + "").padStart(2, "0");
            let month = (((info as Date).getMonth() +1) + "").padStart(2, "0");
            let date = (info as Date).getDate();
            let convertedDate = year + "-" + month + "-" + date;
            console.log(convertedDate);
            return convertedDate;
        }
    }

    const dateDifference = (end : string) => {
        const date1 = new Date(converter("year" , new Date())! );
        const date2 = new Date(end);

        const diffDate = date1.getTime() - date2.getTime();

        return Math.abs(diffDate / (1000 * 60 * 60 * 24));
    }

const {register, watch ,formState , handleSubmit , getValues , setValue} = useForm({ mode: "onSubmit",
defaultValues: {
    categories : [],
    durationIndex : "1",
    postStart : converter("year" , new Date()),
    postEnd : converter("year", new Date()),
    title : "",
    subTitle : "",
    keywordsFirstLine : [],
    keywordsSecondLine : [],
    keywordsThirdLine : [],
    position : "",
    positionNum : "",
    grades : [],
    majors : [],

} });


watch("categories");
watch("durationIndex");
watch("postStart");
watch("postEnd");
watch("position");
watch("positionNum");

interface IPositionList {
    position : string,
    positionNum : number
}

    const [positionList , setPositionList] = useState<IPositionList[] | []>([]);

// const categoriesWatch = watch("categories");
// https://dotorimook.github.io/post/2020-10-05-rhf-watch-vs-getvalues/

    useEffect( () => {
        console.log("changed");
    } , [])

    const onSubmit = () =>{
        console.log(getValues("grades"));
        console.log(getValues("majors"));
    }

    const Categories = ["동아리" , "프로젝트" , "학회" , "학술모임" , "공모전/대회" , "운동/게임/취미" , "전공 스터디" , "기타 모임"];

    // const onClick = (e : React.FormEvent<HTMLButtonElement>) => {
    //     const selectedId = e.currentTarget.id;
        
    // // }
    // const onDelete = (id : number) => {
    //     ;
    // }
    

    const Grades = ["상관없음" , "23학번 새내기" , "1학년" , "2학년" , "3학년" , "4학년" , "9학기 이상"];
    const Majors = [
        {"상관없음":[]},
        {"경영경제학부" : ["경영학", "경제학" , "GM"]},
        {"상당심리사회복지학부" : ["상담심리학" , "사회복지학"]},
        {"생명과학부" : ["생명과학부"]},
        {"전산전자공학부" : ["AI 컴퓨터공학심화" , "컴퓨터공학" , "전자공학심화"]},
        {"ICT창업학부" : ["GE" , "ICT융합" , "ACE"]},
        {"커뮤니케이션학부" : ["언론정보학" , "공연영상학"]},
        {"기계제어공학부" : ["기계공학" , "전자제어공학"]},
        {"국제어문학부" : ["국제지역학", "영어"]},
        {"법학부" : ["한국법", "UIL"]},
        {"공간환경시스템공학부" : ["건설공학" , "도시환경공학"]},
        {"콘텐츠융합디자인학부" : ["시각디자인" , "제품디자인"]},            
    ]
        
    const [visible, setVisible] = useState<Boolean[]>(Array.from({length : Majors.length}, ()=>false));
    

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
                
            <form onSubmit={handleSubmit(onSubmit)} className="px-[20px]">
                <p className="text-[20px] font-main">
                    썸네일 구성하기
                </p>
                <p className="mt-[10px]">
                    썸네일을 보고 어떤 모집글인지 바로 알 수 있도록 핵심 내용만 간결하게 넣어주세요!
                </p>
                    

                <div className="w-full h-[600px] flex items-center justify-between ">
                    <div className="w-[400px] h-[350px] bg-[#eeeeee] p-[30px]">
                        <div className="mb-[50px]">
                        <span className="flex items-center justify-between mb-[20px]">
                            <span className="flex items-center">
                                {/* <input className="w-[70px] px-[10px] rounded-full mr-[20px]" placeholder="일정 입력"/> */}
                                {/* <input className="w-[70px] px-[5px] rounded-full " placeholder="모집유형1"/> */}
                                <span  className="px-[10px] rounded-full mr-[20px] bg-white">
                                {getValues("durationIndex") === "0" ? 
                                        "상시 모집"
                                 : new Date(getValues("postStart")!) > new Date() ?
                                 "모집 예정"
                                  : "D-"+ dateDifference(getValues("postEnd")! )}
                                </span>

                                {getValues("categories").length !==0 && getValues("categories").map((category : string, index : number) => 
                                    <span className="bg-white px-[10px] rounded-full mr-[10px]" key={index}>{category}</span>
                                )}
                            </span>
                        <i className="fa-regular fa-heart text-[23px] text-gray-400"></i>
                        </span>
                        <input className="w-[340px] text-[20px] p-[5px] mb-[10px]" {...register("title")} type="text" placeholder="모집글 제목을 입력하세요" />
                        <textarea className="w-[340px] text-[15px] px-[5px] p-[2px]" {...register("subTitle")} placeholder="모집글 제목을 입력하세요" />

                        </div>
                        <div className="mb-[10px]">
                        <input type="text" className="px-[5px] w-[100px]" placeholder="키워드 입력"/>
                        </div>
                        <div className=" mb-[10px]">
                        <input type="text" className="px-[5px] w-[100px]" placeholder="키워드 입력"/>
                        </div>
                        <div className=" mb-[10px]">
                        <input type="text" className="px-[5px] w-[100px]" placeholder="키워드 입력"/>
                        </div>
                        
                        
                    </div>



                    <div className="w-[270px] h-[350px] px-[40px] py-[30px]">
                        <p>모집 기간</p>
                        <span className="flex mt-[20px]">
                            <input type="radio" {...register("durationIndex")} value="0" className="mr-[10px]"/>
                            <p>상시 모집</p>
                        </span>

                        <span className="flex mt-[20px] mb-[10px]">
                            <input {...register("durationIndex")} type="radio" value="1" className="mr-[10px]"/>
                            <p>기간 설정</p>
                        </span>
                        {getValues("durationIndex") === "1" && (<span className="pl-[30px] mb-[200px]">
                            <input type="date" {...register("postStart")}/>
                            <span className="flex pl-[30px] mt-[10px]">
                                <span className="mr-[10px]">~</span>
                                <input type="date" {...register("postEnd")}/>
                            </span>
                        </span>)}
                        
                    </div>

                    <div className="w-[600px] h-[350px] px-[40px] py-[30px]">
                        <p>모임 유형(카테고리)</p>
                        <div className="flex">
                            <div className="grid grid-cols-2 w-[300px]"> 
                            {Categories.map((category,index) => (
                                (<span key={index} className="flex items-center mt-[20px]">
                                    <input {...register("categories")} value={category} type="checkBox" className="mx-[10px]" />
                                    <p>{category}</p>
                                </span>)
                            ))}
                            </div>
                            <div className="flex flex-col justify-end">
                                <input type="text" className="border border-gray-400 rounded-lg w-full px-[10px]" placeholder="(선택) 기타 모임"/>
                            </div>
                        </div>
                    </div>
                </div>
                                <button>제출 테스트</button>
                <div>
                    <p className="text-[20px] font-main">최소 내용 입력하기</p>
                    <p className="mt-[10px]">모집글을 완성하기 위한 최소한의 내용을 적어주세요!</p>
                    <div className="flex">
                        <div className="w-[400px] h-[250px]  mt-[20px]">
                            <p className="">모집 인원</p>
                            <span className="flex mt-[10px]">
                                <input className="border-2 rounded-lg px-[10px] " {...register("position")} placeholder="(선택) 포지션" type="text" />
                                <input className="border-2 max-w-[70px] rounded-lg px-[10px] ml-[10px]" {...register("positionNum")} placeholder="인원" type="number" />
                                <p className="ml-[5px]">명</p>
                            </span>
                            
                            {positionList.length > 0 && (
                                positionList?.map((elem , index) => (
                                    <div  key={index} className="flex items-center justify-between bg-slate-200 px-[10px] w-[200px] lg:w-[300px] xl:w-[400px]  h-[30px] mt-[10px]">
                                    <i className="fa-solid fa-link"></i>
                                    <p>{elem.position}</p> 
                                    {/* <p>{elem.positionNum}명</p> */}
                                    <span className="flex items-center">
                                        <span onClick={() => {
                                            const newElem = {
                                                position : elem.position,
                                                positionNum : elem.positionNum + 1,
                                            }
                                            setPositionList( prev => [...prev.slice(0,index) , newElem ,...prev.slice(index+1)]);
                                        }}>+</span>
                                        <p className="mx-[10px]">{elem.positionNum}명</p>
                                        <span onClick={() => {
                                            const newElem = {
                                                position : elem.position,
                                                positionNum : elem.positionNum - 1,
                                            }
                                            setPositionList( prev => [...prev.slice(0,index) , newElem ,...prev.slice(index+1)]);
                                        }}>-</span>
                                    </span>
                                    <i
                                        className="fa-regular fa-trash-can"
                                        onClick={ () => setPositionList( prev => [...prev.slice(0,index) , ...prev.slice(index+1)]) }
                                    ></i>
                                     </div>
                                ))
                                
                            )}
                            <button className="border w-[25px] h-[25px] rounded-lg mt-[40px]"
                            onClick={ () => {

                               if (positionList.find((elem) => elem.position === getValues("position")) || (positionList.find((elem) => elem.position === "아무나") && getValues("position")==="")){

                                setValue("position","");
                                setValue("positionNum" ,"");
                                return;
                               } 
                                const newPosition = {
                                    position : getValues("position") !== ""  ? getValues("position") :"아무나",
                                    positionNum : +getValues("positionNum"),
                                }
                                setPositionList( prev => [...prev , newPosition]);
                                setValue("position","");
                                setValue("positionNum" ,"");
                            
                            }}>+</button>
                        </div>
                        <div className="w-[800px] h-[250px] mt-[20px] px-[100px]">
                            <span className="flex">
                                <p className="w-[110px]">신청 방법</p>
                                <input type="text" className="w-full border-2 rounded-lg ml-[20px] px-[10px]" placeholder="신청 받을 연락처/사이트/구글폼/각종 링크를 적어주세요."/>
                            </span>
                            <span className="flex mt-[10px]">
                                <p className="w-[110px]">신청 방법 안내</p>
                                <textarea className="p-[10px] w-full h-[200px] border-2 rounded-lg ml-[20px]" placeholder="(선택) 신청 방법이 따로 있다면 설명해주세요.&#13;&#10;예시) 메일 제목은 '리쿠르팅 접수'로 해주시고 본인의 작업물이 담긴 포트폴리오를 10장 이하의 분량의 pdf로 보내주세요."/>
                            </span>
                            
                        </div>
                    </div>

                
                </div>


                <div>
                    <p className="text-[20px] font-main">모집 대상 조건 설정하기</p>
                    <p className="mt-[10px]">모집글들을 필터링할 때 쓰이는 정보이니 채워주시면 좋습니다.</p>

                    <div className="flex w-full">
                        <div className="flex flex-col w-[300px] border h-[400px]">
                            {Grades.map((grade,index) => (
                                <span key={index} className="flex items-center">
                                    <input type="checkBox" {...register("grades")} value={grade} className="ml-[10px]" />
                                    <p>{grade}</p>
                                </span>
                            ))}
                        </div>
                        <div className="w-full grid grid-cols-5 border">
                        {Majors.map((major,index) => {
                            const key = Object.keys(major)[0];
                            const values = Object.values(major)[0];
                            let clicked = false;
                            return(
                                <div className="flex flex-col">
                                    <span key={index} className="flex items-center">
                                        <input type="checkBox" {...register("majors")} value={key} className="ml-[10px]" />
                                        <p>{key}</p>
                                        {values.length !== 0 && clicked===false && <i onClick={(e : any) => {
                                            e.currentTarget.className === "fa-solid fa-chevron-up" ? 
                                            e.currentTarget.className="fa-solid fa-chevron-down" : 
                                            e.currentTarget.className="fa-solid fa-chevron-up"
                                            setVisible( prev => [...prev.slice(0,index) , !prev[index] , ...prev.slice(index+1)])
                                            }} className="fa-solid fa-chevron-down"></i>} 

                                        
                                    </span>
                                    {visible[index] && ( values.map((value : string , idx : number) => (
                                        <span key={idx} className="pl-[20px] flex items-center">
                                            <input type="checkBox" {...register("majors")} value={value} className="ml-[10px]" />
                                            <p>{value}</p>
                                        </span>
                                    
                                                ))
                                                
                                            
                                        )}
                                </div>
                        );
                        }
                            
                                
                            )}
                        </div>
                    </div>
                </div>
                
            </form>

        </div>
    )
}

export default PostAddForm2;