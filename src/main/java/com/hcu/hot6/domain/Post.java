package com.hcu.hot6.domain;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
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
    private List<Member> likedMembers = new ArrayList<>();

}
