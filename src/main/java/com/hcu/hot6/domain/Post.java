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

    private String title;
    private String content;
    private String contact;

    private LocalDateTime postStart;
    private LocalDateTime postEnd;
    private LocalDateTime projectStart;
    private LocalDateTime projectEnd;

    private int total;
    private boolean isCompleted;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private Member author;

    @ManyToMany
    @JoinTable(name = "PostLike",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "member_id"))
    private List<Member> likes = new ArrayList<>();

    //=== 연관관계 메서드 ===//
    public void changeAuthor(Member author){
        this.author = author;
        author.getPosts().add(this);
    }

}
