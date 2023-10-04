import { AnimatePresence, motion } from "framer-motion";

const ValidationVariant = {
  hidden: {
    y: -10,
    color: "red",
    opacity: 0,
  },

  showing: {
    y: 0,
    opacity: 1,
  },

  exit: {
    y: 10,
    opacity: 0,
  },
};

export default function Validation({ message }: any) {
  return (
    <AnimatePresence>
      <motion.div
        variants={ValidationVariant}
        className="text-[20px] text-red-500 ml-[-12px] mt-[-5px]"
        initial="hidden"
        animate="showing"
        exit="exit"
      >
        *
      </motion.div>
    </AnimatePresence>
  );
}
