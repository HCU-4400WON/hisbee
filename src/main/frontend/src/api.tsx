// 가상 Entity interface

import { useState } from "react";

export interface IPost {
  id: number;
  title: string;
  content: string;
  contact: string;
  period: number;
  total: number;
  isCompleted: boolean;
  author: string;
  postStart: string;
  postEnd: string;
  projectStart: string;
  projectEnd: string;

  category: string;
}

export const posts: IPost[] = [
  {
    id: 1,
    title: "프로젝트 하실 분 구합니다",
    content:
      "채원 디자이너님에게\n안녕하세요?\n위의 모든 기능은 화면에 보여줘야 할 정보가 동일합니다.\n따라서 하나의 통일된 화면을 만들어두고, 수정하기 버튼, 인원 등록 및 삭제 팝업(?)\n그대로 보여주면 모집 상세보기 화면으로 사용할 수 있도록 하면 좋을 것 같아요!",
    contact: "hellohi@handong.ac.kr",
    period: 20,
    total: 4,
    isCompleted: false,
    author: "hello_0803",
    postStart: "2022-08-22",
    postEnd: "2022-09-02",
    projectStart: "2022-06-22",
    projectEnd: "2022-07-12",
    category: "PROJECT",
  },
  {
    id: 2,
    title: "모두의 아이디어 랩",
    content:
      "반드시 읽어주세요\n이번 행사는 오프라인으로 진행됩니다.\n참가 신청 후 취소 의향이 있으실 경우, 다음 대기자를 위해 반드시 취소 처리를 부탁드립니다.\n별도 알림 없이 불참하실 경우 향후 행사 참여 제한이 있을 수 있습니다.",
    contact: "dsyjf_2@handong.ac.kr",
    period: 30,
    total: 5,
    isCompleted: false,
    author: "Inhyuk_52",
    postStart: "2022-05-02",
    postEnd: "2022-06-01",
    projectStart: "2022-06-07",
    projectEnd: "2022-07-07",
    category: "STUDY",
  },
  {
    id: 0,
    title: "저만의 멘토, 구합니다",
    content:
      "다음 대기자를 위해 반드시 취소 처리를 부탁드립니다.\n별도 알림 없이 불참하실 경우 향후 행사 참여 제한이 있을 수 있습니다.",
    contact: "dsyjf_2@handong.ac.kr",
    period: 30,
    total: 5,
    isCompleted: false,
    author: "mentos_1",
    postStart: "2022-05-02",
    postEnd: "2022-06-01",
    projectStart: "2022-06-07",
    projectEnd: "2022-07-07",
    category: "MENTORING",
  },
  {
    id: 0,
    title:
      "프론트엔드_더 쉽고 빠른 지식/정보 콘텐츠 요약 플랫폼_사이드프로젝트",
    content:
      "크리에이터와 엔드유저, 그외에 관련이 있는 다양한 Stakeholder들에게 보여드렸고\n실제로 관심을 가지신 분들이 많아요! (두근두근)\n아이디어를 프로토타입으로 간단한 MVP테스트와 Usability, Fake door test를 진행해봤고 결과를 공유드릴 수 있습니다.",
    contact: "dsyjf_2@handong.ac.kr",
    period: 30,
    total: 5,
    isCompleted: false,
    author: "Inhyuk_52",
    postStart: "2022-05-02",
    postEnd: "2022-06-01",
    projectStart: "2022-06-07",
    projectEnd: "2022-07-07",
    category: "STUDY",
  },
  {
    id: 0,
    title:
      "프론트엔드_더 쉽고 빠른 지식/정보 콘텐츠 요약 플랫폼_사이드프로젝트",
    content:
      "크리에이터와 엔드유저, 그외에 관련이 있는 다양한 Stakeholder들에게 보여드렸고\n실제로 관심을 가지신 분들이 많아요! (두근두근)\n아이디어를 프로토타입으로 간단한 MVP테스트와 Usability, Fake door test를 진행해봤고 결과를 공유드릴 수 있습니다.",
    contact: "dsyjf_2@handong.ac.kr",
    period: 30,
    total: 5,
    isCompleted: false,
    author: "Inhyuk_52",
    postStart: "2022-05-02",
    postEnd: "2022-06-01",
    projectStart: "2022-06-07",
    projectEnd: "2022-07-07",
    category: "STUDY",
  },
  {
    id: 0,
    title: "저만의 멘토..구합니다..ㅠ",
    content:
      "다음 대기자를 위해 반드시 취소 처리를 부탁드립니다.\n별도 알림 없이 불참하실 경우 향후 행사 참여 제한이 있을 수 있습니다.",
    contact: "dsyjf_2@handong.ac.kr",
    period: 30,
    total: 5,
    isCompleted: false,
    author: "mentos_1",
    postStart: "2022-05-02",
    postEnd: "2022-06-01",
    projectStart: "2022-06-07",
    projectEnd: "2022-07-07",
    category: "MENTORING",
  },
  {
    id: 0,
    title: "저만의 멘토..구합니다..ㅠ",
    content:
      "다음 대기자를 위해 반드시 취소 처리를 부탁드립니다.\n별도 알림 없이 불참하실 경우 향후 행사 참여 제한이 있을 수 있습니다.",
    contact: "dsyjf_2@handong.ac.kr",
    period: 30,
    total: 5,
    isCompleted: false,
    author: "mentos_1",
    postStart: "2022-05-02",
    postEnd: "2022-06-01",
    projectStart: "2022-06-07",
    projectEnd: "2022-07-07",
    category: "MENTORING",
  },
  {
    id: 1,
    title: "프로젝트 하실 분 구합니다..!",
    content:
      "채원 디자이너님에게\n안녕하세요?\n위의 모든 기능은 화면에 보여줘야 할 정보가 동일합니다.\n따라서 하나의 통일된 화면을 만들어두고, 수정하기 버튼, 인원 등록 및 삭제 팝업(?)\n그대로 보여주면 모집 상세보기 화면으로 사용할 수 있도록 하면 좋을 것 같아요!",
    contact: "hellohi@handong.ac.kr",
    period: 20,
    total: 4,
    isCompleted: false,
    author: "hello_0803",
    postStart: "2022-08-22",
    postEnd: "2022-09-02",
    projectStart: "2022-06-22",
    projectEnd: "2022-07-12",
    category: "PROJECT",
  },
  {
    id: 1,
    title: "프로젝트 하실 분 구합니다..!",
    content:
      "채원 디자이너님에게\n안녕하세요?\n위의 모든 기능은 화면에 보여줘야 할 정보가 동일합니다.\n따라서 하나의 통일된 화면을 만들어두고, 수정하기 버튼, 인원 등록 및 삭제 팝업(?)\n그대로 보여주면 모집 상세보기 화면으로 사용할 수 있도록 하면 좋을 것 같아요!",
    contact: "hellohi@handong.ac.kr",
    period: 20,
    total: 4,
    isCompleted: false,
    author: "hello_0803",
    postStart: "2022-08-22",
    postEnd: "2022-09-02",
    projectStart: "2022-06-22",
    projectEnd: "2022-07-12",
    category: "PROJECT",
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
