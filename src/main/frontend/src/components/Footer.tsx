import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { type } from "os";

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
    <div className="min-w-[480px] h-[150px] pr-[50px] flex justify-between items-center mt-[150px]">
      <div className="flex justify-start items-end">
        <img src="/img/logo.png" className="w-[150px] md:w-[250px]" />
        <span className="text-[12px] pb-[6px] z-10 min-w-[220px] font-unique text-gray-500 hidden md:block">
          <strong>ⓒ</strong> 2022 Team.Hot6 All rights reserved
        </span>
      </div>

      <div className="flex justify-between w-[300px] items-center relative">
        <a href="https://github.com/HCU-4400WON/hot6" target="_blank">
          <img
            src="/img/github.png"
            className="w-[80px] h-[40px] md:w-[100px] md:h-[50px]"
          />
        </a>
        <span className="text-[20px] mr-[10px] font-unique md:text-[25px]">
          WALAB
        </span>
        <span>
          <p
            onMouseOver={() => setIsTeamModal(true)}
            onMouseLeave={() => setIsTeamModal(false)}
            className="hover:opacity-60 text-[20px] font-unique md:text-[25px]"
          >
            팀원
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
              </motion.div>
            )}
          </AnimatePresence>
        </span>
      </div>
    </div>
  );
}

export default Footer;
