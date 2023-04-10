import React from "react";

// <div className="w-[45%]">
//   <p>모집 인원</p>

//   {getValues("positionToggle") === true ? (
//     <span className="flex mt-[10px] items-center">
//       <div></div>
//       <input
//         className="border-b-2 px-[10px] w-[100px]"
//         {...register("positionName")}
//         placeholder="포지션"
//         type="text"
//       />
//       <p className="mx-[10px] text-gray-400">:</p>
//       <input
//         className="border-b-2 px-[10px] w-[50px] px-[10px]"
//         {...register("positionCount")}
//         type="number"
//       />
//       <p className="ml-[5px]">명</p>
//       <button
//         onClick={() => setValue("positionToggle", false)}
//         className="ml-[20px] bg-blue-100 text-blue-400 rounded-lg px-[15px] py-[5px]"
//       >
//         인원만 입력하기
//       </button>
//     </span>
//   ) : (
//     <span className="flex mt-[10px] items-center">
//       <input
//         className="border-b-2 px-[10px] w-[50px] px-[10px]"
//         {...register("total")}
//         type="number"
//       />
//       <p className="ml-[5px]">명</p>
//       <button
//         onClick={() => setValue("positionToggle", true)}
//         className={`ml-[20px] ${FunctionBUTTON}`}
//       >
//         포지션: 인원으로 입력하기
//       </button>
//     </span>
//   )}

//   {getValues("positionToggle") === true &&
//     getValues("positions").length > 0 &&
//     getValues("positions")?.map((elem: any, index) => (
//       <div
//         key={index}
//         className="flex items-center justify-between border-2 border-blue-500 rounded-lg py-[2px] px-[10px] w-[200px] lg:w-[300px] xl:w-[343px] text-blue-500 my-[20px]"
//       >
//         <i className="fa-solid fa-link"></i>
//         <p>{elem.positionName}</p>
//         {/* <p>{elem.positionCount}명</p> */}
//         <span className="flex items-center ">
//           <span
//             onClick={() => {
//               const newElem = {
//                 positionName: elem.positionName,
//                 positionCount: elem.positionCount + 1,
//               };
//               setValue(
//                 "positions",

//                 [
//                   ...getValues("positions").slice(0, index),
//                   newElem,
//                   ...getValues("positions").slice(index + 1),
//                 ] as never
//               );
//             }}
//           >
//             +
//           </span>
//           <p className="mx-[10px]">{elem.positionCount}명</p>
//           <span
//             onClick={() => {
//               const newElem = {
//                 positionName: elem.positionName,
//                 positionCount: elem.positionCount - 1,
//               };
//               setValue(
//                 "positions",

//                 [
//                   ...getValues("positions").slice(0, index),
//                   newElem,
//                   ...getValues("positions").slice(index + 1),
//                 ] as never
//               );
//             }}
//           >
//             -
//           </span>
//         </span>
//         <i
//           className="fa-regular fa-trash-can"
//           onClick={() =>
//             setValue(
//               "positions",

//               [
//                 ...getValues("positions").slice(0, index),

//                 ...getValues("positions").slice(index + 1),
//               ] as never
//             )
//           }
//         ></i>
//       </div>
//     ))}
//   {getValues("positionToggle") === true && (
//     <button
//       className="flex items-center justify-center text-[25px] w-[27px] h-[27px] rounded-lg bg-blue-100 text-blue-400 mt-[20px]"
//       onClick={() => {
//         //    if (positions.find((elem) => elem.position === getValues("position")) || (positions.find((elem) => elem.position === "아무나") && getValues("position")==="")){

//         //     setValue("position","");
//         //     setValue("positionCount" ,"");
//         //     return;
//         //    }
//         if (getValues("positionName") !== "") {
//           const newPosition = {
//             positionName: getValues("positionName"),
//             positionCount: +getValues("positionCount"),
//           };
//           setValue("positions", [
//             ...getValues("positions"),
//             newPosition,
//           ] as never);
//           setValue("positionName", "");
//           setValue("positionCount", "");
//         }
//       }}
//     >
//       +
//     </button>
//   )}
// </div>;
