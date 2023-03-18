import { AnimatePresence , motion } from "framer-motion";


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


export default function Validation({message} : any ){
    return(
        <AnimatePresence>
        {(message) && (
          <motion.div
            variants={ValidationVariant}
            className="text-xs my-auto ml-[3px]"
            initial="hidden"
            animate="showing"
            exit="exit"
          >
            * {message}
          </motion.div>
        )}
      </AnimatePresence>
    )
}