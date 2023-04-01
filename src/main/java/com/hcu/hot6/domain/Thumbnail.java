package com.hcu.hot6.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Thumbnail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "thumbnail_id")
    private Long id;

    private String title;
    private String summary;
    private LocalDateTime recruitStart;     // 미래인 경우 썸네일에 "모집 예정" , 아닌 경우 "D-00" 표시
    private LocalDateTime recruitEnd;
    private LocalDateTime projectStart;
    private String durations;       // 다중선택 가능 - 구분 "," 콤마

    @OneToOne(fetch = FetchType.LAZY, mappedBy = "thumbnail")
    private Post post;
    private String keywords;    // 썸네일 내 키워드 - 줄 구분은 ";" 세미콜론, 키워드 구분은 "," 콤마

    private boolean isClosed;   // 지원자가 상세보기 불가능한 상태 - 썸네일은 확인 가
    private boolean isArchived; // 작성자만 마이페이지에서 확인 가능



}
