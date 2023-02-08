package com.hcu.hot6.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {

    @Builder
    public Member(String uid, String email, String pictureUrl) {
        this.uid = uid;
        this.email = email;
        this.pictureUrl = pictureUrl;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String uid;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String pictureUrl;

    @Enumerated(value = EnumType.STRING)
    private Department department;

    @Enumerated(value = EnumType.STRING)
    private Position position;

    private boolean isPublic = false;
    private String nickname;
    private String bio;
    private Integer grade;
    private String club;
    private String contact;
    private String externalLinks;

    @ManyToMany(mappedBy = "likes")
    private List<Post> likes = new ArrayList<>();

    @OneToMany(mappedBy = "author")
    private List<Post> posts = new ArrayList<>();
    
}