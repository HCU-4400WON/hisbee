// 첫번째 로딩

import { motion } from "framer-motion";

const BoxVariants = {
  start: {
    opacity: 1,
  },

  end: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const AlphabetVariants = {
  start: {
    y: -5,
  },
  end: {
    y: [-5, 5, -5],
    transition: {
      repeat: Infinity,
      repeatDelay: 2,
    },
  },
};

function LoadingAnimation() {
  return (
    <motion.div className="opacity-50 w-full h-[700px] flex justify-center items-center">
      <motion.div
        variants={BoxVariants}
        initial="start"
        animate="end"
        className="fixed  w-[300px] h-[300px] rounded-2xl flex items-center justify-center"
      >
        <motion.span className="text-[30px]" variants={AlphabetVariants}>
          L
        </motion.span>

        <motion.span className="text-[30px]" variants={AlphabetVariants}>
          O
        </motion.span>

        <motion.span className="text-[30px]" variants={AlphabetVariants}>
          A
        </motion.span>

        <motion.span
          className="text-[30px] text-purple-500"
          variants={AlphabetVariants}
        >
          D
        </motion.span>
        <motion.span
          className="text-[30px] text-pink-500"
          variants={AlphabetVariants}
        >
          N
        </motion.span>
        <motion.span
          className="text-[30px] text-gray-500"
          variants={AlphabetVariants}
        >
          E
        </motion.span>
        <motion.span
          className="text-[30px] text-yellow-500"
          variants={AlphabetVariants}
        >
          R
        </motion.span>

        <motion.span className="text-[30px]" variants={AlphabetVariants}>
          I
        </motion.span>

        <motion.span className="text-[30px]" variants={AlphabetVariants}>
          N
        </motion.span>

        <motion.span className="text-[30px]" variants={AlphabetVariants}>
          G
        </motion.span>

        <motion.span className="text-[30px]" variants={AlphabetVariants}>
          .
        </motion.span>

        <motion.span className="text-[30px]" variants={AlphabetVariants}>
          .
        </motion.span>

        <motion.span className="text-[30px]" variants={AlphabetVariants}>
          .
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

export default LoadingAnimation;

// 두번 째 로딩

// import { motion } from "framer-motion";

// const BoxVariants = {
//   start: {
//     opacity: 1,
//   },

//   end: {
//     opacity: 1,
//     transition: {
//       //   staggerChildren: 0.2,
//     },
//   },
// };

// const loadingVariants = {
//   start: {
//     rotateZ: 0,
//   },
//   end: {
//     rotateZ: 360,
//     scale: [1, 1.3, 1],
//     transition: {
//       repeat: Infinity,
//       duration: 1,
//       delay: 0,
//       type: "linear",
//       stiffness: 100,
//     },
//   },
// };

// function LoadingAnimation() {
//   return (
//     <motion.div className="opacity-50 w-full h-screen flex justify-center items-center">
//       <motion.div
//         variants={BoxVariants}
//         initial="start"
//         animate="end"
//         className=" w-[20px] h-[300px] rounded-2xl flex items-center justify-center"
//       >
//         <motion.svg
//           variants={loadingVariants}
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 512 512"
//         >
//           <path d="M304 48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zm0 416c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM48 304c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48zm464-48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM142.9 437c18.7-18.7 18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zm0-294.2c18.7-18.7 18.7-49.1 0-67.9S93.7 56.2 75 75s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zM369.1 437c18.7 18.7 49.1 18.7 67.9 0s18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9z" />
//         </motion.svg>
//       </motion.div>
//     </motion.div>
//   );
// }

// export default LoadingAnimation;

// 3번째 로딩

// import { motion } from "framer-motion";
// import tw from "tailwind-styled-components";

// const SVG = tw(motion.svg)`

// `;

// function LoadingAnimation() {
//   return (
//     <motion.div className="opacity-50 w-full h-screen flex justify-center items-center">
//       <SVG
//         className="w-[100px]"
//         initial={{
//           //   pathLength: 0,
//           //   fill: "rgba(0,0,255,0)",
//           y: 0,
//           x: 0,
//           opacity: 1,
//         }}
//         animate={{
//           //   pathLength: 1,
//           //   fill: "rgba(0,0,255,0.5)",
//           x: 200,
//           y: -200,
//           opacity: 0,
//         }}
//         transition={{
//           default: { repeat: Infinity, duration: 0.5 },
//           x: { delay: 0.5 },
//           y: { delay: 0.5 },
//           opacity: { delay: 0.5 },
//         }}
//         width={100}
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 512 512"
//       >
//         <motion.path
//           initial={{
//             opacity: 1,
//             pathLength: 0,
//             fill: "rgba(0,0,255,0)",
//             //   y: 0,
//             //   x: 0,
//             //   opacity: 1,
//           }}
//           animate={{
//             pathLength: 1,
//             fill: "rgba(0,0,0,1)",
//             //   x: 1200,
//             //   y: -1200,
//             //   opacity: 1,
//           }}
//           transition={{
//             default: { repeat: Infinity, duration: 0.5, repeatDelay: 0.5 },

//             //   x: { delay: 2 },
//             //   y: { delay: 2 },
//             //   opacity: { delay: 2 },
//           }}
//           stroke="rgba(0,0,0,1)"
//           strokeWidth="2"
//           d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z"
//         />
//       </SVG>
//     </motion.div>
//   );
// }

// export default LoadingAnimation;
