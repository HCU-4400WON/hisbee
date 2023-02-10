package com.hcu.hot6.domain;

import com.hcu.hot6.domain.request.PostUpdateRequest;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import net.minidev.json.annotate.JsonIgnore;
import org.jetbrains.annotations.NotNull;
import org.springframework.util.Assert;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@SuperBuilder
@Inheritance(strategy = InheritanceType.JOINED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DiscriminatorColumn(name = "dtype")
public abstract class Post {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="dtype", insertable = false, updatable = false)
    private String dtype;

    @NotNull
    private String title;
    private String content;
    @NotNull
    private String contact;

    @Embedded
    private Period period;

    private int total;

    @Column(nullable = false)
    private int currTotal;
    @Column(nullable = false)
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

    //=== 연관관계 메서드 ===//
    public void registerAuthor(Member author){
        this.author = author;
        author.getPosts().add(this);
    }

    //=== 생성 메서드 ===//
    public Post(String title, String content, String contact, Member author, int total){
        Assert.hasText(title, "모집글의 제목(title)은 필수 입력사항입니다.");
        Assert.hasText(contact, "모집글의 문의처(contact)은 필수 입력사항입니다.");
        Assert.notNull(author, "모집글의 작성자(author)은 필수 입력사항입니다.");
        Assert.notNull(total, "모집글의 모집 총 인원(total)은 필수 입력사항입니다.");

        this.title = title;
        this.content = content;
        this.contact = contact;
        this.total = total;
        this.isCompleted = false;
        this.registerAuthor(author);
    }

    protected void updatePost(PostUpdateRequest request, int total, int currTotal) {
        this.title = request.getTitle();
        this.content = request.getContent();
        this.contact = request.getContact();
        this.period.setPostEnd(request.getPostEnd());
        this.period.setProjectStart(request.getProjectStart());
        this.period.setProjectEnd(request.getProjectEnd());
        this.isCompleted = request.isCompleted();
        this.total = total;
        this.currTotal = currTotal;

        if(currTotal >= total) this.isCompleted = true;
    }
}
