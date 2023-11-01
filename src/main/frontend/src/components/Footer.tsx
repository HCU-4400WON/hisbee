import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { type } from "os";
import Outline from "./Outline";

const FooterVariant = {
  hidden: {
    x: 180,
    y: 110,
    scale: 0,
    opacity: 0,
  },
  showing: {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
  },
  exit: {
    x: 180,
    y: 110,
    scale: 0,
    opacity: 0,
  },
};
function Footer() {
  const [isTeamModal, setIsTeamModal] = useState(false);
  return (
    <Outline>
      <div className="min-w-[1470px] h-[150px] pr-[50px] flex justify-between items-center mt-[0px]">
        <div className="flex justify-start items-end">
          <img src="/img/logo_hisbee.png" className="w-[140px] mx-[30px]" />
          <span className="text-[12px] pb-[6px] z-10 min-w-[220px] font-unique text-gray-500 block">
            <strong>ⓒ</strong> 2023 Team.Hot6 All rights reserved
          </span>
        </div>

        <div className="flex justify-end w-[300px] items-center relative">
          {/* <a href="https://github.com/HCU-4400WON/hot6" target="_blank">
            <img
              src="/img/github.png"
              className="w-[80px] h-[40px] md:w-[100px] md:h-[50px]"
            />
          </a> */}
          <a href="https://forms.gle/LxuwbuM3fs6L3Hbz6" target="_blank">
            <span className=" hover:opacity-60 mr-[30px] font-unique text-[23px]">
              CONTACT
            </span>
          </a>

          <span>
            <p
              onMouseOver={() => setIsTeamModal(true)}
              onMouseLeave={() => setIsTeamModal(false)}
              className="hover:opacity-60 text-[20px] font-unique md:text-[25px]"
            >
              TEAM
            </p>
            <AnimatePresence>
              {isTeamModal && (
                <motion.div
                  className="absolute left-[-100px] top-[-180px] w-[400px]  flex flex-col "
                  variants={FooterVariant}
                  transition={{ type: "tween" }}
                  initial="hidden"
                  animate="showing"
                  exit="exit"
                >
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
                      강이경
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
                </motion.div>
              )}
            </AnimatePresence>
          </span>
        </div>
      </div>
    </Outline>
  );
}

export default Footer;
