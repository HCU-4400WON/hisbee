// 가상 Entity interface

import { useState } from "react";
import { EphemeralKeyInfo } from "tls";
import axios, { Axios, AxiosError } from "axios";
import { useNavigate } from "react-router";
import { useSetRecoilState } from "recoil";
import { isLoginState } from "components/atom";

export interface IUser {
  email?: string;
  pictureUrl?: string;
  nickname?: string;
  isPublic: boolean;
  department: string;
  position: string;
  bio: string;
  grade: string;
  club?: string[];
  contact?: string;
  externalLinks?: string[];
  likes?: IPost[];
  posts?: IPost[];
}
export interface IUsers {
  total: number;
  members: IUser[];
}

export const fakeUsers: IUser[] = [
  {
    email: "8156217@naver.com",
    pictureUrl: "/img/user.png",
    nickname: "오인혁",
    isPublic: true,
    department: "콘텐츠융합디자인학부",
    position: "기획자",
    bio: "안녕하세용",
    grade: "3학년",
    club: [],
    contact: "010-6536-6217",
    likes: [],
    posts: [],
  },
  {
    email: "8156217@naver.com",
    pictureUrl: "/img/user.png",
    nickname: "오인혁",
    isPublic: true,
    department: "글로벌리더십학부",
    position: "디자이너",
    bio: "안녕하세용",
    grade: "1학년",
    club: [],
    contact: "010-6536-6217",
    likes: [],
    posts: [],
  },
  {
    email: "8156217@naver.com",
    pictureUrl: "/img/user.png",
    nickname: "오인혁",
    isPublic: true,
    department: "기계제어공학부",
    position: "개발자",
    bio: "안녕하세용",
    grade: "1학년",
    club: [],
    contact: "010-6536-6217",
    likes: [],
    posts: [],
  },
  {
    email: "8156217@naver.com",
    pictureUrl: "/img/user.png",
    nickname: "ohinhyuk",
    isPublic: true,
    department: "국제어문학부",
    position: "디자이너",
    bio: "안녕하세용",
    grade: "3학년",
    club: [],
    contact: "010-6536-6217",
    likes: [],
    posts: [],
  },
  {
    email: "8156217@naver.com",
    pictureUrl: "/img/user.png",
    nickname: "ohinhyuk",
    isPublic: true,
    department: "콘텐츠융합디자인학부",
    position: "디자이너",
    bio: "안녕하세용",
    grade: "3학년",
    club: [],
    contact: "010-6536-6217",
    likes: [],
    posts: [],
  },
  {
    email: "8156217@naver.com",
    pictureUrl: "/img/user.png",
    nickname: "오인혁",
    isPublic: true,
    department: "전산전자공학부",
    position: "개발자",
    bio: "안녕하세용",
    grade: "4학년",
    club: [],
    contact: "010-6536-6217",
    likes: [],
    posts: [],
  },
  {
    email: "8156217@naver.com",
    pictureUrl: "/img/user.png",
    nickname: "한시온",
    isPublic: true,
    department: "전산전자공학부",
    position: "개발자",
    bio: "안녕하세용",
    grade: "4학년",
    club: [],
    contact: "010-6536-6217",
    likes: [],
    posts: [],
  },
  {
    email: "8156217@naver.com",
    pictureUrl: "/img/user.png",
    nickname: "장유진",
    isPublic: true,
    department: "전산전자공학부",
    position: "개발자",
    bio: "안녕하세용",
    grade: "4학년",
    club: [],
    contact: "010-6536-6217",
    likes: [],
    posts: [],
  },
  {
    email: "8156217@naver.com",
    pictureUrl: "/img/user.png",
    nickname: "오인혁",
    isPublic: true,
    department: "전산전자공학부",
    position: "디자이너",
    bio: "안녕하세용",
    grade: "4학년",
    club: [],
    contact: "010-6536-6217",
    likes: [],
    posts: [],
  },
];

export interface IStudy {
  dtype: string;
  title: string;
  content: string;
  contact: string;
  maxMember: number;
  postEnd: Date;
  projectStart: Date;
  projectEnd: Date;
}

export interface IProject {
  dtype: string;
  title: string;
  content: string;
  contact: string;
  maxDeveloper: number;
  maxPlanner: number;
  maxDesigner: number;
  postEnd: Date;
  projectStart: Date;
  projectEnd: Date;
  hasPay: boolean;
}

export interface IMentoring {
  dtype: string;
  title: string;
  content: string;
  contact: string;
  maxMentor: number;
  maxMentee: number;
  postEnd: Date;
  projectStart: Date;
  projectEnd: Date;
  hasPay: boolean;
}

export interface IMember {
  id: number;
  email: string;
  nickname: string;
  isPublic: boolean;
  department: string;
  position: string;
  bio: string;
  grade: number;
  club: string;
  contact: string;
  externalLinks: string;
  // like 추가
  // more_info 이슈 해결
  // posts 추가
}

export interface IPost {
  dtype: string;
  id: number;
  title: string;
  content: string;
  contact: string;
  postStart: Date;
  postEnd: Date;
  projectStart: Date;
  projectEnd: Date;
  writer: string;
  maxDeveloper: number;
  maxPlanner: number;
  maxDesigner: number;
  currDeveloper: number;
  currPlanner: number;
  currDesigner: number;

  currMember: number;
  maxMember: number;
  maxMentor: number;
  maxMentee: number;
  currMentor: number;
  currMentee: number;
  hasPay: boolean;
  varified?: boolean;
  hasLiked?: boolean;
  nliked?: number;

  // period: number;
  // total: number;
  // category: string;
}
export interface IPosts {
  total: number;
  posts: IPost[];
}

export const posts: IPost[] = [
  {
    dtype: "P",
    id: 0,
    title:
      "우머ㅏㅜㅇ마눙마ㅣㅜㅁㅇ니ㅏ운머ㅏㅇㅁ눠ㅏㅇㅁ너ㅏㅇ뉴ㅓㅏㅁㅇ뉴아ㅓㅠ어ㅏ뮹ㄴㅁ",
    content: "content test",
    contact: "contact test",
    postStart: new Date("2023-02-15"),
    postEnd: new Date("2023-03-02"),
    projectStart: new Date("2023-04-02"),
    projectEnd: new Date("2023-07-02"),
    writer: "null",
    maxDeveloper: 3,
    maxPlanner: 2,
    maxDesigner: 1,
    currDeveloper: 0,
    currPlanner: 0,
    currDesigner: 0,
    maxMember: 0,
    currMember: 0,
    maxMentor: 0,
    maxMentee: 0,
    currMentor: 0,
    currMentee: 0,
    hasPay: true,
  },
  {
    dtype: "S",
    id: 1,
    title: "title test",
    content: "content test",
    contact: "contact test",
    postStart: new Date("2023-02-15"),
    postEnd: new Date("2023-03-02"),
    projectStart: new Date("2023-04-02"),
    projectEnd: new Date("2023-07-02"),
    writer: "null",
    maxDeveloper: 3,
    maxPlanner: 2,
    maxDesigner: 1,
    currDeveloper: 0,
    currPlanner: 0,
    currDesigner: 0,
    maxMember: 0,
    currMember: 0,
    maxMentor: 0,
    maxMentee: 0,
    currMentor: 0,
    currMentee: 0,
    hasPay: true,
  },
  {
    dtype: "D",
    id: 2,
    title: "title test",
    content: "content test",
    contact: "contact test",
    postStart: new Date("2023-02-15"),
    postEnd: new Date("2023-03-02"),
    projectStart: new Date("2023-04-02"),
    projectEnd: new Date("2023-07-02"),
    writer: "null",
    maxDeveloper: 3,
    maxPlanner: 2,
    maxDesigner: 1,
    currDeveloper: 0,
    currPlanner: 0,
    currDesigner: 0,
    maxMember: 0,
    currMember: 0,
    maxMentor: 0,
    maxMentee: 0,
    currMentor: 0,
    currMentee: 0,
    hasPay: true,
  },
  {
    dtype: "S",
    id: 3,
    title: "title test",
    content: "content test",
    contact: "contact test",
    postStart: new Date("2023-02-15"),
    postEnd: new Date("2023-03-02"),
    projectStart: new Date("2023-04-02"),
    projectEnd: new Date("2023-07-02"),
    writer: "null",
    maxDeveloper: 3,
    maxPlanner: 2,
    maxDesigner: 1,
    currDeveloper: 0,
    currPlanner: 0,
    currDesigner: 0,
    maxMember: 0,
    currMember: 0,
    maxMentor: 0,
    maxMentee: 0,
    currMentor: 0,
    currMentee: 0,
    hasPay: true,
  },
  {
    dtype: "P",
    id: 4,
    title: "title test",
    content: "content test",
    contact: "contact test",
    postStart: new Date("2023-02-15"),
    postEnd: new Date("2023-03-02"),
    projectStart: new Date("2023-04-02"),
    projectEnd: new Date("2023-07-02"),
    writer: "null",
    maxDeveloper: 3,
    maxPlanner: 2,
    maxDesigner: 1,
    currDeveloper: 0,
    currPlanner: 0,
    currDesigner: 0,
    maxMember: 0,
    currMember: 0,
    maxMentor: 0,
    maxMentee: 0,
    currMentor: 0,
    currMentee: 0,
    hasPay: true,
  },
  {
    dtype: "S",
    id: 5,
    title: "title test",
    content: "content test",
    contact: "contact test",
    postStart: new Date("2023-02-15"),
    postEnd: new Date("2023-03-02"),
    projectStart: new Date("2023-04-02"),
    projectEnd: new Date("2023-07-02"),
    writer: "null",
    maxDeveloper: 3,
    maxPlanner: 2,
    maxDesigner: 1,
    currDeveloper: 0,
    currPlanner: 0,
    currDesigner: 0,
    maxMember: 0,
    currMember: 0,
    maxMentor: 0,
    maxMentee: 0,
    currMentor: 0,
    currMentee: 0,
    hasPay: true,
  },
  {
    dtype: "D",
    id: 6,
    title: "title test",
    content: "content test",
    contact: "contact test",
    postStart: new Date("2023-02-15"),
    postEnd: new Date("2023-03-02"),
    projectStart: new Date("2023-04-02"),
    projectEnd: new Date("2023-07-02"),
    writer: "null",
    maxDeveloper: 3,
    maxPlanner: 2,
    maxDesigner: 1,
    currDeveloper: 0,
    currPlanner: 0,
    currDesigner: 0,
    maxMember: 0,
    currMember: 0,
    maxMentor: 0,
    maxMentee: 0,
    currMentor: 0,
    currMentee: 0,
    hasPay: true,
  },
  {
    dtype: "P",
    id: 7,
    title: "title test",
    content: "content test",
    contact: "contact test",
    postStart: new Date("2023-02-15"),
    postEnd: new Date("2023-03-02"),
    projectStart: new Date("2023-04-02"),
    projectEnd: new Date("2023-04-18"),
    writer: "null",
    maxDeveloper: 3,
    maxPlanner: 2,
    maxDesigner: 1,
    currDeveloper: 0,
    currPlanner: 0,
    currDesigner: 0,
    maxMember: 0,
    currMember: 0,
    maxMentor: 0,
    maxMentee: 0,
    currMentor: 0,
    currMentee: 0,
    hasPay: true,
  },
  {
    dtype: "P",
    id: 8,
    title: "title test",
    content: "content test",
    contact: "contact test",
    postStart: new Date("2023-02-15"),
    postEnd: new Date("2023-03-02"),
    projectStart: new Date("2023-04-02"),
    projectEnd: new Date("2023-07-02"),
    writer: "null",
    maxDeveloper: 3,
    maxPlanner: 2,
    maxDesigner: 1,
    currDeveloper: 0,
    currPlanner: 0,
    currDesigner: 0,
    maxMember: 0,
    currMember: 0,
    maxMentor: 0,
    maxMentee: 0,
    currMentor: 0,
    currMentee: 0,
    hasPay: true,
  },
  {
    dtype: "D",
    id: 9,
    title: "title test",
    content: "content test",
    contact: "contact test",
    postStart: new Date("2023-02-15"),
    postEnd: new Date("2023-03-02"),
    projectStart: new Date("2023-04-02"),
    projectEnd: new Date("2023-07-02"),
    writer: "null",
    maxDeveloper: 3,
    maxPlanner: 2,
    maxDesigner: 1,
    currDeveloper: 0,
    currPlanner: 0,
    currDesigner: 0,
    maxMember: 0,
    currMember: 0,
    maxMentor: 0,
    maxMentee: 0,
    currMentor: 0,
    currMentee: 0,
    hasPay: true,
  },
  // {
  //   id: 2,
  //   title: "모두의 아이디어 랩",
  //   content:
  //     "반드시 읽어주세요\n이번 행사는 오프라인으로 진행됩니다.\n참가 신청 후 취소 의향이 있으실 경우, 다음 대기자를 위해 반드시 취소 처리를 부탁드립니다.\n별도 알림 없이 불참하실 경우 향후 행사 참여 제한이 있을 수 있습니다.",
  //   contact: "dsyjf_2@handong.ac.kr",
  //   period: 30,
  //   total: 5,
  //   isCompleted: false,
  //   author: "Inhyuk_52",
  //   postStart: new Date("2022-05-02"),
  //   postEnd: new Date("2022-06-01"),
  //   projectStart: new Date("2022-06-07"),
  //   projectEnd: new Date("2022-07-07"),
  //   category: "STUDY",
  // },
  // {
  //   id: 0,
  //   title: "저만의 멘토, 구합니다",
  //   content:
  //     "다음 대기자를 위해 반드시 취소 처리를 부탁드립니다.\n별도 알림 없이 불참하실 경우 향후 행사 참여 제한이 있을 수 있습니다.",
  //   contact: "dsyjf_2@handong.ac.kr",
  //   period: 30,
  //   total: 5,
  //   isCompleted: false,
  //   author: "mentos_1",
  //   postStart: "2022-05-02",
  //   postEnd: "2022-06-01",
  //   projectStart: "2022-06-07",
  //   projectEnd: "2022-07-07",
  //   category: "MENTORING",
  // },
  // {
  //   id: 0,
  //   title:
  //     "프론트엔드_더 쉽고 빠른 지식/정보 콘텐츠 요약 플랫폼_사이드프로젝트",
  //   content:
  //     "크리에이터와 엔드유저, 그외에 관련이 있는 다양한 Stakeholder들에게 보여드렸고\n실제로 관심을 가지신 분들이 많아요! (두근두근)\n아이디어를 프로토타입으로 간단한 MVP테스트와 Usability, Fake door test를 진행해봤고 결과를 공유드릴 수 있습니다.",
  //   contact: "dsyjf_2@handong.ac.kr",
  //   period: 30,
  //   total: 5,
  //   isCompleted: false,
  //   author: "Inhyuk_52",
  //   postStart: "2022-05-02",
  //   postEnd: "2022-06-01",
  //   projectStart: "2022-06-07",
  //   projectEnd: "2022-07-07",
  //   category: "STUDY",
  // },
  // {
  //   id: 0,
  //   title:
  //     "프론트엔드_더 쉽고 빠른 지식/정보 콘텐츠 요약 플랫폼_사이드프로젝트",
  //   content:
  //     "크리에이터와 엔드유저, 그외에 관련이 있는 다양한 Stakeholder들에게 보여드렸고\n실제로 관심을 가지신 분들이 많아요! (두근두근)\n아이디어를 프로토타입으로 간단한 MVP테스트와 Usability, Fake door test를 진행해봤고 결과를 공유드릴 수 있습니다.",
  //   contact: "dsyjf_2@handong.ac.kr",
  //   period: 30,
  //   total: 5,
  //   isCompleted: false,
  //   author: "Inhyuk_52",
  //   postStart: "2022-05-02",
  //   postEnd: "2022-06-01",
  //   projectStart: "2022-06-07",
  //   projectEnd: "2022-07-07",
  //   category: "STUDY",
  // },
  // {
  //   id: 0,
  //   title: "저만의 멘토..구합니다..ㅠ",
  //   content:
  //     "다음 대기자를 위해 반드시 취소 처리를 부탁드립니다.\n별도 알림 없이 불참하실 경우 향후 행사 참여 제한이 있을 수 있습니다.",
  //   contact: "dsyjf_2@handong.ac.kr",
  //   period: 30,
  //   total: 5,
  //   isCompleted: false,
  //   author: "mentos_1",
  //   postStart: "2022-05-02",
  //   postEnd: "2022-06-01",
  //   projectStart: "2022-06-07",
  //   projectEnd: "2022-07-07",
  //   category: "MENTORING",
  // },
  // {
  //   id: 0,
  //   title: "저만의 멘토..구합니다..ㅠ",
  //   content:
  //     "다음 대기자를 위해 반드시 취소 처리를 부탁드립니다.\n별도 알림 없이 불참하실 경우 향후 행사 참여 제한이 있을 수 있습니다.",
  //   contact: "dsyjf_2@handong.ac.kr",
  //   period: 30,
  //   total: 5,
  //   isCompleted: false,
  //   author: "mentos_1",
  //   postStart: "2022-05-02",
  //   postEnd: "2022-06-01",
  //   projectStart: "2022-06-07",
  //   projectEnd: "2022-07-07",
  //   category: "MENTORING",
  // },
  // {
  //   id: 1,
  //   title: "프로젝트 하실 분 구합니다..!",
  //   content:
  //     "채원 디자이너님에게\n안녕하세요?\n위의 모든 기능은 화면에 보여줘야 할 정보가 동일합니다.\n따라서 하나의 통일된 화면을 만들어두고, 수정하기 버튼, 인원 등록 및 삭제 팝업(?)\n그대로 보여주면 모집 상세보기 화면으로 사용할 수 있도록 하면 좋을 것 같아요!",
  //   contact: "hellohi@handong.ac.kr",
  //   period: 20,
  //   total: 4,
  //   isCompleted: false,
  //   author: "hello_0803",
  //   postStart: "2022-08-22",
  //   postEnd: "2022-09-02",
  //   projectStart: "2022-06-22",
  //   projectEnd: "2022-07-12",
  //   category: "PROJECT",
  // },
  // {
  //   id: 1,
  //   title: "프로젝트 하실 분 구합니다..!",
  //   content:
  //     "채원 디자이너님에게\n안녕하세요?\n위의 모든 기능은 화면에 보여줘야 할 정보가 동일합니다.\n따라서 하나의 통일된 화면을 만들어두고, 수정하기 버튼, 인원 등록 및 삭제 팝업(?)\n그대로 보여주면 모집 상세보기 화면으로 사용할 수 있도록 하면 좋을 것 같아요!",
  //   contact: "hellohi@handong.ac.kr",
  //   period: 20,
  //   total: 4,
  //   isCompleted: false,
  //   author: "hello_0803",
  //   postStart: "2022-08-22",
  //   postEnd: "2022-09-02",
  //   projectStart: "2022-06-22",
  //   projectEnd: "2022-07-12",
  //   category: "PROJECT",
  // },
];

export enum departments {
  "PROJECT",
  "STUDY",
  "MENTORING",
}

export enum positions {
  "DEVELOPOR",
  "PLANNER",
  "DESIGNER",
  "MEMBER",
  "MENTOR",
  "MENTEE",
}

// 실제 Entity interface

// export enum departments {
//   "PROJECT",
//   "STUDY",
//   "MENTORING",
// }

// export enum positions {
//   "DEVELOPOR",
//   "PLANNER",
//   "DESIGNER",
//   "MEMBER",
//   "MENTOR",
//   "MENTEE",
// }

// export interface IUser {
//   id: number;
//   email: string;
//   nickname: string;
//   bio: string;
//   isPublic: boolean;
//   department: departments;
//   position: positions;
//   grade: number;
//   club: string;
//   contact: string;
//   externalLink: string[];
//   like: IPost[];
//   posts: IPost[];
// }

// export interface IPost {
//   id: number;
//   title: string;
//   content: string;
//   contact: string;
//   period: number;
//   total: number;
//   isCompleted: boolean;
//   author: IUser;
//   postStart: string;
//   postEnd: string;
//   projectStart: string;
//   projectEnd: string;

//   category: string;
// }

//api

export const readPosts = async (
  page: string | null,
  search: string | null,
  order: string | null,
  type: string | null,
  position: string | null,
  pay: string | null,
  limit: string | null
) => {
  try {
    const TOKEN = localStorage.getItem("key");

    let paramPage = "";
    let paramSearch = "";
    let paramOrder = "";
    let paramType = "";
    let paramPosition = "";
    let paramPay = "";
    let paramLimit = "";

    if (page) {
      paramPage = `&page=${page}`;
    }
    if (search) {
      paramSearch = `&search=${search}`;
    }
    if (order) {
      paramOrder = `&order=${order}`;
    }
    if (type) {
      paramType = `&type=${type}`;
    }
    if (position) {
      paramPosition = `&position=${position}`;
    }
    if (pay) {
      if (pay === "yes") paramPay = `&pay=yes`;
      else if (pay === "no") paramPay = `&pay=no`;
    }
    if (limit) {
      paramLimit = `&limit=${limit}`;
    }

    const response = await axios.get(
      `http://localhost:8080/posts?${paramPage}${paramSearch}${paramOrder}${paramType}${paramPosition}${paramPay}${paramLimit}`,
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const readOnePost = async (id: number) => {
  try {
    // const TOKEN = await localStorage.getItem("key");
    // axios.defaults.headers.common["Authorization"] = await `Bearer ${TOKEN}`;
    // const response = await axios.get(`http://localhost:8080/posts/${id}`);

    const TOKEN = localStorage.getItem("key");
    // axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;
    const response = await axios.get(`http://localhost:8080/posts/${id}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};



export const createMentoring = async (data: IMentoring) => {
  const TOKEN = localStorage.getItem("key");
  const response = axios.post("http://localhost:8080/posts", data, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    withCredentials: true,
  });
  return response;
};

export const createStudy = (data: IStudy) => {
  const TOKEN = localStorage.getItem("key");
  // axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;
  const response = axios.post("http://localhost:8080/posts", data, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    withCredentials: true,
  });
  return response;
};

export const createProject = async (data: IProject) => {
  const TOKEN = localStorage.getItem("key");
  // axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;
  const response = axios.post("http://localhost:8080/posts", data, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    withCredentials: true,
  });
  return response;
};

export const deletePost = (id: number) => {
  try {
    const TOKEN = localStorage.getItem("key");
    // axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;
    const response = axios.delete(`http://localhost:8080/posts/${id}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const updatePost = (id: number, data: any) => {
  try {
    console.log("DD", data);
    const TOKEN = localStorage.getItem("key");
    // axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;
    const response = axios.put(`http://localhost:8080/posts/${id}`, data, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

export interface ImemberSignup {
  nickname: string;
  isPublic: boolean;
  bio?: string;
  department?: string;
  position?: string;
  grade?: number;
  contact?: string;
  club?: string[];
  externalLinks?: string[];
}

export const memberSignUp = (data: ImemberSignup) => {
  try {
    console.log("!!!");
    const TOKEN = localStorage.getItem("key");
    const response = axios.post("http://localhost:8080/users", data, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      withCredentials: true,
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};

// export const member

export const memberUpdate = (data: IUser) => {
  try {
    const TOKEN = localStorage.getItem("key");
    const response = axios.put("http://localhost:8080/users/me", data, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      withCredentials: true,
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const memberProfile = async () => {
  const TOKEN = localStorage.getItem("key");
  const response = await axios.get("http://localhost:8080/users/me", {
    headers: { Authorization: `Bearer ${TOKEN}` },
    withCredentials: true,
  });
  return response.data;
};

export const memberDelete = () => {
  try {
    const TOKEN = localStorage.getItem("key");
    const response = axios.delete("http://localhost:8080/users/me", {
      headers: { Authorization: `Bearer ${TOKEN}` },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const readMembers = async (
  page: number,
  position: string | null,
  grade: string | null,
  department: string | null
) => {
  const TOKEN = localStorage.getItem("key");

  let paramPosition = "";
  let paramDepartment = "";
  let paramGrade = "";

  if (position) {
    paramPosition = `&position=${position}`;
  }
  if (department) {
    paramDepartment = `&department=${department}`;
  }
  if (grade) {
    paramGrade = `&grade=${grade}`;
  }

  const response = await axios.get(
    `http://localhost:8080/pool?page=${
      page + ""
    }${paramPosition}${paramDepartment}${paramGrade}`,
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
      withCredentials: true,
    }
  );

  return response.data;
};

export const addLikePost = async (postId: number) => {
  const TOKEN = localStorage.getItem("key");
  const response = await axios.post(
    `http://localhost:8080/posts/${postId}/likes`,
    postId,
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
      withCredentials: true,
    }
  );

  return response;
};

export const deleteLikePost = async (postId: number) => {
  const TOKEN = localStorage.getItem("key");
  const response = await axios.delete(
    `http://localhost:8080/posts/${postId}/likes`,
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
      withCredentials: true,
    }
  );
  console.log(response);
  return response;
};

export const loginCheckApi = () => {
  const TOKEN = localStorage.getItem("key");
  const response = axios.get(`http://localhost:8080/auth`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    withCredentials: true,
  });
  return response;
};





///////////////////////////////////////////////
// version 2 api

export interface IPosition{
  name : string,
  count : number,
}

export interface ITags{
  firstLine : string,
  secondLine : string,
}

export interface IReadOnePost {
  id: number;
  title: string;
  summary : string;
  recruitStart : Date;
  recruitEnd : Date;
  projectStart : Date;
  durations : string[];
  postTypes : string[];
  tags : ITags;
  author : string;
  content: string;
  contact: string;
  contactDetails: string;
  positions: IPosition[];
  years : string[];
  departments: string[];
  keywords: string[];
  posterPaths : string[];
  nBookmark : number;
  views : number;
  hasLiked : boolean;
  verified : boolean;
  isClosed: boolean;
  isArchived : boolean;
  createdDate : Date;
  lastModifiedDate : Date;
  // 지원 자격
}

export interface IReadAllPosts {
  total: number;
  relatedKeywords: string[],
  posts: IReadOnePost[];
}

export interface ICreatePost {
  "title": string;
	"summary"?: string;
	"tags": ITags;
	"postTypes": string[];
	"recruitStart"?: Date;
	"recruitEnd"?: Date;
	"projectStart"?: Date; 
	"positions": IPosition[]; // positions : 없을 경우 "전체", 인원 : ~ 로 넣어서 요청해주기
	"contact": string;
	
  // Optional
  "durations"?: string[];
	"contactDetails"?: string;
	"content"?: string; // 텍스트 에디터 변환 코드가 들어갈 예정
	"years"?: string[];
	"departments"?: string[];
	"keywords" ?: string[];
	"posterPaths" ?: string[];
}

export const createPost = async (data : ICreatePost) => {
  const TOKEN = localStorage.getItem("key");
  const response = axios.post("http://localhost:8080/posts", data, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    withCredentials: true,
  });
  return response;
};
