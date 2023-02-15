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
    private int currTotal = 0;
    private boolean isCompleted = false;

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
                .postEnd(request.getPostEnd())
                .projectStart(request.getProjectStart())
                .projectEnd(request.getProjectEnd())
                .build();
        this.total = total;
        registerAuthor(author);
    }

    //=== 연관관계 메서드 ===//
    private void registerAuthor(Member author) {
        this.author = author;
        author.getPosts().add(this);
    }

    protected void updatePost(PostUpdateRequest request, int total, int currTotal) {
        this.title = request.getTitle();
        this.content = request.getContent();
        this.contact = request.getContact();
        this.period.setPostEnd(request.getPostEnd());
        this.period.setProjectStart(request.getProjectStart());
        this.period.setProjectEnd(request.getProjectEnd());
        this.total = total;
        this.currTotal = currTotal;
        this.isCompleted = total == currTotal;
    }

    public PostReadOneResponse toResponse() {
        return new PostReadOneResponse(this);
    }
}
