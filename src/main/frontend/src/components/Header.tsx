import { Link, useMatch, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import tw from "tailwind-styled-components";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isLoginModalState, isLogoutConfirmState } from "./atom";
import { isLoginState } from "./atom";
import Outline from "./Outline";

const Nav = tw.nav`
flex 
items-center 
px-[0px]
justify-between
pr-[60px]
min-w-[480px]
`;

const NavButton = tw.button`
 text-[14px]
 text-black
 font-unique
 min-w-[80px]
 
h-[30px]
hover:text-blue-400
 sm:text-[16px]
 text-slate-500
 
`;

const Logo = tw(motion.img)`
    
    w-[120px]
    hover:text-blue-500
    ml-[100px]
    
`;
const NavFlexBox = tw.div`
    flex
`;
const NavLeftBox = tw(NavFlexBox)`
flex
items-center
w-[300px]

md: w-[450px]
md: justify-between


`;
const NavRightBox = tw(NavFlexBox)`
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

function Header() {
  const [isLogin, setIsLogin] = useRecoilState(isLoginState);

  const isProfileURL = useMatch("/profile");

  const navigate = useNavigate();

  const onClick = (event: any) => {
    if (event.currentTarget.id === "logout") {
      setIsLogin(false);
      localStorage.removeItem("key");
      navigate("/");

      setIsLogoutConfirmModal(true);
    } else {
      setIsLoginModal(true);
      navigate("/");
    }
  };
  const setIsLoginModal = useSetRecoilState(isLoginModalState);
  const setIsLogoutConfirmModal = useSetRecoilState(isLogoutConfirmState);

  return (
    <>
      <Outline bgColor="bg-white">
        <Nav className="h-[70px] min-w-[1470px]">
          <NavLeftBox>
            <Link to="/">
              <Logo
                src="/img/logo_hisbee.png"
                variants={LogoVairants}
                initial="initial"
                whileHover="hover"
              />
            </Link>
          </NavLeftBox>

          <NavRightBox className="items-center">
            {!isLogin ? (
              <NavButton onClick={onClick} className="pl-[60px]">
                로그인
              </NavButton>
            ) : (
              <NavButton id="logout" onClick={onClick} className="pl-[60px]">
                로그아웃
              </NavButton>
            )}
            {isLogin && (
              <Link to="profile" className="relative ">
                <NavButton
                  className={`${isProfileURL && "text-blue-500"} pl-[40px]`}
                >
                  마이페이지
                </NavButton>
              </Link>
            )}
          </NavRightBox>
        </Nav>
      </Outline>
    </>
  );
}

export default Header;
