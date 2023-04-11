package com.hcu.hot6.domain;

import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.response.PostThumbnailResponse;
import com.hcu.hot6.util.Utils;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

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
    private String tags;    // 썸네일 내 키워드 - 줄 구분은 ";" 세미콜론, 키워드 구분은 "," 콤마

    private boolean isClosed;   // 지원자가 상세보기 불가능한 상태 - 썸네일은 확인 가
    private boolean isArchived; // 작성자만 마이페이지에서 확인 가능

    public void setPost(Post post) {
        this.post = post;
    }

    public Thumbnail(PostCreationRequest request) {
        this.title = request.getTitle();
        this.summary = request.getSummary();
        this.tags = (Objects.isNull(request.getTags())) ? "" : request.getTags().combine();
        this.recruitStart = Utils.toLocalDateTime(request.getRecruitStart());
        this.recruitEnd = Utils.toLocalDateTime(request.getRecruitEnd());
        this.projectStart = Utils.toLocalDateTime(request.getProjectStart());
        this.durations = arrayToString(request.getDurations());
    }

    private String arrayToString(List<Duration> durations) {
        List<String> list = durations.stream()
                .map(Enum::name)
                .toList();

        return String.join(
                ",",
                Optional.of(list)
                        .orElse(List.of())
        );
    }

    public PostThumbnailResponse toResponse(String email) {
        return new PostThumbnailResponse(this, email);
    }
}
