package com.hcu.hot6.domain;

import com.hcu.hot6.domain.request.MemberRequest;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long id;

    @NotNull
    private String uid;

    @NotNull
    private String email;

    @NotNull
    private String pictureUrl;

    @Enumerated(value = EnumType.STRING)
    private Department department;

    private boolean isPublic = false;
    private String nickname;
    private String bio;
    private String grade;
    private String club;
    private String contact;
    private String externalLinks;
    private boolean isRegistered = true;

    @OneToMany(mappedBy = "member")
    private List<Like> likes = new ArrayList<>();

    @OneToMany(mappedBy = "author", orphanRemoval = true)
    private List<Post> posts = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    private List<Archive> archives = new ArrayList<>();

    //=== 생성 메서드 ===//
    @Builder(builderClassName = "ByMemberBuilder", builderMethodName = "ByMemberBuilder")
    public Member(String email, String pictureUrl, Department department, Position position, boolean isPublic, String nickname, String bio, String grade, String club, String contact, String externalLinks, List<Post> likes, List<Post> posts) {
        this.email = email;
        this.pictureUrl = pictureUrl;
        this.department = department;
        this.isPublic = isPublic;
        this.nickname = nickname;
        this.bio = bio;
        this.grade = grade;
        this.club = club;
        this.contact = contact;
        this.externalLinks = externalLinks;
        this.posts = posts;
    }

    @Builder
    public Member(String uid, String email, String pictureUrl, boolean isRegistered) {
        this.uid = uid;
        this.email = email;
        this.pictureUrl = pictureUrl;
        this.isRegistered = isRegistered;
    }

    public void update(MemberRequest form) {
        // 기본 정보
        this.nickname = Objects.isNull(form.getNickname()) ? nickname : form.getNickname();
        this.isPublic = Objects.isNull(form.getIsPublic()) ? isPublic : form.getIsPublic();
        this.pictureUrl = Objects.isNull(form.getPictureUrl()) ? pictureUrl : form.getPictureUrl();

        // 인재풀 등록시 필수 공개 정보
        this.department = Objects.isNull(form.getDepartment()) ? department : form.getDepartment();
        this.grade = Objects.isNull(form.getGrade()) ? grade : form.getGrade();
        this.contact = Objects.isNull(form.getContact()) ? contact : form.getContact();

        // 선택 정보
        this.bio = Objects.isNull(form.getBio()) ? bio : form.getBio();
        this.club = String.join(",", Optional.ofNullable(
                form.getClub()
        ).orElse(List.of()));
        this.externalLinks = String.join(",", Optional.ofNullable(
                form.getExternalLinks()
        ).orElse(List.of()));

        if (!this.isRegistered) this.isRegistered = true;
    }
}