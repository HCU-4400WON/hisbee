package com.hcu.hot6.domain;

import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.request.PostUpdateRequest;
import com.hcu.hot6.domain.response.PostReadOneResponse;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String title;
    private String content;
    @NotNull
    private String contact;
    @Embedded
    private Period period;
    private String durationList;
    private String keywordList;
    private int total;
    private int curr;
    private int remaining;
    private int views;
    private boolean isCompleted;
    private boolean isArchived;
    private boolean isAutoClose;

    @ManyToOne(fetch = FetchType.LAZY)
    private Member author;

    @ManyToMany
    @JoinTable(name = "PostLike",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "member_id"))
    private List<Member> likes = new ArrayList<>();

    public Post(PostCreationRequest request, Member author) {
        this.title = request.getTitle();
        this.content = request.getContent();
        this.contact = request.getContact();
        this.period = Period.ByPeriodBuilder()
                .postStart(request.getPostStart())
                .postEnd(request.getPostEnd())
                .projectStart(request.getProjectStart())
                .build();
        this.total = request.getTotal();
        this.curr = 0;
        this.remaining = request.getTotal();
        this.views = 0;
        this.keywordList = String.join(
                ",",
                Optional.ofNullable(request.getKeywords())
                        .orElse(List.of())
        );
        this.durationList = arrayToString(request.getDurations());
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
        member.getLikes().add(this);
        return this;
    }

    public Post delBookmark(Member member) {
        if (!this.likes.contains(member)) {
            throw new IllegalArgumentException("No match member found: " + member);
        }
        this.likes.remove(member);
        member.getLikes().remove(this);
        return this;
    }

    public void update(PostUpdateRequest request) {
        this.title = request.getTitle();
        this.content = request.getContent();
        this.contact = request.getContact();
        this.period.update(
                request.getPostStart(),
                request.getPostEnd(),
                request.getProjectStart()
        );
        this.total = request.getTotal();
        this.curr = request.getCurr();
        this.remaining = total - curr;
        this.isCompleted = total == curr;
        this.keywordList = String.join(
                ",",
                Optional.ofNullable(request.getKeywords())
                        .orElse(List.of())
        );
        this.durationList = arrayToString(request.getDurations());
    }

    public PostReadOneResponse toResponse(String email) {
        return new PostReadOneResponse(this, email);
    }
}
