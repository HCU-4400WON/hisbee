import { AnimatePresence, motion } from "framer-motion";

const LayoutVariant = {
  hidden: {
    opacity: 0,
    // backGroundColor: "rgba(0,0,0,0.5)",
  },
  showing: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

export function ImageModal({ ImageSrc, onClick }: any) {
  return (
    <div className="flex w-full justify-center">
      <motion.div
        variants={LayoutVariant}
        initial="hidden"
        animate="showing"
        exit="exit"
        onClick={onClick}
        id="no"
        className="fixed z-10 bg-[rgba(0,0,0,0.5)] top-0 left-0 w-full h-screen"
      ></motion.div>

      <img
        src={ImageSrc}
        className="w-[50%] absolute top-[400px] z-20 "
        alt="bigPoster"
      />
    </div>
  );
}
