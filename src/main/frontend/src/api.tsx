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

export const readPosts = async (
  page: string | null,
  search: string | null,
  order: string | null,
  type: string | null,
  limit: string | null,
  keywords: string[] | null,
  myDeptOnly?: boolean | null,
  grade?: string | null,
  major?: string | null
  // position: string | null,
  // pay: string | null,
) => {
  try {
    const TOKEN = localStorage.getItem("key");

    let paramPage = "";
    let paramOrder = "";
    let paramType = "";
    let paramLimit = "";
    let paramKeywords = "";
    let paramSearch = "";
    let paramMyDeptOnly = "";
    let paramGrade = "";
    let paramMajor = "";
    // let paramPosition = "";
    // let paramPay = "";

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
    // if (position) {
    //   paramPosition = `&position=${position}`;
    // }
    // if (pay) {
    //   if (pay === "yes") paramPay = `&pay=yes`;
    //   else if (pay === "no") paramPay = `&pay=no`;
    // }
    if (limit) {
      paramLimit = `&limit=${limit}`;
    }
    if (search) {
      paramSearch = `&search=${search}`;
    }
    if (keywords && keywords.length !== 0) {
      paramKeywords = "&keywords=" + keywords.join(",");
      // // console.log(paramKeywords);
    }
    if (myDeptOnly) {
      paramMyDeptOnly = `&myDeptOnly=${true}`;
    }
    if (grade) {
      paramGrade = `&year=${decodeURI(grade)}`;
    }
    if (major) {
      paramMajor = `&department=${decodeURI(major)}`;
    }

    const response = await axios.get(
      // `http://localhost:8080/posts?${paramPage}${paramSearch}${paramOrder}${paramType}${paramPosition}${paramPay}${paramLimit}`,

      `${process.env.REACT_APP_BACK_BASE_URL}/posts?${paramPage}${paramOrder}${paramType}${paramLimit}${paramKeywords}${paramMyDeptOnly}${paramGrade}${paramMajor}`,
      // `http://localhost:8080/posts?${paramPage}${paramSearch}${paramOrder}${paramType}${paramLimit}${paramKeywords}`,
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    // // console.error(error);
  }
};

export const readOnePost = async (id: number) => {
  try {
    // const TOKEN = await localStorage.getItem("key");
    // axios.defaults.headers.common["Authorization"] = await `Bearer ${TOKEN}`;
    // const response = await axios.get(`http://localhost:8080/posts/${id}`);

    const TOKEN = localStorage.getItem("key");
    axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;
    const response = await axios.get(
      `${process.env.REACT_APP_BACK_BASE_URL}/posts/${id}`,
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    // // console.error(error);
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
    const response = axios.delete(
      `${process.env.REACT_APP_BACK_BASE_URL}/posts/${id}`,
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    // console.error(error);
  }
};

export interface IClosePost {
  isClosed: boolean;
}

export interface ITags {
  first?: string[];
  second?: string[];
}

export interface IUpdatePost {
  title: string;
  summary?: string | null;
  tags: ITags;
  postTypes: string[];
  recruitStart?: string | null;
  recruitEnd?: string | null;
  duration?: string | null;
  targetCount?: string;
  contact: string;
  contactDetails?: string | null;
  content?: string | null;
  years?: string[] | null;
  departments?: string[] | null;
  keywords?: string[] | null;
  posterPaths?: string[] | null; // imageURLList를 string 배열로 추측, 실제로는 타입을 확인하셔야 합니다.
  isETC?: boolean; // newIsETC를 boolean으로 추측, 실제로는 타입을 확인하셔야 합니다.
  qualifications?: string | null;
}

export const updatePost = (id: number, data: IUpdatePost | IClosePost) => {
  try {
    // console.log("DD", data);
    const TOKEN = localStorage.getItem("key");
    // axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;
    const response = axios.put(
      `${process.env.REACT_APP_BACK_BASE_URL}/posts/${id}`,
      data,
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    // console.error(error);
    // console.log("error!!");
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

export const userSignUp = (data: ImemberSignup) => {
  try {
    // console.log("!!!");
    const TOKEN = localStorage.getItem("key");
    const response = axios.post(
      `${process.env.REACT_APP_BACK_BASE_URL}/users`,
      data,
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    // console.error(error);
  }
};

// export const member

export const userUpdate = (data: IUser) => {
  try {
    const TOKEN = localStorage.getItem("key");
    const response = axios.put(
      `${process.env.REACT_APP_BACK_BASE_URL}/users/me`,
      data,
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
        withCredentials: true,
      }
    );
    // console.log(response);
    return response;
  } catch (error) {
    // console.error(error);
  }
};

export const userProfile = async () => {
  const TOKEN = localStorage.getItem("key");
  const response = await axios.get(
    `${process.env.REACT_APP_BACK_BASE_URL}/users/me`,
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
      withCredentials: true,
    }
  );
  return response.data;
};

export const userDelete = () => {
  try {
    const TOKEN = localStorage.getItem("key");
    const response = axios.delete(
      `${process.env.REACT_APP_BACK_BASE_URL}/users/me`,
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    // console.error(error);
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
    `${process.env.REACT_APP_BACK_BASE_URL}/pool?page=${
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
    `${process.env.REACT_APP_BACK_BASE_URL}/posts/${postId}/likes`,
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
    `${process.env.REACT_APP_BACK_BASE_URL}/posts/${postId}/likes`,
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
      withCredentials: true,
    }
  );
  return response;
};

export const loginCheckApi = () => {
  const TOKEN = localStorage.getItem("key");
  const response = axios.get(`${process.env.REACT_APP_BACK_BASE_URL}/auth`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    withCredentials: true,
  });
  return response;
};

///////////////////////////////////////////////
// version 2 api

export interface IPosition {
  name: string;
  count: number;
}

export interface IReadOnePost {
  id: number;
  title: string;
  summary: string;
  recruitStart: Date;
  recruitEnd: Date;
  // projectStart: Date;
  duration: string;
  postTypes: string[];
  tags: ITags;
  author: string;
  content: string;
  contact: string;
  contactDetails: string;
  // positions: IPosition[];
  targetCount: string;
  years: string[];
  departments: string[];
  keywords: string[];
  posterPaths: string[];
  nlike: number;
  views: number;
  hasLiked: boolean;
  verified: boolean;
  closed: boolean;
  archived: boolean;
  createdDate: Date;
  lastModifiedDate: Date;
  qualifications: string;
  etc: boolean;
  // 지원 자격
}

export interface IReadAllPosts {
  total: number;
  relatedKeywords: string[];
  posts: IReadOnePost[];
}

export interface ICreatePost {
  title: string;
  summary?: string | null;
  tags: ITags;
  postTypes: string[];
  recruitStart?: string | null;
  recruitEnd?: string | null;
  duration?: string | null;
  targetCount?: string | null;
  contact: string;
  contactDetails?: string | null;
  content?: string | null;
  years?: string[] | null;
  departments?: string[] | null;
  keywords?: string[] | null;
  posterPaths?: string[] | null; // imageURLList를 string 배열로 추측, 실제로는 타입을 확인하셔야 합니다.
  isETC?: boolean; // newIsETC를 boolean으로 추측, 실제로는 타입을 확인하셔야 합니다.
  qualifications?: string | null;
}

export const createPost = async (data: ICreatePost) => {
  const TOKEN = localStorage.getItem("key");
  const response = axios.post(
    `${process.env.REACT_APP_BACK_BASE_URL}/posts`,
    data,
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
      withCredentials: true,
    }
  );
  return response;
};

export interface IRandomNickname {
  words: string[];
  seed: string;
}

export const randomNickname = async () => {
  const response = await axios.get(
    // `${process.env.REACT_APP_RANDOM_NICKNAME_URL}`
    `${process.env.REACT_APP_BACK_BASE_URL}/nickname`
  );
  // const response = await axios.get("naver/?format=json&max_length=8");
  // console.log("get RandomNickname api 중...");
  // console.log(process.env.REACT_APP_RANDOM_NICKNAME_URL);
  return response.data;
};

export const validationNickname = async (nickname: string) => {
  const response = await axios.get(
    `${process.env.REACT_APP_BACK_BASE_URL}/users/validation?nickname=${nickname}`
  );

  return response.data;
};

export interface IOneUser {
  nickname: string;
  major1: string;
  major2: string;
}
// API_REST_API_ROOT_URL
// "http://localhost:8080/users/me"
export const readOneMember = async () => {
  const TOKEN = localStorage.getItem("key");
  const response = await axios.get(
    `${process.env.REACT_APP_BACK_BASE_URL}/users/me`,
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
      withCredentials: true,
    }
  );
  return response.data;
};

export const memberSignUp = (data: IUserSignup) => {
  try {
    const TOKEN = localStorage.getItem("key");
    const response = axios.post(
      `${process.env.REACT_APP_BACK_BASE_URL}/users`,
      data,
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    // console.error(error);
  }
};

// export const member

export const memberUpdate = (data: IUserUpdate) => {
  try {
    const TOKEN = localStorage.getItem("key");
    const response = axios.put(
      `${process.env.REACT_APP_BACK_BASE_URL}/users/me`,
      data,
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
        withCredentials: true,
      }
    );
    // console.log(response);
    return response;
  } catch (error) {
    // console.error(error);
  }
};

export const memberProfile = async () => {
  const TOKEN = localStorage.getItem("key");
  const response = await axios.get(
    `${process.env.REACT_APP_BACK_BASE_URL}/users/me`,
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
      withCredentials: true,
    }
  );
  return response.data;
};

export const memberDelete = () => {
  try {
    const TOKEN = localStorage.getItem("key");
    const response = axios.delete(
      `${process.env.REACT_APP_BACK_BASE_URL}/users/me`,
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    // console.error(error);
  }
};

export interface IUserSignup {
  nickname: string;
  major1: string;
  major2?: string;
}

export interface IUserUpdate {
  nickname?: string;
  major1?: string;
  major2?: string;
}

export interface IProfile {
  nickname: string;
  major1: string;
  major2: string;
}

export interface IUserRead {
  profile: IProfile;
  posts: IReadOnePost[];
  likes: IReadOnePost[];
  archives: IReadOnePost[];
}

export const majorAutoComplete = async (q: string) => {
  const response = await axios.get(
    // `${process.env.REACT_APP_BACK_BASE_URL}/api/nickname`
    `${process.env.REACT_APP_BACK_BASE_URL}/major?q=${q}`
    // `https://nickname.hwanmoo.kr`
  );
  return response.data;
};

// const checkHasIncode = (keyword: string) => {
//   const check_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글인지 식별해주기 위한 정규표현식

//   if (keyword.match(check_kor)) {
//     const encodeKeyword = decodeURI(keyword); // 한글 인코딩
//     return encodeKeyword;
//   } else {
//     return keyword;
//   }
// };

export const keywordAutoComplete = async (q: string) => {
  // const TOKEN = localStorage.getItem("key");
  const response = await axios.get(
    `${process.env.REACT_APP_BACK_BASE_URL}/keyword?q=${q}`
    // {
    //   headers: { Authorization: `Bearer ${TOKEN}` },
    //   withCredentials: true,
    // }
  );
  return response.data;
};
