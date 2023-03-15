import { memberDelete } from "api";
import { useNavigate } from "react-router";
import { useSetRecoilState } from "recoil";
import { isDeleteModalState, isLoginState } from "../../components/atom";
import { motion, AnimatePresence } from "framer-motion";
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

function DeleteModal() {
  const navigate = useNavigate();

  const setIsDeleteModal = useSetRecoilState(isDeleteModalState);

  const setIsLogin = useSetRecoilState(isLoginState);

  const onClick = (event: any) => {
    if (event.currentTarget.id === "yes") {
      memberDelete();
      setIsLogin(false);
      navigate("/");
    } else if (event.currentTarget.id === "no") {
      setIsDeleteModal(false);
    }
  };

  return (
    <div>
      <AnimatePresence>
        <motion.div
          onClick={onClick}
          variants={LayoutVariant}
          initial="hidden"
          animate="showing"
          exit="exit"
          id="no"
          className="z-10 bg-[rgba(0,0,0,0.5)] fixed top-0 left-0 w-full h-screen opacity-100"
        ></motion.div>
      </AnimatePresence>
      <div className="fixed z-20 flex justify-center mt-[150px] w-full h-screen">
        <div className="w-4/5 rounded-2xl md:w-[1000px] bg-[white] h-[330px] py-[30px] px-[30px] md:rounded-3xl flex flex-col justify-between">
          <span className="flex justify-end">
            <i
              onClick={onClick}
              id="no"
              className="fa-solid fa-xmark text-[30px]"
            ></i>
          </span>
          <span className="flex justify-center">
            <span className="flex flex-col w-[300px] h-[100px] items-center">
              <img className="w-[200px]" src="/img/logo.png " />
              <p className="font-semibold text-[20px] md:text-[25px]">
                정말로 탈퇴하시겠습니까?
              </p>
            </span>
          </span>

          <div className="flex justify-center ">
            <span className="w-[260px] h-[50px] flex justify-between">
              <button
                onClick={onClick}
                id="no"
                className="w-[120px] h-[35px] border border-gray-300 rounded-full text-[20px] font-medium shadow-sm"
              >
                {" "}
                안할래요 !
              </button>
              <button
                onClick={onClick}
                id="yes"
                className="w-[120px] h-[35px] border border-gray-300 rounded-full text-[20px] font-medium shadow-sm"
              >
                탈퇴하기
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
