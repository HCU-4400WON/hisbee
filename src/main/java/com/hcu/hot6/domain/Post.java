package com.hcu.hot6.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
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

    @Column(nullable = false)
    private LocalDateTime postStart;
    @Column(nullable = false)
    private LocalDateTime postEnd;
    @Column(nullable = false)
    private LocalDateTime projectStart;
    @Column(nullable = false)
    private LocalDateTime projectEnd;

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

}
