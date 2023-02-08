package com.hcu.hot6.domain;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.util.Assert;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@SuperBuilder
@Inheritance(strategy = InheritanceType.JOINED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DiscriminatorColumn(name = "dtype")
public abstract class Post {

    @Id @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String title;
    private String content;
    @Column(nullable = false)
    private String contact;

    @Embedded
    private Period period;

    @Column(nullable = false)
    private int total;
    @Column(nullable = false)
    private boolean isCompleted;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private Member author;

    @ManyToMany
    @JoinTable(name = "PostLike",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "member_id"))
    private List<Member> likes = new ArrayList<>();

    //=== 연관관계 메서드 ===//
    public void registerAuthor(Member author){
        this.author = author;
        author.getPosts().add(this);
    }

    @Builder
    public Post(String title, String content, String contact, LocalDateTime postEnd, LocalDateTime projectStart, LocalDateTime projectEnd, Member author, int total){
        Assert.notNull(title, "모집글의 제목(title)은 필수 입력사항입니다.");
        Assert.notNull(contact, "모집글의 문의처(contact)은 필수 입력사항입니다.");
        Assert.notNull(contact, "모집글의 작성자(author)은 필수 입력사항입니다.");

        Period period = Period.ByPeriodBuilder()
                .postEnd(postEnd)
                .projectStart(projectStart)
                .projectEnd(projectEnd)
                .build();

        this.title = title;
        this.content = content;
        this.contact = contact;
        this.period = period;
        this.total = total;
        this.isCompleted = false;
        this.registerAuthor(author);
    }

}
