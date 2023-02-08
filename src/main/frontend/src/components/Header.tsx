import tw from "tailwind-styled-components";

const NavButton = tw.button`
 bg-white 
 text-xl 
 text-black 
 py-2 
 hover:text-purple-500
 mx-10
`;

const LogoNav = tw(NavButton)`
    font-bold
    text-2xl
`;
const MiddleNavBox = tw.div`
    
`;

const SearchButton = tw.svg`
    w-6
    mx-10
`;

function Header() {
  return (
    <>
      <nav className="flex justify-between items-center mx-5">
        <LogoNav>LoGo</LogoNav>
        <div className="flex ">
          <NavButton>모집글</NavButton>
          <NavButton>인재풀</NavButton>
          <NavButton>채팅</NavButton>
          <svg
            className="w-6 mx-10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
        </div>
        <div>
          <NavButton>Login</NavButton>
          <NavButton>Sign up</NavButton>
        </div>
      </nav>

      <hr className="text-5"></hr>
    </>
  );
}

export default Header;
