package com.hcu.hot6.domain;

import com.hcu.hot6.domain.request.MemberRequest;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import net.minidev.json.annotate.JsonIgnore;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {

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
    private String grade;
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
    public Member(String email, String pictureUrl, Department department, Position position, boolean isPublic, String nickname, String bio, String grade, String club, String contact, String externalLinks, List<Post> likes, List<Post> posts) {
        this.email = email;
        this.pictureUrl = pictureUrl;
        this.department = department;
        this.position = position;
        this.isPublic = isPublic;
        this.nickname = nickname;
        this.bio = bio;
        this.grade = grade;
        this.club = club;
        this.contact = contact;
        this.externalLinks = externalLinks;
        this.likes = likes;
        this.posts = posts;
    }

    public Member(Map<String, Object> attributes) {
        this.uid = (String) attributes.get("sub");
        this.email = (String) attributes.get("email");
        this.pictureUrl = (String) attributes.get("picture");
    }

    @Builder
    public Member(String uid, String email, String pictureUrl) {
        this.uid = uid;
        this.email = email;
        this.pictureUrl = pictureUrl;
    }

    public void update(MemberRequest form) {
        this.nickname = form.getNickname();
        this.isPublic = form.getIsPublic();

        this.department = form.getDepartment();
        this.position = form.getPosition();
        this.bio = form.getBio();
        this.grade = form.getGrade();
        this.contact = form.getContact();
        this.club = String.join(",", form.getClub());
        this.externalLinks = String.join(",", form.getExternalLinks());

    }
}