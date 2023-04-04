

    export interface IPostExample {
        duration : string,
        title : string,
        subTitle : string,
        categories : string[],
        keywordsFirstLine : string[],
        keywordsSecondLine : string[],
        Likes : number,
    }
    export interface IPostExamples{
        '선택안됨' ?:IPostExample[],
        '동아리' ?: IPostExample[],
        '프로젝트' ?: IPostExample[],
        '학회' ?: IPostExample[],
        '학술모임' ?: IPostExample[],
        '공모전/대회' ?: IPostExample[],
        '운동/게임/취미' ?: IPostExample[],
        '전공 스터디' ?: IPostExample[],
        '기타 모임' ?: IPostExample[],

    }
    
    export const PostExamples : IPostExamples = {
        "선택안됨" : [
            {    
                duration : "모집예정",
                title : "웹 서비스 프로젝트",
                subTitle : "방학 동안 포트폴리오 함께 만들자!",
                categories : ["프로젝트" , "학술모임"],
                keywordsFirstLine : ["웹/앱" , "리액트" , "자바"],
                keywordsSecondLine : ["전공 무관 누구든지"],
                Likes : 5,
            },
            {    
            duration : "상시모집",
            title : "iF공모전 참여할 콘디생 모집",
            subTitle : "디리기1,2 수업 수강 중이거나 수강 완료하신 분",
            categories : ["공모전/대회" , "운동/게임/취미"],
            keywordsFirstLine : ["UX" , "제품 디자인"],
            keywordsSecondLine : ["5학기 이상"],
            Likes : 15,
        },{
            duration : "D-6",
            title : "한동대 주최 해커톤, 놀이톤",
            subTitle : "한동대학교에서 주최하는 두 번째 해커톤인 놀이톤에 여러분을 초대합니다.",
            categories : ["프로젝트"],
            keywordsFirstLine : ["한동대" , "포스텍"],
            keywordsSecondLine : ["기획자" , "디자이너" , "개발자"],
            Likes : 35,
        },
        {
            duration : "D-4",
            title : "시각디자인 학회 도트 리쿠르팅",
            subTitle : "도트는 그래픽,편집,타이포 등 다양한 분야의 디자인을 실험적으로 연구하는 학회입니다.",
            categories : ["학회"],
            keywordsFirstLine : ["시각디자인" , "2전공 가능" , "콘디 학회"],
            keywordsSecondLine : ["1,2학년 리쿠르팅"],
            Likes : 21,
        } ],
        "동아리": [{    
                duration : "상시모집",
                title : "iF공모전 참여할 콘디생 모집",
                subTitle : "디리기1,2 수업 수강 중이거나 수강 완료하신 분",
                categories : ["공모전/대회" , "운동/게임/취미"],
                keywordsFirstLine : ["UX" , "제품 디자인"],
                keywordsSecondLine : ["5학기 이상"],
                Likes : 15,
            },{
                duration : "D-4",
                title : "시각디자인 학회 도트 리쿠르팅",
                subTitle : "도트는 그래픽,편집,타이포 등 다양한 분야의 디자인을 실험적으로 연구하는 학회입니다.",
                categories : ["학회"],
                keywordsFirstLine : ["시각디자인" , "2전공 가능" , "콘디 학회"],
                keywordsSecondLine : ["1,2학년 리쿠르팅"],
                Likes : 21,
            } ],
            "프로젝트": [{    
                duration : "모집예정",
                title : "웹 서비스 프로젝트",
                subTitle : "방학 동안 포트폴리오 함께 만들자!",
                categories : ["프로젝트" , "학술모임"],
                keywordsFirstLine : ["웹/앱" , "리액트" , "자바"],
                keywordsSecondLine : ["전공 무관 누구든지"],
                Likes : 5,
            },{
                duration : "D-6",
                title : "한동대 주최 해커톤, 놀이톤",
                subTitle : "한동대학교에서 주최하는 두 번째 해커톤인 놀이톤에 여러분을 초대합니다.",
                categories : ["프로젝트"],
                keywordsFirstLine : ["한동대" , "포스텍"],
                keywordsSecondLine : ["기획자" , "디자이너" , "개발자"],
                Likes : 35,
            } ],
            "학회" : [{    
                duration : "모집예정",
                title : "시각 디자인 학회 도트 1&2학년 리쿠르팅",
                subTitle : "안녕하세요! 시각디자인 학회 도트(Dot)입니다. 그래픽,편집,타이포 등 다양한 분야를 연구하는 학회입니다.",
                categories : ["학회" , "학술모임"],
                keywordsFirstLine : ["UX" , "타이포" , "그래픽"],
                keywordsSecondLine : ["포트폴리오" , "3학기 필수"],
                Likes : 30,
            },{
                duration : "모집예정",
                title : "웹 서비스 프로젝트",
                subTitle : "방학 동안 포트폴리오 함께 만들자!",
                categories : ["프로젝트" , "학회"],
                keywordsFirstLine : ["웹/앱" , "리액트" , "자바"],
                keywordsSecondLine : ["전공 무관 누구든지"],
                Likes : 5,
            } ],

    }
        
            
        
    
        
    
    

    