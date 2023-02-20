import { Link, useNavigate } from "react-router-dom";
import { motion, useAnimation, useForceUpdate } from "framer-motion";
import tw from "tailwind-styled-components";
import { useState } from "react";
import { useForm } from "react-hook-form";

const Nav = tw.nav`
flex 

justify-center
items-center 
border-b-2 

px-[20px]

lg:justify-between

`;

const NavButton = tw.button`
 bg-white 
 text-lg
 text-black 
 py-2 
 hover:text-purple-500
 mx-8

 sm:mx-10
 sm:text-xl
`;

const Logo = tw(motion.img)`
    font-bold
    w-[200px]
    hidden 
    lg:flex
    
    text-lg
    text-black 
  py-2 
  hover:text-purple-500
  
 sm:text-xl
`;
const NavFlexBox = tw.div`
    flex
`;
const NavCenterBox = tw(NavFlexBox)`

`;
const NavRightBox = tw(NavFlexBox)`
hidden
lg:flex
`;

const SearchBox = tw(motion.form)`
  w-[300px]
  h-[30px]
  items-center
`;

const LogoVairants = {
  initial: {
    rotateZ: 0,
    x: 0,
  },
  hover: {
    rotateZ: [0, -5, 5, -7, 7, -5, 5, -3, 3, 0],
    x: [0, -3, 3, -4, 4, -3, 3, -1, 1, 0],

    transition: {
      duration: 3,
      type: "spring",
      repeat: Infinity,
    },
  },
};

// const SearchVariants = {
//   initial: {
//   },
//   click: {

//   },
// };

function Header() {
  const [isSearch, setIsSearch] = useState(false);

  const searchAnimate = useAnimation();
  const sendAnimate = useAnimation();
  const SearchIconAnimate = useAnimation();
  const [isMoving, setIsMoving] = useState(false);
  const toggleSearch = () => {
    if (isMoving) return;

    setIsMoving(true);

    if (isSearch) {
      searchAnimate.start({
        scaleX: 0,
        opacity: 0,
      });
      sendAnimate.start({
        opacity: 0,
        scale: 0,
      });
      SearchIconAnimate.start({
        x: "0px",
      });
    } else {
      searchAnimate.start({
        scaleX: 1,
        opacity: 1,
      });
      sendAnimate.start({
        opacity: 1,
        scale: 1,
      });
      SearchIconAnimate.start({
        x: "-260px",
      });
    }
    if (!isSearch) document.getElementsByTagName("input")[0].focus();
    setIsSearch((prev) => !prev);
    setTimeout(() => setIsMoving(false), 300);
  };

  const { register, handleSubmit, formState, setValue } = useForm();

  const onValid = (data: any) => {
    console.log(data);
    setValue("search", "");
    navigate("/post");
  };
  const navigate = useNavigate();
  return (
    <>
      <Nav>
        <Link to="/">
          <Logo
            src="/img/logo.png"
            variants={LogoVairants}
            initial="initial"
            whileHover="hover"
          />
        </Link>
        <NavCenterBox>
          <Link to="post">
            <NavButton>모집글</NavButton>
          </Link>
          <Link to="person">
            <NavButton>인재풀</NavButton>
          </Link>
          <Link to="profile">
            <NavButton>프로필</NavButton>
          </Link>
        </NavCenterBox>

        <NavRightBox className="items-center">
          <SearchBox
            className="flex relative"
            id="searchForm"
            onBlur={() => {
              setValue("search", "");
              toggleSearch();
            }}
            onSubmit={handleSubmit(onValid)}
          >
            <motion.svg
              className="absolute right-0 w-5 z-10 fill-gray-400 hover:fill-purple-500"
              initial={{ x: "0px" }}
              animate={SearchIconAnimate}
              // animate={{ x: isSearch ? "-265px" : "0px" }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              onClick={toggleSearch}
              transition={{ duration: 0.5, type: "tween" }}
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </motion.svg>
            <motion.input
              type="text"
              {...register("search", {
                required: true,
                minLength: {
                  value: 2,
                  message: "2글자 이상만 가능합니다.",
                },
              })}
              maxLength={15}
              className="w-full border h-full border-gray-400 rounded-full origin-right px-[45px]"
              animate={searchAnimate}
              // variants={SearchVariants}
              initial={{ scaleX: 0 }}
              transition={{ duration: 0.5, type: "tween" }}
              placeholder="원하는 글을 검색해보세요!"
            ></motion.input>

            <button form="searchForm" className="absolute right-[10px]">
              <motion.i
                className="fa-regular fa-paper-plane  text-gray-400"
                animate={sendAnimate}
                initial={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5, type: "tween" }}
              ></motion.i>
            </button>
          </SearchBox>
          <Link to="login">
            <NavButton>Login</NavButton>
          </Link>
          <Link to="oauth2/redirect">
            <NavButton>Sign up</NavButton>
          </Link>
        </NavRightBox>
      </Nav>
    </>
  );
}

export default Header;
