export interface ITags {
  first?: string[];
  second?: string[];
}

export interface INewPost {
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

export interface IOnSubmitData {
  title: string;
  summary?: string;
  first?: string[];
  second?: string[];
  postTypes: string[];
  recruitStart?: string;
  recruitEnd?: string;
  duration?: string;
  durationText?: string;
  targetCount?: string;
  contact: string;
  contactDetails?: string;
  years?: string[];
  departments?: string[];
  keyword?: string;
  keywords?: string[];
  firstKeyword?: string;
  secondKeyword?: string;
  qualifications?: string;
  positionToggle?: boolean;
  total?: string;
  categoryETC?: string;
  content?: string;
}
