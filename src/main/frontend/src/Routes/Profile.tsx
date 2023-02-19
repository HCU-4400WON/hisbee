import { useQuery } from "@tanstack/react-query";
import { IUser, memberProfile, memberUpdate, posts } from "api";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import tw from "tailwind-styled-components";

const Sidebar = tw.div`
min-w-[250px] pl-[30px]
border-2
border-gray-300
min-h-screen
`;

const SidebarTitle = tw.p`
py-[40px] 
text-[33px] 
font-medium
`;

const SidebarItemText = tw.p`
text-[17px] 
mb-[20px]
`;

const ProfileInfoRow = tw.div`
    flex
    my-[10px]
`;
const ProfileInfoTitle = tw.p`
min-w-[150px] 
text-[#757575]
`;

const ProfileInfoContent = tw.p`
`;

const ProfileBanner = tw.form`
min-h-[320px]
min-w-[700px] 
my-[40px] 
rounded-xl 
bg-[#f2f2f2] 
p-[50px] 
flex
`;

const PostGrid = tw.div`
grid 
grid-cols-1
gap-48
mt-[40px]
mb-[80px]
sm:grid-cols-2
xl:grid-cols-3

`;

const PostItem = tw.div`
relative
h-[200px] 
w-[380px]
rounded-md
p-[15px]
`;

// const PostImage = tw.div`
// border-0
// rounded-sm
// h-2/5
// mx-5
// mt-5
// mb-3
// bg-gradient-to-r from-white to-purple-200 to-purple-300
// `;

const PostContentFirstRow = tw.div`
flex 
justify-between
items-center
`;

function Profile() {
  const { isLoading, data, refetch } = useQuery<IUser>(
    ["User"],
    memberProfile,
    {
      onSuccess: (data) => {
        // 성공시 호출
        setLinks(data?.externalLinks as any);
      },
    }
  );

  const [nowModifying, setNowModifying] = useState(false);

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.currentTarget.id === "modify") {
      if (nowModifying === false) {
        setNowModifying(true);
      } else {
        setNowModifying(false);
      }
    }
  };

  const { register, handleSubmit } = useForm();

  const [Links, setLinks] = useState<string[]>([]);
  const [externalLink, setExternalLink] = useState<string>("");
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    setExternalLink(event.currentTarget.value);
  };
  const onDelete = (link: string) => {
    const idx = Links.findIndex((elem) => elem === link);
    setLinks((prev) => [...prev.slice(0, idx), ...prev.slice(idx + 1)]);
  };
  const onClickPlus = () => {
    setLinks((prev) => [...prev, externalLink]);
    setExternalLink("");
  };

  interface Idata {
    department: string;
    position: string;
    grade: string;
    contact: string;
    bio: string;
    club1: string;
    club2: string;
  }

  const onValid = async (newData: Idata) => {
    console.log(newData);

    const newUser = {
      nickname: "abcd",
      pictureUrl: "/img/user.png",
      isPublic: true,
      department: newData.department,
      position: newData.position,
      bio: newData.bio,
      grade: newData.grade,
      club: [newData.club1, newData.club2],
      contact: newData?.contact,
      externalLinks: Links,
    };

    await memberUpdate(newUser);
    refetch();
  };

  return (
    <>
      {isLoading ? (
        "loading..."
      ) : (
        <div className="flex">
          <Sidebar>
            <SidebarTitle>My profile</SidebarTitle>
            <SidebarItemText>프로필 정보</SidebarItemText>
            <SidebarItemText>내가 쓴 모집글</SidebarItemText>
            <SidebarItemText>찜한 모집글</SidebarItemText>
            <SidebarItemText>추가 정보 입력 (인재풀 등록)</SidebarItemText>
            <SidebarItemText>탈퇴하기</SidebarItemText>
          </Sidebar>
          <div className="px-[50px] w-full">
            <ProfileBanner onSubmit={handleSubmit(onValid as any)}>
              <div className=" w-[140px] flex flex-col items-center">
                <img
                  src="img/user.png"
                  className="w-[100%] h-[120px] rounded-full"
                />
                <p className="pt-[20px] text-[18px] font-medium">
                  {data?.nickname}
                </p>
              </div>
              <div className="w-full pl-[70px] text-[17px] flex flex-col justify-between">
                <ProfileInfoRow>
                  <ProfileInfoTitle>학부</ProfileInfoTitle>
                  {nowModifying ? (
                    <select
                      defaultValue={data?.department}
                      className="border-2 h-[30px] px-2 rounded-lg"
                      {...register("department")}
                    >
                      <option>글로벌리더십학부</option>
                      <option>국제어문학부</option>
                      <option>경영경제학부</option>
                      <option>법학부</option>
                      <option>커뮤니케이션학부</option>
                      <option>공간환경시스템공학부</option>
                      <option>기계제어공학부</option>
                      <option>콘텐츠융합디자인학부</option>
                      <option>생명과학부</option>
                      <option>전산전자공학부</option>
                      <option>상담심리사회복지학부</option>
                      <option>ICT창업학부</option>
                      <option>AI융합교육원</option>
                      <option>창의융합교육원</option>
                    </select>
                  ) : (
                    <ProfileInfoContent>{data?.department}</ProfileInfoContent>
                  )}
                </ProfileInfoRow>
                <ProfileInfoRow>
                  <ProfileInfoTitle>포지션</ProfileInfoTitle>

                  {nowModifying ? (
                    <select
                      defaultValue={data?.position}
                      className="border-2 h-[30px] px-2 rounded-lg"
                      {...register("position")}
                    >
                      <option>일반</option>
                      <option>기획자</option>
                      <option>개발자</option>
                      <option>디자이너</option>
                    </select>
                  ) : (
                    <ProfileInfoContent>{data?.position}</ProfileInfoContent>
                  )}
                </ProfileInfoRow>
                <ProfileInfoRow>
                  <ProfileInfoTitle>학년</ProfileInfoTitle>
                  {nowModifying ? (
                    <select
                      defaultValue={data?.grade}
                      className="border-2 h-[30px] px-2 rounded-lg"
                      {...register("grade")}
                    >
                      <option>1학년</option>
                      <option>2학년</option>
                      <option>3학년</option>
                      <option>4학년</option>
                    </select>
                  ) : (
                    <ProfileInfoContent>{data?.grade}</ProfileInfoContent>
                  )}
                </ProfileInfoRow>

                <ProfileInfoRow>
                  <ProfileInfoTitle>연락수단</ProfileInfoTitle>
                  <ProfileInfoContent>
                    {nowModifying ? (
                      <input
                        {...register("contact")}
                        className="border-2 h-[30px] px-2 rounded-lg w-[400px]"
                        defaultValue={data?.contact}
                        type="text"
                      />
                    ) : (
                      <ProfileInfoContent>{data?.contact}</ProfileInfoContent>
                    )}
                  </ProfileInfoContent>
                </ProfileInfoRow>

                <ProfileInfoRow>
                  <ProfileInfoTitle>동아리 / 학회</ProfileInfoTitle>

                  {nowModifying ? (
                    <div className="flex flex-col">
                      <input
                        {...register(`club1`)}
                        className="border-2 h-[30px] px-2 rounded-lg w-[400px]"
                        defaultValue={data?.club?.at(0)}
                        placeholder="최대 2개"
                        type="text"
                      />

                      <input
                        {...register(`club2`)}
                        className="border-2 h-[30px] px-2 rounded-lg w-[400px]"
                        defaultValue={data?.club?.at(1)}
                        placeholder="최대 2개"
                        type="text"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {data?.club?.map((elem, index) =>
                        data?.club?.at(index) === "" ? null : (
                          <ProfileInfoContent key={index}>
                            {elem}
                          </ProfileInfoContent>
                        )
                      )}
                    </div>
                  )}

                  {/* 
                  <ProfileInfoContent>
                    {nowModifying ? (
                      <input
                        {...register("club1")}
                        className="border-2 h-[30px] px-2 rounded-lg w-[400px]"
                        defaultValue={data?.club}
                        type="text"
                      />
                    ) : (
                      <ProfileInfoContent>{data?.club}</ProfileInfoContent>
                    )}
                  </ProfileInfoContent> */}
                </ProfileInfoRow>

                <ProfileInfoRow className=" items-start mb-0">
                  <ProfileInfoTitle>외부링크</ProfileInfoTitle>

                  {nowModifying ? (
                    <div>
                      <div>
                        <input
                          className="border-2 px-2 rounded-lg w-[400px] h-[30px]"
                          value={externalLink}
                          onChange={onChange}
                          placeholder="ex) github or Linked-In"
                        />
                        <i
                          onClick={onClickPlus}
                          className="fa-solid fa-plus text-[20px] relative right-7"
                        ></i>
                      </div>

                      {Links?.map((link) => (
                        <div className="flex items-center justify-between bg-slate-200 px-[10px] w-[400px] h-[30px] mt-[10px]">
                          <i className="fa-solid fa-link"></i>
                          {link}{" "}
                          <i
                            className="fa-regular fa-trash-can"
                            onClick={() => onDelete(link)}
                          ></i>
                        </div>
                      ))}

                      {/* {data?.externalLinks?.map((link, index) => (
                      <ProfileInfoContent key={index}>
                        {link}
                      </ProfileInfoContent>
                    ))} */}
                    </div>
                  ) : (
                    <div className="flex flex-col ">
                      {Links?.map((link) => (
                        <div className=" relative flex items-center justify-center bg-slate-200 px-[10px] w-[400px] h-[30px] mb-[10px]">
                          <i className="fa-solid fa-link absolute left-2"></i>
                          {link}{" "}
                        </div>
                      ))}
                    </div>
                  )}
                </ProfileInfoRow>
                <ProfileInfoRow className="relative">
                  <ProfileInfoTitle>자기소개</ProfileInfoTitle>
                  <ProfileInfoContent>
                    {nowModifying ? (
                      <textarea
                        {...register("bio")}
                        className="border-2 px-2 rounded-lg w-[400px] h-[100px]"
                        defaultValue={data?.bio}
                      ></textarea>
                    ) : (
                      <ProfileInfoContent>{data?.bio}</ProfileInfoContent>
                    )}
                  </ProfileInfoContent>
                </ProfileInfoRow>
                <div className="w-full">
                  <button
                    id="modify"
                    onClick={onClick}
                    className="bg-[#fff] w-[120px] h-[32px] border shadow  rounded-full float-right"
                  >
                    {nowModifying ? "제출하기" : "수정하기"}
                  </button>
                </div>
              </div>
            </ProfileBanner>

            <span className="mt-[40px] text-[20px] font-semibold">
              내가 쓴 모집글
            </span>

            <PostGrid>
              {posts.slice(0, 3).map((post, index) => (
                <PostItem
                  className={`${
                    post.dtype === "P"
                      ? "bg-gradient-to-r from-gray-300 to-gray-200  to-white"
                      : post.dtype === "S"
                      ? "bg-gradient-to-r from-purple-300 to-purple-200 to-white"
                      : "bg-gradient-to-r from-blue-300 to-blue-200 to-white"
                  }`}
                  key={index}
                  style={{ boxShadow: "0px 0px 25px rgb(0 0 0 / 0.25)" }}
                >
                  <PostContentFirstRow>
                    <span className="text-[#185ee4] bg-[#fff] border w-[80px] text-[14px] font-medium text-center rounded-full">
                      {post.dtype === "P"
                        ? "프로젝트"
                        : post.dtype === "S"
                        ? "스터디"
                        : "멘토링"}
                    </span>
                    <i className="fa-regular fa-heart text-[20px]"></i>
                    {/* <p className="mx-5 my-1 text-sm font-bold">개발자</p>
        <p className="text-sm text-blue-500">{post.total}명 모집</p> */}
                  </PostContentFirstRow>

                  {/* secondRow */}
                  <p className="ml-[10px] mt-[25px] text-lg font-bold">
                    {post.title.length > 20
                      ? post.title.slice(0, 20) + "..."
                      : post.title}
                  </p>

                  {/* ThirdRow */}
                  <div className="flex ml-[10px] mt-[8px] text-[14px] font-semibold items-center">
                    {(post.projectEnd.getTime() - post.projectStart.getTime()) /
                      (1000 * 24 * 60 * 60) >=
                    365 ? (
                      <p>
                        {Math.floor(
                          (post.projectEnd.getTime() -
                            post.projectStart.getTime()) /
                            (1000 * 24 * 60 * 60 * 365)
                        )}{" "}
                        년 플랜
                      </p>
                    ) : (post.projectEnd.getTime() -
                        post.projectStart.getTime()) /
                        (1000 * 24 * 60 * 60) >=
                      30 ? (
                      <p>
                        {Math.floor(
                          (post.projectEnd.getTime() -
                            post.projectStart.getTime()) /
                            (1000 * 24 * 60 * 60 * 30)
                        )}{" "}
                        달 플랜
                      </p>
                    ) : (post.projectEnd.getTime() -
                        post.projectStart.getTime()) /
                        (1000 * 24 * 60 * 60) >=
                      7 ? (
                      <p>
                        {Math.floor(
                          (post.projectEnd.getTime() -
                            post.projectStart.getTime()) /
                            (1000 * 24 * 60 * 60 * 7)
                        )}{" "}
                        주 플랜
                      </p>
                    ) : (
                      <p>
                        {Math.floor(
                          (post.projectEnd.getTime() -
                            post.projectStart.getTime()) /
                            (1000 * 24 * 60 * 60)
                        )}{" "}
                        일 플랜
                      </p>
                    )}
                    <p className="mx-[20px] ">/</p>
                    <p>
                      {" "}
                      {post.projectStart.getFullYear()}-
                      {post.projectStart.getMonth()}-
                      {post.projectStart.getDate()} 시작
                    </p>
                  </div>

                  {/* lastRow */}
                  <div className="absolute left-[25px] bottom-[15px] flex items-center gap-3">
                    <p className=" text-[#185ee4] text-[15px]">
                      {post.dtype === "P"
                        ? post.maxDesigner + post.maxDeveloper + post.maxPlanner
                        : post.dtype === "S"
                        ? post.maxMember
                        : post.maxMentee + post.maxMentor}
                      명 모집
                    </p>

                    {post.dtype === "P" ? (
                      <>
                        {post.maxDeveloper !== 0 && (
                          <span className="border-gray-400 border-2 rounded-full px-[10px] text-[13px] text-gray-500 font-medium">
                            개발자 {post.maxDeveloper}명
                          </span>
                        )}
                        {post.maxPlanner !== 0 && (
                          <span className="border-gray-400 border-2 rounded-full px-[10px] text-[13px] text-gray-500 font-medium">
                            기획자 {post.maxPlanner}명
                          </span>
                        )}

                        {post.maxDesigner !== 0 && (
                          <span className="border-gray-400 border-2 rounded-full px-[10px] text-[13px] text-gray-500 font-medium">
                            디자이너 {post.maxDesigner}명
                          </span>
                        )}
                      </>
                    ) : post.dtype === "S" ? (
                      <span className="border-gray-400 border-2 rounded-full px-[10px] text-[13px] text-gray-500 font-medium">
                        스터디원 {post.maxMember}명
                      </span>
                    ) : (
                      <>
                        {post.maxMentor !== 0 && (
                          <span className="border-gray-400 border-2 rounded-full px-[10px] text-[13px] text-gray-500 font-medium">
                            멘토 {post.maxMentor}명
                          </span>
                        )}
                        {post.maxMentee !== 0 && (
                          <span className="border-gray-400 border-2 rounded-full px-[10px] text-[13px] text-gray-500 font-medium">
                            멘티 {post.maxMentee}명
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </PostItem>
              ))}
            </PostGrid>

            <span className="text-[20px] font-semibold">추가정보입력</span>

            <div className="my-[40px]">
              <div className="flex gap-10">
                <span className="pt-[40px] flex flex-col w-1/2">
                  <label className="font-[16px] font-medium">
                    동아리 / 학회
                  </label>
                  <input
                    className="bg-[#eeeeee] rounded-full h-[30px] mt-[15px]"
                    type="text"
                  />
                </span>

                <span className="pt-[40px] flex flex-col w-1/2">
                  <label className="font-[16px] font-medium">이메일 주소</label>
                  <input
                    className="bg-[#eeeeee] rounded-full h-[30px] mt-[15px]"
                    type="text"
                  />
                </span>
              </div>

              <div className="flex gap-10">
                <span className="pt-[40px] flex flex-col w-1/2">
                  <label className="font-[16px] font-medium">연락 수단</label>
                  <input
                    className="bg-[#eeeeee] rounded-full h-[30px] mt-[15px]"
                    type="text"
                    placeholder="ex) 번호, 카카오톡 오픈채팅 ID..."
                  />
                </span>

                <span className="pt-[40px] flex flex-col w-1/2">
                  <label className="font-[16px] font-medium">외부링크</label>
                  <input
                    className="bg-[#eeeeee] rounded-full h-[30px] mt-[15px]"
                    type="text"
                    placeholder="ex) Github, Instagram, Blog ..."
                  />
                </span>
              </div>

              <div className="flex justify-end">
                <button className=" mt-[40px] rounded-full border w-[130px] h-[30px]">
                  {" "}
                  수정하기{" "}
                </button>
              </div>
            </div>

            <button className="float-right mb-[40px] rounded-full border-2 border-red-500 text-red-500 w-[130px] h-[30px] ">
              {" "}
              탈퇴하기{" "}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
