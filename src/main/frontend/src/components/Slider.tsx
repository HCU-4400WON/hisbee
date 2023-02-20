import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import tw from "tailwind-styled-components";

const Item = tw(motion.div)`
    w-[300px]
    h-[300px]
    border-2
`;

const offset = 6;

function Slider() {
  const [index, setIndex] = useState(0);

  const increaseIndex = () => {
    if (index > 2) setIndex(0);
    else setIndex((prev) => prev + 1);
  };

  const pages = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

  const variant = {
    hidden: {
      x: 1400,
    },
    showing: {
      x: 0,
    },

    exit: {
      x: -1400,
    },
  };

  return (
    <div className="w-full h-screen flex items-center">
      <button onClick={increaseIndex} className="text-[100px]">
        +
      </button>
      <AnimatePresence>
        <div className="flex justify-between w-full border">
          {pages.slice(index * offset, index * offset + offset).map((page) => (
            <Item
              variants={variant}
              initial="hidden"
              animate="showing"
              exit="exit"
              key={page}
            >
              {page}
            </Item>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
export default Slider;
