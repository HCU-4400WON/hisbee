import tw from "tailwind-styled-components";

const Nav = tw.nav`
flex 

justify-center
items-center 
mx-5 
border-b-2 

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

const LogoNav = tw(NavButton)`
    font-bold
    text-2xl
    hidden 

    lg:flex
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

function Header() {
  return (
    <>
      <Nav>
        <LogoNav>LoGo</LogoNav>
        <NavCenterBox>
          <NavButton>모집글</NavButton>
          <NavButton>인재풀</NavButton>
          <NavButton>채팅</NavButton>
          <svg
            className="w-6 mx-10 hover:fill-purple-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
        </NavCenterBox>
        <NavRightBox className="">
          <NavButton>Login</NavButton>
          <NavButton>Sign up</NavButton>
        </NavRightBox>
      </Nav>
    </>
  );
}

export default Header;
