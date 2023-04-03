import { async } from "@firebase/util";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";


import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import styled from "styled-components";

import {
  ref,
  getDownloadURL,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../firebase";

const MyBlock = styled.div`

  .wrapper-class {
    margin: 0 auto;
    margin-bottom: 4rem;
    border: 2px solid lightGray !important;
  }
  .editor {
    
    min-height: 300px !important;
    border-top: 3px solid lightGray !important;
    padding: 10px !important;
    border-radius: 2px !important;
  }
`;

const converter = (what : string , info ?: string | Date) => {
        
    if(what === "year"){
        let year = ((info as Date).getFullYear() + "").padStart(2, "0");
        let month = (((info as Date).getMonth() +1) + "").padStart(2, "0");
        let date = ((info as Date).getDate() + "").padStart(2,"0");
        let convertedDate = year + "-" + month + "-" + date;
        // console.log("이거? " ,convertedDate);
        return convertedDate;
    }
}

const dateDifference = (end : string) => {
    const date1 = new Date(converter("year" , new Date())! );
    const date2 = new Date(end);

    const diffDate = date1.getTime() - date2.getTime();

    return Math.abs(diffDate / (1000 * 60 * 60 * 24));
}

function PostAddForm2(){
    
    

const {register, watch ,formState , handleSubmit , getValues , setValue , trigger} = useForm({ mode: "onSubmit",
defaultValues: {
    categories : [],
    durationIndex : "0",
    postStart : converter("year" , new Date()),
    postEnd : converter("year", new Date()),
    title : "",
    subTitle : "",
    keywordsFirstLine : [],
    keywordsSecondLine : [],
    // keywordsThirdLine : [],
    position : "",
    positionNum : "",
    grades : [],
    majors : [],
    keyword : "",
    firstKeyword : "",
    secondKeyword : "",
    positionToggle : false,
    total: "0",
    // poster : "",

} });

watch(["categories", "durationIndex" , "postStart" , "postEnd" , "position" , "positionNum" , "keyword" , "keywordsFirstLine" , "keywordsSecondLine" , "positionToggle" ]);

interface IPositionList {
    position : string,
    positionNum : number
}

    const [positionList , setPositionList] = useState<IPositionList[] | []>([]);

// const categoriesWatch = watch("categories");
// https://dotorimook.github.io/post/2020-10-05-rhf-watch-vs-getvalues/

   

    const onSubmit = () =>{
        console.log(getValues("grades"));
        console.log(getValues("majors"));
        console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
        console.log(imageURL);
    }

    const Categories = ["동아리" , "프로젝트" , "학회" , "학술모임" , "공모전/대회" , "운동/게임/취미" , "전공 스터디" , "기타 모임"];

    // const onClick = (e : React.FormEvent<HTMLButtonElement>) => {
    //     const selectedId = e.currentTarget.id;
        
    // // }
    // const onDelete = (id : number) => {
    //     ;
    // }
    

    const Grades = ["23학번 새내기" , "1학년" , "2학년" , "3학년" , "4학년" , "9학기 이상"];
    const Majors = [
        // {"상관없음":[]},
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
        
    const [visible, setVisible] = useState<Boolean[]>(Array.from({length : Majors.length}, ()=>true));
    
    const [keywords , setKeywords] = useState<string[] | []>([]);


    const [firstKeywords , setFirstKeywords] = useState<string[]>();










// useState로 상태관리하기 초기값은 EditorState.createEmpty()
  // EditorState의 비어있는 ContentState 기본 구성으로 새 개체를 반환 => 이렇게 안하면 상태 값을 나중에 변경할 수 없음.
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState: any) => {
    // editorState에 값 설정
    setEditorState(editorState);
  };

 
  
// content : draftToHtml(convertToRaw(editorState.getCurrentContent();






const [imageURL, setImageURL] = useState<string>("");
const [imageURLList , setImageURLList] = useState< string[] | []>([]);
const inputRef = useRef<HTMLInputElement | null>(null);
  const onUploadImageButtonClick = useCallback(() => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.click();
  }, []);

  const onImageChange = (
    e: React.ChangeEvent<EventTarget & HTMLInputElement>
  ) => {
    e.preventDefault();
    const file = e.target.files;
    if (!file) return null;

    const storageRef = ref(storage, `files/${file[0].name}`);
    const uploadTask = uploadBytesResumable(storageRef, file[0]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // setProgressPercent(progress);
      },
      (error) => {
        switch (error.code) {
          case "storage/canceld":
            alert("Upload has been canceled");
            break;
        }
      },
      () => {
        e.target.value = "";
        getDownloadURL(storageRef).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImageURL(downloadURL);
          setImageURLList(prev => [...prev , downloadURL]);
          
        //   setValue("poster", downloadURL);
          
        //   (
        //     document.querySelector("#basicImage") as HTMLElement
        //   ).style.backgroundColor = "white";
        //   (document.querySelector("#basicImage") as HTMLElement).style.color =
        //     "black";
          
        });
      }
    );
  };

  const [gradeToggle ,setGradeToggle] = useState<boolean>(false);
  const [majorToggle, setMajorToggle] = useState<boolean>(false);



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
                    * 표시는 필수 입력 내용입니다.
                </p>
                
            <form onSubmit={handleSubmit(onSubmit)} className="px-[20px]">
                <p className="text-[20px] font-main">
                    썸네일 제작
                </p>
                <p className="mt-[10px]">
                    썸네일을 보고 무슨 모집글인지  알기 쉽도록 만들어주세요!
                </p>

                <div className="w-full h-[400px] flex items-center justify-between my-[20px] ">
                    <div className="w-[400px] bg-[#eeeeee] p-[30px]">
                        <div className="mb-[30px]">
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

                                
                            </span>
                        <i className="fa-regular fa-heart text-[23px] text-gray-400"></i>
                        </span>
                        
                        
                        <input className="w-[340px] text-[20px] py-[5px] px-[15px] mb-[10px]" {...register("title")} type="text" placeholder="모집글 제목을 입력하세요" />
                        <textarea className="w-[340px] text-[15px] px-[15px] pt-[5px]" {...register("subTitle")} placeholder="모집글 제목을 입력하세요" />

                        </div>
                        <div className="flex items-center">
                        {getValues("categories").length !==0 && getValues("categories").map((category : string, index : number) => 
                                    <div className="bg-purple-200 py-[5px] mb-[20px] px-[15px] rounded-full mr-[10px]" key={index}>{category}</div>
                        )}
                        </div>
                        {[{array:"keywordsFirstLine" , str : "firstKeyword"} , {array:"keywordsSecondLine" , str : "secondKeyword"} ,].map( (lineObj , index) => (
                            <div key={index} className="flex mb-[10px] items-center">
                            {/* firstLine Keyword */}
                            
                            {getValues(lineObj.array as any)?.map( (keyword : string,index : number) => (
                                <div key={index} className="text-[15px] px-[15px] py-[1px] rounded-full border-2 border-purple-300 bg-purple-200 mr-[10px]">
                                    {keyword}
                                </div>
                            ))}
                            <input type="text" className="py-[2px] px-[15px] w-[110px] rounded-full" {...register(lineObj.str as any)} placeholder="키워드 입력"/>
                            <button onClick={async() => {
                                if(getValues(lineObj.str as any) === "") return;
                                setValue(lineObj.array as any , await [...getValues(lineObj.array as any), getValues(lineObj.str as any)] as never );
                                setValue(lineObj.str as any , "");
                            }} className="px-[10px] bg-white ml-[5px] rounded-full"> + </button>
                        </div>
                        ))}
                        
                        
                        {/* <div className=" mb-[10px]">
                        <input type="text" className="px-[5px] w-[100px]" placeholder="키워드 입력"/>
                        </div>
                        <div className=" mb-[10px]">
                        <input type="text" className="px-[5px] w-[100px]" placeholder="키워드 입력"/>
                        </div> */}
                        
                        
                    </div>



                    <div className="w-[300px] h-[350px] px-[40px] py-[30px]">
                        <p>모집 기간</p>
                        <span className="flex mt-[20px]">
                            {/* <input type="radio" {...register("durationIndex")} value="0" className="mr-[10px]"/> */}
                            {/* <p>상시 모집</p> */}
                            <button className={`${getValues("durationIndex") === "0" ? 'bg-purple-200 border-2 border-purple-300' : 'bg-gray-200'} px-[15px] py-[8px] rounded-lg`} onClick={() => setValue("durationIndex" , '0')}>상시 모집</button>
                        </span>

                        <span className="flex mt-[20px] mb-[0px]">
                            {/* <input {...register("durationIndex")} type="radio" value="1" className="mr-[10px]"/> */}
                            {/* <p>기간 설정</p> */}
                            <button className={`${getValues("durationIndex") === "1" ? 'bg-purple-200 border-2 border-purple-300' : 'bg-gray-200'} px-[15px] py-[8px] rounded-lg`} onClick={() => setValue("durationIndex", "1")}>기간 설정</button>
                        </span>
                        {getValues("durationIndex") === "1" && (<span className="pl-[30px] mb-[200px]">
                            <span className="flex items-center mb-[10px]">
                                <p className="mx-[15px]">시작</p>
                                <input type="date" {...register("postStart")}/>
                            </span>
                            
                            <span className="flex items-center">
                                <p className="mx-[15px]">마감</p>
                                <input type="date" {...register("postEnd")}/>
                            </span>
                        </span>)}
                        <button></button>
                        
                        
                    </div>

                    <div className="w-[600px] h-[350px] px-[40px] py-[30px]">
                        <span className="flex items-center">모임 유형(카테고리) <p className="text-[13px] ml-[20px]">최대 2개 선택 가능</p></span>
                        
                        <div className="flex">
                            <div className="grid grid-cols-2 w-[300px]"> 
                            {Categories.map((category,index) => (
                                (<span key={index} className="flex items-center mt-[20px]">
                                    {/* <input {...register("categories")} value={category} type="checkBox" className="mx-[10px]" /> */}
                                    {/* <p>{category}</p> */}
                                    <button className={`${getValues("categories").includes(category as never) ? 'bg-purple-200 border-2 border-purple-300' : 'bg-gray-200'} px-[15px] py-[8px] rounded-lg`} onClick={
                                        async() => {
                                            const gv = getValues("categories");
                                            const gvIdx = gv.indexOf(category as never);
                                            if(!gv.includes(category as never) && gv.length < 2) {
                                                await setValue("categories" , [ ...gv , category as never ]);
                                                if(category === "기타 모임") document.getElementById("categoryETC")?.focus();
                                            } else if(gv.includes(category as never) && gv.length <= 2){
                                                
                                                setValue("categories" , [...gv.slice(0,gvIdx) , ...gv.slice(gvIdx+1)]);
                                            }
                                        }
                                    }>{category}</button>
                                    
                                </span>)
                            ))}
                            </div>
                            <div className="flex flex-col justify-end">
                            {getValues("categories").includes("기타 모임" as never) && (
                                        <input type="text" id="categoryETC" className="border-b-2 h-[40px] border-gray-400 w-full px-[10px]" placeholder="모집 유형을 입력해주세요"/>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
                <button className="mb-[70px] py-[10px] text-[16px] px-[15px] border-2 border-blue-500 text-blue-500 rounded-lg">다른 모집글은 어떻게 작성되었는지 살펴보세요!</button>
                         
                <div>
                    <p className="text-[20px] font-main">모집글 필수 내용</p>
                    <p className="mt-[10px]">모집글을 완성하기 위한 최소한의 내용을 적어주세요!</p>
                    <div className="flex">
                        <div className="w-[400px] h-[250px]  mt-[20px]">
                            <p className="">모집 인원</p>
                            
                            {getValues("positionToggle") === true ? (
                                <span className="flex mt-[10px] items-center">
                                    <div></div>
                                <input className="border-b-2 px-[10px] w-[100px]" {...register("position")} placeholder="포지션" type="text" />
                                <p className="mx-[10px] text-gray-400">:</p>
                                <input className="border-b-2 px-[10px] w-[50px] px-[10px]" {...register("positionNum")} type="number" />
                                <p className="ml-[5px]">명</p>
                                <button onClick={()=> setValue("positionToggle" , false )} className="ml-[20px] bg-blue-100 text-blue-400 rounded-lg px-[15px] py-[5px]">인원만 입력하기</button>
                            </span>
                            ) : (
                                <span className="flex mt-[10px] items-center">
                                    <input className="border-b-2 px-[10px] w-[50px] px-[10px]" {...register("total")} type="number" />
                                    <p className="ml-[5px]">명</p>
                                    <button onClick={()=> setValue("positionToggle" , true )} className="ml-[20px] bg-blue-100 text-blue-400 rounded-lg px-[15px] py-[5px]">포지션 : 인원으로 입력하기</button>
                                </span>
                            )}
                            
                            
                            {getValues("positionToggle")===true && positionList.length > 0 && (
                                positionList?.map((elem , index) => (
                                    <div  key={index} className="flex items-center justify-between border-2 border-blue-500 rounded-lg py-[2px] px-[10px] w-[200px] lg:w-[300px] xl:w-[343px] text-blue-500 my-[20px]">
                                    <i className="fa-solid fa-link"></i>
                                    <p>{elem.position}</p> 
                                    {/* <p>{elem.positionNum}명</p> */}
                                    <span className="flex items-center ">
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
                            {getValues("positionToggle")===true && (
                                <button className="flex items-center justify-center text-[25px] w-[27px] h-[27px] rounded-lg bg-blue-100 text-blue-400 mt-[20px]"
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
                            )}
                        </div>
                        <div className="w-[800px] h-[250px] mt-[20px] px-[100px]">
                            <span className="flex">
                                <p className="w-[110px]">신청 방법</p>
                                <input type="text" className="w-full border-2 rounded-lg ml-[20px] px-[10px]" placeholder="신청 받을 연락처/사이트/구글폼/각종 링크를 적어주세요."/>
                            </span>
                            <span className="flex mt-[10px]">
                                <p className="w-[110px]">신청 방법 안내</p>
                                <textarea className="p-[10px] w-full h-[50px] border-2 rounded-lg ml-[20px]" placeholder="(선택) 신청 방법이 따로 있다면 설명해주세요."/>
                            </span>
                            
                        </div>
                    </div>

                
                </div>


                <div>
                    <p className="text-[20px] font-main">모집 대상 조건 설정하기</p>
                    <p className="mt-[10px]">모집글들을 필터링할 때 쓰이는 정보이니 채워주시면 좋습니다.</p>

                    <div className="flex w-full">
                        <div className="flex flex-col w-[300px] border h-[400px]">
                            {/* {Grades.map((grade,index) => (
                                <span key={index} className="flex items-center mt-[10px]">
                                    <input type="checkBox" {...register("grades")} value={grade} className="mx-[10px]" onClick = {
                                        (e : any) => {
                                            if(index === 0 && e.target.checked){
                                                setValue("grades", [grade as never]);
                                            }
                                            else if( index!== 0 && getValues("grades").includes("상관없음" as never)){
                                                // e.preventDefault();
                                                setValue("grades", [grade as never]);
                                                return;
                                            }
                                        }
                                    } />
                                    <p>{grade}</p>
                                </span>
                            ))} */}


    <span className={`flex items-center mt-[10px] ${gradeToggle && ('text-gray-400')}`}>
    {gradeToggle ? (
        <input type="checkBox" {...register("grades")} value="상관없음" disabled className="mx-[10px]"></input>
    ) : (<input type="checkBox" {...register("grades")} value="상관없음" checked className="mx-[10px]"></input>)}
    
    <p>상관없음</p>
    </span>

<span className="flex items-center mt-[10px]">
                            <p className="mx-[10px]">학년 선택하기</p>
    <i className={gradeToggle ? `fa-solid fa-chevron-up` :`fa-solid fa-chevron-down`} onClick={() => {
        if(gradeToggle) setValue("grades" , ["상관없음"] as any);
        else setValue("grades" , []);
        setGradeToggle(prev => !prev);
        console.log(getValues("grades"))
    }
    }></i>
</span>
                            {gradeToggle && (
                                <>
                                {Grades.map((grade,index) => (
                                    <span key={index} className="flex items-center mt-[10px]">
                                        <input type="checkBox" {...register("grades")} value={grade} className="mx-[10px]" onClick = {
                                            (e : any) => {
                                                // if(index === 0 && e.target.checked){
                                                //     setValue("grades", [grade as never]);
                                                // }
                                                // else if( index!== 0 && getValues("grades").includes("상관없음" as never)){
                                                //     // e.preventDefault();
                                                //     setValue("grades", [grade as never]);
                                                //     return;
                                                // }
                                            }
                                        } />
                                        <p>{grade}</p>
                                    </span>
                                ))}
                                </>
                            )}
                            
                        </div>

                        
                        <div className="w-full grid grid-cols-5 border">

                            <div>
                            <span className={`flex items-start mt-[10px] ${majorToggle && ('text-gray-400')}`}>
                            {majorToggle ? (
                                <input type="checkBox" {...register("majors")} value="상관없음" disabled className="mx-[10px] mt-[5px]"></input>
                            ) : (<input type="checkBox" {...register("majors")} value="상관없음" checked className="mx-[10px] mt-[5px]"></input>)}
                            
                            <p>상관없음</p>
                            </span>


                            <span className="flex items-center mt-[10px]">
                                <p className="mx-[10px]">전공 선택하기</p>
                                <i className={majorToggle ? `fa-solid fa-chevron-up` :`fa-solid fa-chevron-down`} onClick={() => {
                                    if(majorToggle) setValue("majors" , ["상관없음"] as any);
                                    else setValue("majors", []);
                                    setMajorToggle(prev => !prev);
                                }
                                }></i>
                            </span>
                            </div>
                            {majorToggle && (

                                <>
                                {Majors.map((major,index) => {
                                const key = Object.keys(major)[0];
                                const values = Object.values(major)[0];
                                let clicked = false;
                                return(
                                    <div className="flex flex-col">
                                        <span key={index} className="flex items-center px-[20px] py-[10px]">
                                            <input type="checkBox" {...register("majors")} value={key} className="mr-[10px]" onClick={(e : any) => 
                                            {
                                                
                                                if(e.target.checked){
                                                    // 상관없음 체크 된 상황, 큰 카테고리 체크하였을 때 상관없음 체크 해제
                                                    // if(getValues("majors").includes("상관없음" as never)){
                                                    //     setValue("majors" , [Object.keys(major)[0] as never]);
                                                    // }
                                                    // 큰 카테고리와 하위 카테고리 체크
                                                    const inputList = document.querySelectorAll(`#majors${index}`);
                                                    for(let i = 0 ; i < inputList.length ; ++i){
                                                        (inputList[i] as any).checked  = true;
                                                    }
                                                }else{
                                                    const inputList = document.querySelectorAll(`#majors${index}`);
                                                    for(let i = 0 ; i < inputList.length ; ++i){
                                                        (inputList[i] as any) .checked  = false;
                                                    }
                                                }
                                            }
                                            } />
                                            <p className="mr-[10px]">{key}</p>
                                            {values.length !== 0 && clicked===false && <i onClick={(e : any) => {
                                                e.currentTarget.className === "fa-solid fa-chevron-up" ? 
                                                e.currentTarget.className="fa-solid fa-chevron-down" : 
                                                e.currentTarget.className="fa-solid fa-chevron-up"
                                                setVisible( prev => [...prev.slice(0,index) , !prev[index] , ...prev.slice(index+1)])
                                                }} className="fa-solid fa-chevron-down"></i>} 

                                            
                                        </span>
                                        {visible[index] && ( values.map((value : string , idx : number) => (
                                            <span key={idx} className="pl-[20px] flex items-center">
                                                <input type="checkBox" id={`majors${index}`} {...register("majors")} value={value} className="mx-[10px]"
                                                // onClick={() => {
                                                    //상관없음 체크 되었을 때, 하위 카테고리 체크시 상관없음 체크 해제
                                                    // if(getValues("majors").includes("상관없음" as never)){
                                                    //     setValue("majors" , [value as never]);
                                                    // }
                                                // }}
                                                />
                                                <p>{value}</p>
                                            </span>
                                        
                                                    ))
                                                    
                                                
                                            )}
                                    </div>
                                );
                            }
                            )}</>
                            )}
                            
                        </div>
                    </div>
                </div>
                
                <div>
                    <p className="text-[20px] font-main mt-[50px]">검색 키워드 입력하기</p>
                    <p className="mt-[10px]">모집글과 관련된 키워드를 입력해주세요</p>
                    
                    <div className="flex">
                        <p className="mt-[10px]">키워드</p>
                        {["categories", "keywordsFirstLine" , "keywordsSecondLine" , "keywordsThirdLine"].map((elem ) => (
                            getValues(elem as any)?.map((v : string,index : number) => (
                            <span key={index}>
                                <p>{v}</p>
                            </span>))
                            
                        ))}
                        {keywords.map( (keyword , index) => ( 
                        <span key={index} className="flex px-[20px]">
                            <p>{keyword}</p>
                            <i className="fa-solid fa-xmark" onClick={ () =>
                                setKeywords(prev => [...prev.slice(0,index) , ...prev.slice(index+1)])
                            }></i>
                        </span>
                        ))}
                    </div>

                    <div className="flex  mt-[10px]">
                        <p className="mr-[20px]">키워드 입력</p>
                        <input type="text" className="w-[300px] border-2 rounded-lg" {...register("keyword")}/>
                        <button className="ml-[20px] bg-black text-white  px-[10px]" onClick={ async() => {
                            
                            await setKeywords( prev => [...prev , getValues("keyword")])
                            setValue("keyword" , "");
                        }}> 생성 </button>
                    </div>

                </div>

                <div>
                    <p className="text-[20px] font-main mt-[50px]">내용 입력하기</p>
                    <p className="mt-[10px] mb-[20px]">모임의 목적,활동 내용 등에 대한 자세한 내용을 자유롭게 작성해주세요!</p>
                    <MyBlock>
                    <Editor
                // 에디터와 툴바 모두에 적용되는 클래스
                wrapperClassName="wrapper-class"
                // 에디터 주변에 적용된 클래스
                editorClassName="editor"
                // 툴바 주위에 적용된 클래스
                toolbarClassName="toolbar-class"
                // 툴바 설정
                toolbar={{
                  // inDropdown: 해당 항목과 관련된 항목을 드롭다운으로 나타낼것인지
                  list: { inDropdown: true },
                  textAlign: { inDropdown: true },
                  link: { inDropdown: true },
                  history: { inDropdown: false },
                }}
                placeholder="내용을 작성해주세요."
                // 한국어 설정
                localization={{
                  locale: "ko",
                }}
                // 초기값 설정
                editorState={editorState}
                // 에디터의 값이 변경될 때마다 onEditorStateChange 호출
                onEditorStateChange={onEditorStateChange}
              />
                    </MyBlock>
                    
            </div>

            <div>
                <p className="text-[20px] font-main">포스터 업로드하기</p>
                <p className="mt-[10px]">포스터를 제작하셨다면 업로드해주세요! 모집글 상세보기 페이지 및 포스터 모아보기 페이지에서 보여집니다.</p>
                
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  onChange={onImageChange}
                />
                <div className=" items-center justify-between flex left-[30px] top-[20px] w-[90%] md:w-[190px]">
                    <i className="fa-solid fa-panorama w-[40px]"
                      onClick={onUploadImageButtonClick}
                    ></i>
                   
                  </div>
                  <div className="grid grid-cols-3">
                  {imageURLList?.map((imageUrl : string , index : number) => (
                    
                    <span>
                   <img className="w-[400px] border-2 mt-[30px]" src={imageUrl} key={index}
                   ></img>
                   <button onClick={ () => {
                    setImageURLList(prev => [...prev.slice(0,index) , ...prev.slice(index+1)]);
                   }}>delete</button>
                   </span>
                    
                ))}
                <div onClick={onUploadImageButtonClick} className="w-[400px] h-[400px] border-2 border-gray-300 mt-[30px] flex justify-center items-center">
                        <i className="fa-solid fa-plus text-gray-300 text-[40px]"></i>
                    </div>
                </div>
                
                  {/* <div className="flex justify-center">
                  {imageURLList.length !== 0 ? (<img className="w-[500px] border-2 mt-[30px]" src={imageURLList[0]}
                    ></img>) : (<div onClick={onUploadImageButtonClick} className="w-[400px] h-[400px] border-2 border-gray-300 mt-[30px] flex justify-center items-center">
                        <i className="fa-solid fa-plus text-gray-300 text-[40px]"></i>
                    </div>)}

                    </div> */}
            </div>
            <div className="flex justify-end mt-[50px]">
            <button className="text-white bg-black text-[20px] px-[20px]"> 제출하기</button>
            </div>
            </form>

        </div>
    )
}

export default PostAddForm2;