import { useQuery } from "@tanstack/react-query";
import { IOneUser, readOneMember } from "api";
import { useForm } from "react-hook-form";
import tw from "tailwind-styled-components";

const ProfileBlock = tw.div`

`;
const ProfileInfoBox = tw.div`
flex 

w-[230px]

`;

const ProfileInfoTitle = tw.p`
w-[150px] 
text-gray-500
font-medium
`;

const ProfileInfoIcon = tw.i`
text-gray-600
mr-2
`;

const Sidebar = tw.div`
sticky
top-0
hidden
lg:flex
min-w-[220px] 
pl-[30px]

h-[400px]
min-h-screen
flex-col
items-start

`;

const SidebarButton = tw.button`
flex
justify-start
items-center
my-[5px]
pl-[5px]
pr-[40px]
w-[180px]
py-[8px]
rounded-lg
align-left
text-gray-400
text-[16px]

hover:text-gray-500
hover:bg-gray-100
`;

const SidebarTitle = tw.p`
py-[20px] 
text-[20px] 
`;

const Banner = tw.div`
h-[300px] bg-slate-100 flex
`;
function Profile2() {
  //   const {
  //     isLoading: getUserLoading,
  //     data,
  //     refetch,
  //   } = useQuery<IOneUser>(["User"], readOneMember, {
  //     onSuccess: async (data) => {
  //       setValue("nickname", data.nickname);
  //       setValue("major1", data.major1);
  //       setValue("major2", data.major2);

  //       //   setOnSuccessLoading(false);
  //     },
  //     onError: (error) => {
  //       //   if (((error as AxiosError).response as AxiosResponse).status === 401) {
  //       // alert("로그인이 필요합니다.");
  //       // setIsLoginModal(true);
  //       // setIsLogin(false);
  //       // if (localStorage.getItem("key")) localStorage.removeItem("key");
  //       // navigate("/");
  //       //   }
  //     },
  //   });

  const { register, handleSubmit, formState, setValue, getValues, watch } =
    useForm({
      defaultValues: {
        nickname: "",
        major1: "",
        major2: "",
      },
    });

  return (
    <div className="w-full flex">
      <Sidebar>
        <SidebarTitle className="relative">마이 페이지</SidebarTitle>

        <SidebarButton>
          <i className="fa-regular fa-heart mx-[10px]"></i>
          좋아요한 글
        </SidebarButton>

        <SidebarButton>
          <i className="fa-solid fa-pencil mx-[10px] "></i>
          작성한 글
        </SidebarButton>
        <SidebarButton className="absolute  bottom-[20px] hover:bg-red-100 hover:text-red-500">
          <i className="fa-solid fa-user-slash mx-[10px]"></i>탈퇴하기
        </SidebarButton>
      </Sidebar>
      <div className="w-full h-[1000px]">
        <Banner>
          <div className="flex flex-col">
            <ProfileInfoBox>
              <ProfileInfoTitle>계정</ProfileInfoTitle>
              <div>8156217@handong.ac.kr</div>
            </ProfileInfoBox>
            <ProfileInfoBox>
              <ProfileInfoTitle>계정</ProfileInfoTitle>
              <div>8156217@handong.ac.kr</div>
            </ProfileInfoBox>
          </div>
          <div></div>
        </Banner>
      </div>
    </div>
  );
}

export default Profile2;
