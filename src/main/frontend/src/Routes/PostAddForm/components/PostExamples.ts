// converter
export const converter = (what: string, info?: string | Date) => {
  if (what === "year") {
    let year = ((info as Date).getFullYear() + "").padStart(2, "0");
    let month = ((info as Date).getMonth() + 1 + "").padStart(2, "0");
    let date = ((info as Date).getDate() + "").padStart(2, "0");
    let convertedDate = year + "-" + month + "-" + date;
    // console.log("이거? " ,convertedDate);
    return convertedDate;
  } else if (what === "dateTime") {
    if (!info) return null;
    let year = (new Date(info as string).getFullYear() + "").padStart(2, "0");
    let month = (new Date(info as string).getMonth() + 1 + "").padStart(2, "0");
    let date = (new Date(info as string).getDate() + "").padStart(2, "0");
    let convertedDate = year + "-" + month + "-" + date;
    // console.log("이거? " ,convertedDate);
    return convertedDate;
  }
};

// 현재 부터 end날짜까지의 디데이를 세줌
export const dateDifference = (end: string) => {
  const date1 = new Date(converter("year", new Date())!);
  const date2 = new Date(end);

  const diffDate = date2.getTime() - date1.getTime();

  return Math.floor(diffDate / (1000 * 60 * 60 * 24));
};

// D-Day 를 상시모집 과 같은 스트링으로 바꿔줌

export const convertDateToString = (postStart: any, postEnd: any) => {
  // console.log(new Date(postStart!), new Date());
  // console.log(new Date(postStart!) > new Date());

  if (dateDifference(postStart) > 0) {
    if (dateDifference(postEnd!) < 0) return "모집 마감";
    else return "모집 예정";
    //return "D+" + Math.abs(dateDifference(postEnd!));
  } else {
    if (dateDifference(postEnd!) === 0) {
      return "D-Day";
    } else if (postEnd === "") {
      return "상시 모집";
    } else if (dateDifference(postEnd!) > 0) {
      return "D-" + dateDifference(postEnd!);
    } else {
      return "모집 마감";
    }
  }
};

export interface IPostExample {
  title: string;
  subTitle: string;
  categories: string[];
  keywordsFirstLine: string[];
  keywordsSecondLine: string[];
  Likes: number;
  postStart: string;
  postEnd: string;
}
export interface IPostExamples {
  선택안됨?: IPostExample[];
  동아리?: IPostExample[];
  프로젝트?: IPostExample[];
  학회?: IPostExample[];
  "수업 내 프로젝트"?: IPostExample[];
  "자율 프로젝트"?: IPostExample[];
  학술모임?: IPostExample[];
  "공모전/대회"?: IPostExample[];
  "운동/게임/취미"?: IPostExample[];
  "전공 스터디"?: IPostExample[];
  "기타 모임"?: IPostExample[];
}

export const PostExamples: IPostExamples = {
  선택안됨: [
    {
      title: "웹 서비스 프로젝트",
      subTitle: "방학 동안 포트폴리오 함께 만들자!",
      categories: ["프로젝트", "학술모임"],
      keywordsFirstLine: ["웹/앱", "리액트", "자바"],
      keywordsSecondLine: ["전공 무관 누구든지"],
      Likes: 5,
      postStart: "2023-05-08",
      postEnd: "2023-05-09",
    },
    {
      title: "iF공모전 참여할 콘디생 모집",
      subTitle: "디리기1,2 수업 수강 중이거나 수강 완료하신 분",
      categories: ["공모전/대회", "운동/게임/취미"],
      keywordsFirstLine: ["UX", "제품 디자인"],
      keywordsSecondLine: ["5학기 이상"],
      Likes: 15,
      postStart: "2023-04-05",
      postEnd: "",
    },
    {
      title: "한동대 주최 해커톤, 놀이톤",
      subTitle:
        "한동대학교에서 주최하는 두 번째 해커톤인 놀이톤에 여러분을 초대합니다.",
      categories: ["프로젝트"],
      keywordsFirstLine: ["한동대", "포스텍"],
      keywordsSecondLine: ["기획자", "디자이너", "개발자"],
      Likes: 35,
      postStart: "2023-04-03",
      postEnd: "2023-04-11",
    },
    {
      title: "시각디자인 학회 도트 리쿠르팅",
      subTitle:
        "도트는 그래픽,편집,타이포 등 다양한 분야의 디자인을 실험적으로 연구하는 학회입니다.",
      categories: ["학회"],
      keywordsFirstLine: ["시각디자인", "2전공 가능", "콘디 학회"],
      keywordsSecondLine: ["1,2학년 리쿠르팅"],
      Likes: 21,
      postStart: "2023-04-03",
      postEnd: "2023-04-09",
    },
    {
      title: "웹 서비스 프로젝트",
      subTitle: "방학 동안 포트폴리오 함께 만들자!",
      categories: ["프로젝트", "학술모임"],
      keywordsFirstLine: ["웹/앱", "리액트", "자바"],
      keywordsSecondLine: ["전공 무관 누구든지"],
      Likes: 5,
      postStart: "2023-05-08",
      postEnd: "2023-05-09",
    },
    {
      title: "한동대 주최 해커톤, 놀이톤",
      subTitle:
        "한동대학교에서 주최하는 두 번째 해커톤인 놀이톤에 여러분을 초대합니다.",
      categories: ["프로젝트"],
      keywordsFirstLine: ["한동대", "포스텍"],
      keywordsSecondLine: ["기획자", "디자이너", "개발자"],
      Likes: 35,
      postStart: "2023-04-03",
      postEnd: "2023-04-11",
    },
  ],
  동아리: [
    {
      title: "iF공모전 참여할 콘디생 모집",
      subTitle: "디리기1,2 수업 수강 중이거나 수강 완료하신 분",
      categories: ["공모전/대회", "운동/게임/취미"],
      keywordsFirstLine: ["UX", "제품 디자인"],
      keywordsSecondLine: ["5학기 이상"],
      Likes: 15,

      postStart: "2023-04-05",
      postEnd: "",
    },
    {
      title: "시각디자인 학회 도트 리쿠르팅",
      subTitle:
        "도트는 그래픽,편집,타이포 등 다양한 분야의 디자인을 실험적으로 연구하는 학회입니다.",
      categories: ["학회"],
      keywordsFirstLine: ["시각디자인", "2전공 가능", "콘디 학회"],
      keywordsSecondLine: ["1,2학년 리쿠르팅"],
      Likes: 21,
      postStart: "2023-04-03",
      postEnd: "2023-04-09",
    },
  ],

  "수업 내 프로젝트": [
    {
      title: "데이터베이스 기초 프로젝트",
      subTitle: "데이터베이스 설계 및 구현 프로젝트",
      categories: ["프로젝트", "학술모임"],
      keywordsFirstLine: ["데이터베이스", "SQL", "ERD"],
      keywordsSecondLine: ["MySQL", "정규화"],
      Likes: 8,
      postStart: "2023-04-10",
      postEnd: "2023-04-20",
    },
    {
      title: "브랜딩 디자인 프로젝트",
      subTitle: "새로운 스타트업 브랜드 아이덴티티 디자인",
      categories: ["프로젝트", "디자인"],
      keywordsFirstLine: ["브랜딩", "로고 디자인", "아이덴티티"],
      keywordsSecondLine: ["팔레트", "타이포", "모션그래픽"],
      Likes: 18,
      postStart: "2023-04-15",
      postEnd: "2023-05-10",
    },
    {
      title: "UI/UX 디자인 워크숍",
      subTitle: "모바일 앱 인터페이스 리디자인 프로젝트",
      categories: ["프로젝트", "디자인"],
      keywordsFirstLine: ["UI/UX", "앱 디자인", "인터렉션"],
      keywordsSecondLine: ["프로토타이핑", "스케치", "Figma"],
      Likes: 24,
      postStart: "2023-05-01",
      postEnd: "2023-05-30",
    },
    {
      title: "인공지능 모델 프로젝트",
      subTitle: "기계 학습 모델을 활용한 이미지 분류 프로젝트",
      categories: ["프로젝트", "학술모임"],
      keywordsFirstLine: ["인공지능", "기계 학습", "딥러닝"],
      keywordsSecondLine: ["TensorFlow", "PyTorch", "CNN"],
      Likes: 20,
      postStart: "2023-05-10",
      postEnd: "2023-06-15",
    },
  ],
  "자율 프로젝트": [
    {
      title: "웹 서비스 프로젝트",
      subTitle: "방학 동안 포트폴리오 함께 만들자!",
      categories: ["프로젝트", "학술모임"],
      keywordsFirstLine: ["웹/앱", "리액트", "자바"],
      keywordsSecondLine: ["전공 무관 누구든지"],
      Likes: 5,
      postStart: "2023-05-08",
      postEnd: "2023-05-09",
    },
    {
      title: "iF공모전 참여할 콘디생 모집",
      subTitle: "디리기1,2 수업 수강 중이거나 수강 완료하신 분",
      categories: ["공모전/대회", "운동/게임/취미"],
      keywordsFirstLine: ["UX", "제품 디자인"],
      keywordsSecondLine: ["5학기 이상"],
      Likes: 15,
      postStart: "2023-04-05",
      postEnd: "",
    },
    {
      title: "한동대 주최 해커톤, 놀이톤",
      subTitle:
        "한동대학교에서 주최하는 두 번째 해커톤인 놀이톤에 여러분을 초대합니다.",
      categories: ["프로젝트"],
      keywordsFirstLine: ["한동대", "포스텍"],
      keywordsSecondLine: ["기획자", "디자이너", "개발자"],
      Likes: 35,
      postStart: "2023-04-03",
      postEnd: "2023-04-11",
    },
    {
      title: "시각디자인 학회 도트 리쿠르팅",
      subTitle:
        "도트는 그래픽,편집,타이포 등 다양한 분야의 디자인을 실험적으로 연구하는 학회입니다.",
      categories: ["학회"],
      keywordsFirstLine: ["시각디자인", "2전공 가능", "콘디 학회"],
      keywordsSecondLine: ["1,2학년 리쿠르팅"],
      Likes: 21,
      postStart: "2023-04-03",
      postEnd: "2023-04-09",
    },
  ],
};

export const PostDetailExample = {
  id: 1,
  title: "시각디자인 학회 도트 리크루팅",
  summary:
    "도트는 그래픽, 편집, 타이포 등 다양한 분야의 디자인을 실험적으로 연구하는 학회입니다.",
  recruitStart: new Date("2023-04-03"),
  recruitEnd: new Date("2023-04-13"),
  projectStart: new Date("2023-05-13"),
  duration: ["봄학기", "가을학기"],
  postTypes: ["학회", "학술모임"],
  tags: ["1,2", "3,4"],
  author: "아프지마 도트 잠보",
  content: `🪙 시각디자인 학회 도트 1&2학년 리쿠르팅 🪙

        안녕하세요! 시각디자인학회 도트(DOT)입니다. 도트는 그래픽, 편집, 타이포 등 다양한 분야의 디자인을 실험적으로 연구하는 학회입니다.
        
        이번 리크루팅은 취향과 안목이 있는 1,2학년 분들을 발견해 함께하는 것을 목표로 진행합니다. 
        디자인 작업을 한 경험이 적거나 작업물이 아직 충분하지 않은 1,2학년 학우의 경우 도트 인스타그램 게시물을 통해 아카이브 과제를 진행해주시면 되겠습니다.
        
        📍지원기간 4주차 목요일(3/23) ~ 6주차 월요일 (4/3)
        
        📍지원자격 23년도 1학기 7주차부터 매주 수요일 정모 (19:30-21:30)에 참석 가능하며, 4학기 이상(2학기 연속 필수) 활동 가능한 디자인 전공자, 
        24년도 디그리어는 3학기 이상 활동 필수. (디자인이 2전공이신 분들도 지원 가능합니다)
        
        📍면접날짜
        6주차 수요일 (4/5) 오후
        (면접시간은 전날 개별적으로 연락) 
        
        💥지원방법
        도트 인스타계정(@design_optical_truth) 프로필에 있는 링크로 접속하여 지원서를 작성하시고, 포트폴리오는 PDF로 정리한 후 제출해주세요.`,
  contact: "@design_optical_truth",
  contactDetails: `도트 인스타계정(@design_optical_truth) 프로필에 있는 링
        크로 접속하여 지원서를 작성하시고, 포트폴리오는 PDF로 정리
        한 후 제출해주세요.`,
  positions: [{ name: "전체", count: 3 }],
  years: ["1학년", "2학년"],
  departments: ["시각디자인"],
  keywords: [
    "학회",
    "시각디자인",
    "2전공 가능",
    "콘디 학회",
    "1,2학년 리크루팅",
    "그래픽",
    "편집디자인",
    "타이포",
    "디자인",
    "DOT",
    "콘디",
  ],
  posterPaths: [],
  nBookmark: 10,
  views: 200,
  hasLiked: false,
  verified: true,
  isClosed: false,
  isArchived: false,
  createdDate: new Date("2023-04-05"),
  lastModifiedDate: new Date("2023-04-04"),
  // 지원 자격
};
