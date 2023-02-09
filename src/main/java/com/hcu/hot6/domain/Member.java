package com.hcu.hot6.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import net.minidev.json.annotate.JsonIgnore;
import org.jetbrains.annotations.NotNull;
import org.springframework.util.Assert;

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

    @NotNull
    private String uid;

    @NotNull
    private String email;

    @NotNull
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
    @JsonIgnore
    private List<Post> likes = new ArrayList<>();

    @OneToMany(mappedBy = "author")
    @JsonIgnore
    private List<Post> posts = new ArrayList<>();

    //=== 생성 메서드 ===//
    @Builder(builderClassName = "ByMemberBuilder", builderMethodName = "ByMemberBuilder")
    public Member(String email, String nickname, boolean isPublic, Department department, Position position, String bio, int grade, String club, String contact, String externalLinks){
        Assert.hasText(email, "유저의 소셜로그인이메일(email)은 필수 입력사항입니다.");
        Assert.hasText(nickname, "유저의 닉네임(nickname)은 필수 입력사항입니다.");
        Assert.notNull(isPublic, "유저의 인재풀공개여부(isPublic)은 필수 입력사항입니다.");

        this.email = email;
        this.nickname = nickname;
        this.isPublic = isPublic;
        this.department = department;
        this.position = position;
        this.bio = bio;
        this.grade = grade;
        this.club = club;
        this.contact = contact;
        this.externalLinks = externalLinks;
    }
    
}