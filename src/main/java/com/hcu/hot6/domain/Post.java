package com.hcu.hot6.domain;

import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.request.PostUpdateRequest;
import com.hcu.hot6.domain.response.PostReadOneResponse;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    private Member author;
    @NotNull
    private String postTypes;   // keyword. "," 콤마로 구분
    @NotNull
    private String contact;

    // 필수 아닌 필드
    private String content;
    private String contactDetails;
    private String targetYears;         // 다중선택 가능. "," 콤마로 구분
    private String targetDepartment;    // 다중선택 가능. "," 콤마로 구분

    @OneToMany(mappedBy = "post")
    @JoinColumn(name="bookmark_id")
    private List<Bookmark> bookmarks;
    @OneToMany(mappedBy = "post")
    @JoinColumn(name="position_id")
    private List<Position> positions;

    @OneToMany(mappedBy = "post")
    @JoinColumn(name = "poster_id")
    private List<Poster> posters;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thumbnail_id")
    private Thumbnail thumbnail;

    private String keywords;            // 추가 설명 키워드. "," 콤마로 구분
    private Long views;                 // 조회수
    private boolean isAutoClose;
    @CreatedDate
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;

    @ManyToMany
    @JoinTable(name = "PostLike",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "member_id"))
    private List<Member> likes = new ArrayList<>();

    public Post(PostCreationRequest request, Member author) {
        this.content = request.getContent();
        this.contact = request.getContact();
        this.keywords = String.join(
                ",",
                Optional.ofNullable(request.getKeywords())
                        .orElse(List.of())
        );
        registerAuthor(author);
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

    //=== 연관관계 메서드 ===//
    private void registerAuthor(Member author) {
        this.author = author;
        author.getPosts().add(this);
    }

    public Post addBookmark(Member member) {
        if (this.likes.contains(member)) {
            throw new IllegalArgumentException("Already liked the post.");
        }
        this.likes.add(member);
        return this;
    }

    public Post delBookmark(Member member) {
        if (!this.likes.contains(member)) {
            throw new IllegalArgumentException("No match member found: " + member);
        }
        this.likes.remove(member);
        return this;
    }

    public void update(PostUpdateRequest request) {
        this.content = request.getContent();
        this.contact = request.getContact();
    }

    public PostReadOneResponse toResponse(String email) {
        return new PostReadOneResponse(this, email);
    }

}
