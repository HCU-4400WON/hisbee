import { Link, useMatch, useNavigate } from "react-router-dom";
import { motion, useAnimation, useForceUpdate } from "framer-motion";
import tw from "tailwind-styled-components";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isLoginModalState } from "./atom";
import { isLoginState } from "./atom";

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
 text-[15px]
 text-black 
 py-2 
 
 font-semibold
 
 mx-8
hover:text-purple-400
 sm:mx-10
 sm:text-[16px]
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

const SearchInput = tw(motion.input)`
w-full border h-full border-gray-400 rounded-full origin-right px-[45px]
focus:outline-0
`;

// const SearchVariants = {
//   initial: {
//   },
//   click: {

//   },
// };

function Header() {
  const [isLogin, setIsLogin] = useRecoilState(isLoginState);

  const isPostURL = useMatch("/post");
  const isPersonURL = useMatch("/person");
  const isProfileURL = useMatch("/profile");

  const [isSearch, setIsSearch] = useState(true);

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
        x: "-265px",
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

  const onBlur = (e: any) => {
    if (!e.relatedTarget) {
      setValue("search", "");
      toggleSearch();
    }
  };

  const onClick = (event: any) => {
    if (event.currentTarget.id === "logout") {
      console.log(isLogin);
      setIsLogin(false);
      navigate("/");
      alert("로그아웃 되었습니다.");
    } else {
      setIsLoginModal(true);
      navigate("/");
    }
  };
  const setIsLoginModal = useSetRecoilState(isLoginModalState);
  return (
    <>
      <Nav className="w-[1470px]">
        <Link to="/">
          <Logo
            src="/img/logo.png"
            variants={LogoVairants}
            initial="initial"
            whileHover="hover"
          />
        </Link>
        <NavCenterBox>
          <Link to="post" className="relative">
            {isPostURL && (
              <>
                <div
                  className="absolute w-[11px] h-[11px] right-7 top-[-2px]"
                  // className="absolute w-[10px] h-[10px] left-11 top-[-2px]"
                  style={{
                    backgroundImage:
                      "radial-gradient(closest-side, #7b87e7, rgba(235, 235, 235, 0.13) 100%)",
                  }}
                />
                <div
                  className="absolute w-[10px] h-[10px] right-11 top-[-5px]"
                  // className="absolute w-[12px] h-[13px] right-0 left-0 mx-auto top-[-5px]"
                  style={{
                    backgroundImage:
                      "radial-gradient(closest-side, #9c9c9c, rgba(235, 235, 235, 0.13) 100%)",
                  }}
                />
                <div
                  className="absolute w-[10px] h-[10px] right-3 top-2"
                  // className="absolute w-[10px] h-[10px] right-11 top-[-2px]"
                  style={{
                    backgroundImage:
                      "radial-gradient(closest-side, #e3a3ff, rgba(235, 235, 235, 0.13) 100%)",
                  }}
                />
              </>
            )}
            {/* text-purple-500 */}
            <NavButton className={`${isPostURL && "text-purple-400"} `}>
              모집글
            </NavButton>
          </Link>

          <Link to="person" className="relative">
            {isPersonURL && (
              <>
                <div
                  className="absolute w-[11px] h-[11px] right-7 top-[-2px]"
                  style={{
                    backgroundImage:
                      "radial-gradient(closest-side, #7b87e7, rgba(235, 235, 235, 0.13) 100%)",
                  }}
                />
                <div
                  className="absolute w-[10px] h-[10px] right-11 top-[-5px]"
                  style={{
                    backgroundImage:
                      "radial-gradient(closest-side, #9c9c9c, rgba(235, 235, 235, 0.13) 100%)",
                  }}
                />
                <div
                  className="absolute w-[10px] h-[10px] right-3 top-2"
                  style={{
                    backgroundImage:
                      "radial-gradient(closest-side, #e3a3ff, rgba(235, 235, 235, 0.13) 100%)",
                  }}
                />
              </>
            )}
            <NavButton className={`${isPersonURL && "text-purple-400"} `}>
              인재풀
            </NavButton>
          </Link>
          <Link to="profile" className="relative">
            {isProfileURL && (
              <>
                <div
                  className="absolute w-[11px] h-[11px] right-7 top-[-2px]"
                  style={{
                    backgroundImage:
                      "radial-gradient(closest-side, #7b87e7, rgba(235, 235, 235, 0.13) 100%)",
                  }}
                />
                <div
                  className="absolute w-[10px] h-[10px] right-11 top-[-5px]"
                  style={{
                    backgroundImage:
                      "radial-gradient(closest-side, #9c9c9c, rgba(235, 235, 235, 0.13) 100%)",
                  }}
                />
                <div
                  className="absolute w-[10px] h-[10px] right-3 top-2"
                  style={{
                    backgroundImage:
                      "radial-gradient(closest-side, #e3a3ff, rgba(235, 235, 235, 0.13) 100%)",
                  }}
                />
              </>
            )}
            <NavButton className={`${isProfileURL && "text-purple-400"} `}>
              프로필
            </NavButton>
          </Link>
        </NavCenterBox>

        <NavRightBox className="items-center">
          <SearchBox
            className="flex relative"
            id="searchForm"
            // onBlur={() => {
            //   setValue("search", "");
            //   toggleSearch();
            // }}
            onBlur={onBlur}
            onSubmit={handleSubmit(onValid)}
          >
            <motion.svg
              className="absolute right-0 w-5 z-10 fill-gray-400 hover:fill-purple-500"
              initial={{ x: "-265px" }}
              animate={SearchIconAnimate}
              // animate={{ x: isSearch ? "-265px" : "0px" }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              onClick={toggleSearch}
              transition={{ duration: 0.5, type: "tween" }}
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </motion.svg>
            <SearchInput
              type="text"
              {...register("search", {
                required: true,
                minLength: {
                  value: 2,
                  message: "2글자 이상만 가능합니다.",
                },
              })}
              maxLength={15}
              animate={searchAnimate}
              // variants={SearchVariants}
              initial={{ scaleX: 1 }}
              transition={{ duration: 0.5, type: "tween" }}
              placeholder="원하는 글을 검색해보세요!"
            ></SearchInput>

            <button
              id="send"
              form="searchForm"
              className="absolute right-[10px]"
            >
              <motion.i
                className="fa-regular fa-paper-plane  text-gray-400"
                animate={sendAnimate}
                initial={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: "tween" }}
              ></motion.i>
            </button>
          </SearchBox>
          {/* <Link to="login"> */}
          {!isLogin ? (
            <NavButton onClick={onClick}>Login</NavButton>
          ) : (
            <NavButton id="logout" onClick={onClick}>
              Logout
            </NavButton>
          )}

          {/* </Link> */}
          <Link to="oauth2/redirect">
            <NavButton>Sign up</NavButton>
          </Link>
        </NavRightBox>
      </Nav>
    </>
  );
}

export default Header;
