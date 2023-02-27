package com.hcu.hot6.domain;

import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.request.PostUpdateRequest;
import com.hcu.hot6.domain.response.PostReadOneResponse;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import net.minidev.json.annotate.JsonIgnore;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Entity
@Getter
@SuperBuilder
@Inheritance(strategy = InheritanceType.JOINED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DiscriminatorColumn(name = "dtype")
public abstract class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "dtype", insertable = false, updatable = false)
    private String dtype;

    @NotNull
    private String title;
    private String content;
    @NotNull
    private String contact;

    @Embedded
    private Period period;

    private int total;
    private int currTotal;
    private int remaining;
    private boolean isCompleted;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @NotNull
    @JoinColumn(name = "author_id")
    private Member author;

    @ManyToMany
    @JsonIgnore
    @JoinTable(name = "PostLike",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "member_id"))
    @Builder.Default
    private List<Member> likes = new ArrayList<>();

    public static Optional<Post> determinePostType(PostCreationRequest request, Member author) {
        switch (request.getDtype()) {
            case "P" -> {
                return Optional.of(new Project(request, author));
            }
            case "S" -> {
                return Optional.of(new Study(request, author));
            }
            case "M" -> {
                return Optional.of(new Mentoring(request, author));
            }
        }
        return Optional.empty();
    }

    public Post(PostCreationRequest request, Member author, int total) {
        this.title = request.getTitle();
        this.content = request.getContent();
        this.contact = request.getContact();
        this.period = Period.ByPeriodBuilder()
                .postEnd(LocalDateTime.ofInstant(request.getPostEnd().toInstant(), ZoneId.systemDefault()))
                .projectStart(LocalDateTime.ofInstant(request.getProjectStart().toInstant(), ZoneId.systemDefault()))
                .projectEnd(LocalDateTime.ofInstant(request.getProjectEnd().toInstant(), ZoneId.systemDefault()))
                .build();
        this.total = total;
        registerAuthor(author);
    }

    //=== 연관관계 메서드 ===//
    private void registerAuthor(Member author) {
        this.author = author;
        author.getPosts().add(this);
    }

    public void addBookmark(Member member) {
        if (this.likes.contains(member)) {
            throw new IllegalArgumentException("Already liked the post.");
        }
        this.likes.add(member);
        member.getLikes().add(this);
    }

    public void delBookmark(Member member) {
        if (!this.likes.contains(member)) {
            throw new IllegalArgumentException("No match member found: " + member);
        }
        this.likes.remove(member);
        member.getLikes().remove(this);
    }

    protected void updatePost(PostUpdateRequest request, int total, int currTotal) {
        this.title = request.getTitle();
        this.content = request.getContent();
        this.contact = request.getContact();
        this.period.setPostEnd(LocalDateTime.ofInstant(request.getPostEnd().toInstant(), ZoneId.systemDefault()));
        this.period.setProjectStart(LocalDateTime.ofInstant(request.getProjectStart().toInstant(), ZoneId.systemDefault()));
        this.period.setProjectEnd(LocalDateTime.ofInstant(request.getProjectEnd().toInstant(), ZoneId.systemDefault()));
        this.total = total;
        this.currTotal = currTotal;
        this.remaining = total - currTotal;
        this.isCompleted = total == currTotal;
    }

    public PostReadOneResponse toResponse() {
        return new PostReadOneResponse(this);
    }
}
