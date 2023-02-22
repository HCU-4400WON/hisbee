import { useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [isTeamModal, setIsTeamModal] = useState(false);
  return (
    <div className="w-full h-[150px] pr-[50px] flex justify-between items-center mt-[150px]">
      <div className="flex justify-start items-end">
        <img src="/img/logo.png" className="w-[250px]" />
        <caption className="text-[15px] font-semibold text-gray-500">
          <strong>ⓒ</strong> 2022 Team.Hot6 All rights reserved
        </caption>
      </div>

      <div className="flex justify-between w-[400px] items-center relative">
        <a href="https://github.com/HCU-4400WON/hot6" target="_blank">
          <img src="/img/github.png" className="w-[100px] h-[50px]" />
        </a>
        <span className="text-[25px] font-semibold">WALAB</span>
        <span
          className="text-[25px] font-semibold"
          onMouseOver={() => setIsTeamModal(true)}
          onMouseLeave={() => setIsTeamModal(false)}
        >
          팀원
          {isTeamModal && (
            <div className="absolute left-[-100px] top-[-180px] w-[500px]  flex flex-col">
              <div className="flex w-full justify-between">
                <img
                  src="/img/position2.png"
                  className="w-[80px] h-[80px] bg-gray-200 border border-gray-200 rounded-full"
                />
                <img
                  src="/img/position1.png"
                  className="w-[80px] h-[80px] bg-gray-200 border border-gray-200 rounded-full"
                />
                <img
                  src="/img/position3.png"
                  className="w-[80px] h-[80px] bg-gray-200 border border-gray-200 rounded-full"
                />
                <img
                  src="/img/position4.png"
                  className="w-[80px] h-[80px] bg-gray-200 border border-gray-200 rounded-full"
                />
              </div>
              <div className="flex w-full justify-between mt-[10px]">
                <div className="w-[80px] h-[30px] flex justify-center items-center text-[17px] ">
                  <p>Designer</p>
                </div>
                <div className="w-[80px]  flex justify-center items-center border-gray-200 h-[30px] text-center text-[17px] ">
                  Front-End
                </div>
                <div className="w-[80px] flex justify-center items-center border-gray-200 h-[30px] text-center text-[17px] ">
                  Back-End
                </div>
                <div className="w-[80px] flex justify-center items-center border-gray-200 h-[30px] text-center text-[17px] ">
                  Back-End
                </div>
              </div>
              <div className="flex w-full justify-between">
                <div className="w-[80px] flex justify-center items-center h-[25px] text-center text-[15px]  text-gray-500 font-semibold">
                  이채원
                </div>
                <div className="w-[80px] flex justify-center items-center h-[25px] text-center text-[15px]  text-gray-500 font-semibold">
                  오인혁
                </div>
                <div className="w-[80px] flex justify-center items-center h-[25px] text-center text-[15px] text-gray-500 font-semibold">
                  한시온
                </div>
                <div className="w-[80px] flex justify-center items-center h-[25px] text-center text-[15px] text-gray-500 font-semibold ">
                  장유진
                </div>
              </div>
            </div>
          )}
        </span>
      </div>
    </div>
  );
}

export default Footer;
