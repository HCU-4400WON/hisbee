package com.hcu.hot6.domain;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false)
    private boolean isPublic;

    @Enumerated(value = EnumType.STRING)
    private Department department;

    @Enumerated(value = EnumType.STRING)
    private Position position;

    private String bio;
    private int grade;
    private String club;
    private String contact;
    private String externalLinks;

    @ManyToMany(mappedBy = "likes")
    private List<Post> likes = new ArrayList<>();

    @OneToMany(mappedBy = "author")
    private List<Post> posts = new ArrayList<>();
    
}